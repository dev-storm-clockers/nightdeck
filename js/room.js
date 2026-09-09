/** NightDeck room create/join + localStorage + BroadcastChannel sync. */
(function (global) {
  const PREFIX = "nightdeck:room:";
  const CHANNEL = "nightdeck-rooms";
  const MIN_PLAYERS = 3;
  const ROUND_CAP = 8;
  const HAND_SIZE = 5;

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
      players: [
        { id: playerId, name: hostName.trim() || "Host", score: 0, connected: true },
      ],
      round: 0,
      roundCap: ROUND_CAP,
      judgeIndex: 0,
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
    if (!room) return { ok: false, error: "Room not found. Same browser tabs only for Pass 1 mock." };
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
      playerId = makePlayerId();
      room.players.push({ id: playerId, name, score: 0, connected: true });
    }
    writeRoom(room);
    return { ok: true, room, playerId };
  }

  function canStart(room) {
    return room && room.status === "lobby" && room.players.length >= MIN_PLAYERS;
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
    ROUND_CAP,
    HAND_SIZE,
    makeRoomCode,
    makePlayerId,
    readRoom,
    writeRoom,
    createRoom,
    joinRoom,
    canStart,
    subscribe,
    saveSession,
    loadSession,
    clearSession,
  };
})(window);
