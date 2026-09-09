/** NightDeck room create/join + localStorage + BroadcastChannel sync. */
(function (global) {
  const PREFIX = "nightdeck:room:";
  const CHANNEL = "nightdeck-rooms";
  const MIN_PLAYERS = 3;
  /** Staff night: at least 12 seats. */
  const MAX_PLAYERS = 12;
  /** Short rounds; host can end anytime. Plenty for a long hang. */
  const ROUND_CAP = 12;
  /** Smaller hand = faster pick/submit. */
  const HAND_SIZE = 4;
  /**
   * Judge window default: 60 minutes (pause-friendly).
   * No auto-advance — judge picks when ready. Soft hint only.
   */
  const JUDGE_WINDOW_MS = 60 * 60 * 1000;

  const BOT_NAMES = [
    "Bot Avery",
    "Bot Blake",
    "Bot Casey",
    "Bot Drew",
    "Bot Ellis",
    "Bot Finley",
    "Bot Gray",
    "Bot Harper",
    "Bot Indy",
    "Bot Jules",
    "Bot Kai",
    "Bot Logan",
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

  function createRoom({ hostName, deckId }) {
    const code = makeRoomCode();
    const playerId = makePlayerId();
    const room = {
      code,
      createdAt: Date.now(),
      deckId: deckId || "lobby-warmup",
      status: "lobby", // lobby | playing | ended
      hostId: playerId,
      soloDemo: false,
      players: [
        { id: playerId, name: hostName.trim() || "Host", score: 0, connected: true, bot: false },
      ],
      round: 0,
      roundCap: ROUND_CAP,
      judgeIndex: 0,
      judgeOpenedAt: null,
      judgeWindowMs: JUDGE_WINDOW_MS,
      prompt: null,
      promptIndex: 0,
      usedPrompts: [],
      usedAnswers: [],
      hands: {},
      submissions: {}, // playerId -> answer text
      revealed: false,
      winnerId: null,
      winnerAnswer: null,
      phase: "lobby", // lobby | submit | judge | reveal
      deckSnapshot: null,
      endedAt: null,
    };
    writeRoom(room);
    return { room, playerId };
  }

  function joinRoom({ code, playerName }) {
    const room = readRoom(code);
    if (!room) return { ok: false, error: "Room not found. Same browser tabs only for this mock." };
    if (room.status === "ended") return { ok: false, error: "This room already ended." };
    const name = (playerName || "").trim() || "Player";
    const existing = room.players.find(
      (p) => p.name.toLowerCase() === name.toLowerCase()
    );
    let playerId;
    if (existing) {
      playerId = existing.id;
      existing.connected = true;
    } else {
      if (room.status !== "lobby") {
        return { ok: false, error: "Game already started — join before start." };
      }
      const humansAndBots = room.players.length;
      if (humansAndBots >= MAX_PLAYERS) {
        return { ok: false, error: "Room is full (" + MAX_PLAYERS + " seats)." };
      }
      playerId = makePlayerId();
      room.players.push({ id: playerId, name, score: 0, connected: true, bot: false });
    }
    writeRoom(room);
    return { ok: true, room, playerId };
  }

  /** Fill bots up to MIN_PLAYERS for solo host testing. Demo-only. */
  function fillSoloBots(room) {
    if (!room || room.status !== "lobby") {
      return { ok: false, error: "Solo demo only from lobby" };
    }
    room.soloDemo = true;
    let i = 0;
    while (room.players.length < MIN_PLAYERS && room.players.length < MAX_PLAYERS) {
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

  /** Optional: add bots up to a target seat count (≤ MAX). Host testing / padding. */
  function addBotsTo(room, targetCount) {
    if (!room || room.status !== "lobby") {
      return { ok: false, error: "Bots only in lobby" };
    }
    const target = Math.min(MAX_PLAYERS, Math.max(room.players.length, targetCount | 0));
    room.soloDemo = true;
    let i = 0;
    while (room.players.length < target) {
      const name = BOT_NAMES[i % BOT_NAMES.length] + (i >= BOT_NAMES.length ? " " + (i + 1) : "");
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

  function canStart(room) {
    return room && room.status === "lobby" && room.players.length >= MIN_PLAYERS;
  }

  function humanCount(room) {
    return (room.players || []).filter((p) => !p.bot).length;
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
    MIN_PLAYERS,
    MAX_PLAYERS,
    ROUND_CAP,
    HAND_SIZE,
    JUDGE_WINDOW_MS,
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
  };
})(window);
