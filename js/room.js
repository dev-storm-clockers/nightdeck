/** NightDeck room create/join + localStorage + BroadcastChannel sync. */
(function (global) {
  const PREFIX = "nightdeck:room:";
  const CHANNEL = "nightdeck-rooms";
  /** Staff Night: start with ≥2 humans, or Solo demo. */
  const MIN_HUMANS = 2;
  const MAX_PLAYERS = 12;

  const BOT_NAMES = [
    "Avery",
    "Blake",
    "Casey",
    "Drew",
    "Ellis",
    "Finley",
    "Gray",
    "Harper",
    "Indy",
    "Jules",
    "Kai",
    "Logan",
  ];

  function codeChars() {
    return "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  }

  function makeRoomCode() {
    const chars = codeChars();
    let out = "";
    for (let i = 0; i < 5; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return out;
  }

  function makePlayerId() {
    return "p_" + Math.random().toString(36).slice(2, 10);
  }

  function storageKey(code) {
    return PREFIX + String(code || "").toUpperCase();
  }

  function readRoom(code) {
    try {
      const raw = localStorage.getItem(storageKey(code));
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function writeRoom(room) {
    localStorage.setItem(storageKey(room.code), JSON.stringify(room));
    broadcast(room.code, { type: "room-update", code: room.code });
  }

  let channel = null;
  const listeners = new Set();

  function getChannel() {
    if (!channel && typeof BroadcastChannel !== "undefined") {
      channel = new BroadcastChannel(CHANNEL);
      channel.onmessage = (ev) => {
        const msg = ev.data || {};
        if (msg.type === "room-update" && msg.code) {
          listeners.forEach((fn) => fn(msg.code));
        }
      };
    }
    return channel;
  }

  function broadcast(code, payload) {
    try {
      getChannel()?.postMessage(payload);
    } catch {
      /* ignore */
    }
  }

  function subscribe(fn) {
    getChannel();
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  function emptyUsed() {
    return { trivia: [], identify: [], music: [] };
  }

  function createRoom({ hostName }) {
    const code = makeRoomCode();
    const playerId = makePlayerId();
    const room = {
      code,
      createdAt: Date.now(),
      status: "lobby", // lobby | playing | ended
      hostId: playerId,
      soloDemo: false,
      players: [
        { id: playerId, name: (hostName || "").trim() || "Host", score: 0, connected: true, bot: false },
      ],
      round: 0,
      phase: "lobby", // lobby | picking | answering | reveal | ended
      current: null,
      used: emptyUsed(),
      packs: null,
      history: [],
      endedAt: null,
    };
    writeRoom(room);
    return { room, playerId };
  }

  function joinRoom({ code, playerName }) {
    const room = readRoom(code);
    if (!room) {
      return { ok: false, error: "Room not found — same browser / device for now (local rooms)." };
    }
    if (room.status === "ended") return { ok: false, error: "That night already ended." };
    const name = (playerName || "").trim() || "Player";
    const existing = room.players.find((p) => p.name.toLowerCase() === name.toLowerCase());
    let playerId;
    if (existing) {
      playerId = existing.id;
      existing.connected = true;
    } else {
      if (room.status !== "lobby") {
        return { ok: false, error: "Night already started — jump in before Start." };
      }
      if (room.players.length >= MAX_PLAYERS) {
        return { ok: false, error: "Room is full (" + MAX_PLAYERS + " seats)." };
      }
      playerId = makePlayerId();
      room.players.push({ id: playerId, name, score: 0, connected: true, bot: false });
    }
    writeRoom(room);
    return { ok: true, room, playerId };
  }

  function fillSoloBots(room) {
    if (!room || room.status !== "lobby") {
      return { ok: false, error: "Solo demo only from lobby" };
    }
    room.soloDemo = true;
    let i = 0;
    while (room.players.length < 3 && room.players.length < MAX_PLAYERS) {
      const name = BOT_NAMES[i % BOT_NAMES.length];
      i += 1;
      if (room.players.some((p) => p.name === name)) continue;
      room.players.push({
        id: makePlayerId(),
        name,
        score: 0,
        connected: true,
        bot: true,
      });
    }
    writeRoom(room);
    return { ok: true, room };
  }

  function addBotsTo(room, targetCount) {
    if (!room || room.status !== "lobby") {
      return { ok: false, error: "Bots only in lobby" };
    }
    const target = Math.min(MAX_PLAYERS, Math.max(room.players.length, targetCount | 0));
    room.soloDemo = true;
    let i = 0;
    while (room.players.length < target) {
      const base = BOT_NAMES[i % BOT_NAMES.length];
      const name = i >= BOT_NAMES.length ? base + " " + (i + 1) : base;
      i += 1;
      if (room.players.some((p) => p.name === name)) continue;
      room.players.push({
        id: makePlayerId(),
        name,
        score: 0,
        connected: true,
        bot: true,
      });
    }
    writeRoom(room);
    return { ok: true, room };
  }

  function humanCount(room) {
    return (room.players || []).filter((p) => !p.bot).length;
  }

  function canStart(room) {
    if (!room || room.status !== "lobby") return false;
    if (room.soloDemo && room.players.length >= 2) return true;
    return humanCount(room) >= MIN_HUMANS;
  }

  function sessionKey() {
    return "nightdeck:session";
  }

  function saveSession(session) {
    localStorage.setItem(sessionKey(), JSON.stringify(session));
  }

  function loadSession() {
    try {
      return JSON.parse(localStorage.getItem(sessionKey()) || "null");
    } catch {
      return null;
    }
  }

  function clearSession() {
    localStorage.removeItem(sessionKey());
  }

  global.NightDeckRoom = {
    MIN_HUMANS,
    MAX_PLAYERS,
    makeRoomCode,
    makePlayerId,
    readRoom,
    writeRoom,
    createRoom,
    joinRoom,
    fillSoloBots,
    addBotsTo,
    canStart,
    humanCount,
    subscribe,
    saveSession,
    loadSession,
    clearSession,
    emptyUsed,
  };
})(window);
