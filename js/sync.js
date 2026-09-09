/** NightDeck day sync via Upstash Redis REST (nicknames/scores). */
(function (global) {
  const NS = "nightdeck:day:";
  const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  function cfg() {
    return global.NightDeckSyncConfig || null;
  }

  function dayKey(code) {
    return NS + String(code || "").toUpperCase();
  }

  function makeCode() {
    let out = "";
    for (let i = 0; i < 5; i++) out += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
    return out;
  }

  function makePlayerId() {
    return "p_" + Math.random().toString(36).slice(2, 10);
  }

  async function redis(command) {
    const c = cfg();
    if (!c || !c.restUrl || !c.restToken) {
      throw new Error("Sync config missing");
    }
    const res = await fetch(c.restUrl, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + c.restToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error("Upstash HTTP " + res.status + (text ? ": " + text.slice(0, 120) : ""));
    }
    const data = await res.json();
    return data.result;
  }

  async function getDay(code) {
    const raw = await redis(["GET", dayKey(code)]);
    if (!raw) return null;
    try {
      return typeof raw === "string" ? JSON.parse(raw) : raw;
    } catch {
      return null;
    }
  }

  async function setDay(day) {
    await redis(["SET", dayKey(day.code), JSON.stringify(day)]);
    return day;
  }

  async function createDay({ gameType, hostName }) {
    if (!["trivia", "identify", "music"].includes(gameType)) {
      throw new Error("Pick Trivia, Identify, or Music");
    }
    let code = makeCode();
    for (let i = 0; i < 6; i++) {
      const existing = await getDay(code);
      if (!existing) break;
      code = makeCode();
    }
    const day = {
      code,
      gameType,
      hostName: String(hostName || "").trim() || "Host",
      createdAt: Date.now(),
      players: [],
      status: "open",
    };
    await setDay(day);
    return day;
  }

  async function joinDay({ code, name }) {
    const day = await getDay(code);
    if (!day) return { ok: false, error: "Day not found — check the link or code." };
    if (day.status === "closed") return { ok: false, error: "This day is closed." };
    const playerName = String(name || "").trim() || "Player";
    let player = day.players.find((p) => p.name.toLowerCase() === playerName.toLowerCase());
    if (player) {
      return { ok: true, day, playerId: player.id, resumed: true };
    }
    player = {
      id: makePlayerId(),
      name: playerName,
      score: 0,
      finishedAt: null,
    };
    day.players.push(player);
    await setDay(day);
    return { ok: true, day, playerId: player.id, resumed: false };
  }

  async function submitScore({ code, playerId, score }) {
    const day = await getDay(code);
    if (!day) return { ok: false, error: "Day not found" };
    const player = day.players.find((p) => p.id === playerId);
    if (!player) return { ok: false, error: "Player not on this day" };
    player.score = Math.max(0, Number(score) || 0);
    player.finishedAt = Date.now();
    await setDay(day);
    return { ok: true, day };
  }

  async function listScores(code) {
    const day = await getDay(code);
    if (!day) return { ok: false, error: "Day not found", players: [] };
    const players = (day.players || [])
      .slice()
      .sort((a, b) => {
        const af = a.finishedAt ? 0 : 1;
        const bf = b.finishedAt ? 0 : 1;
        if (af !== bf) return af - bf;
        return (b.score || 0) - (a.score || 0) || String(a.name).localeCompare(String(b.name));
      });
    return { ok: true, day, players };
  }

  function poll(fn, ms) {
    const interval = Math.max(1000, ms || 2000);
    let stopped = false;
    let timer = null;
    async function tick() {
      if (stopped) return;
      try {
        await fn();
      } catch (err) {
        console.warn("NightDeck poll", err);
      }
      if (!stopped) timer = setTimeout(tick, interval);
    }
    tick();
    return function stop() {
      stopped = true;
      if (timer) clearTimeout(timer);
    };
  }

  function dayUrl(code, base) {
    const root = (base || (location.origin + location.pathname.replace(/[^/]*$/, ""))).replace(/\/?$/, "/");
    return root + "day.html?d=" + encodeURIComponent(String(code || "").toUpperCase());
  }

  function boardUrl(code, base) {
    const root = (base || (location.origin + location.pathname.replace(/[^/]*$/, ""))).replace(/\/?$/, "/");
    return root + "board.html?d=" + encodeURIComponent(String(code || "").toUpperCase());
  }

  const SESSION_KEY = "nightdeck:daySession";
  const RUN_KEY = "nightdeck:run";

  function saveSession(session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
  function loadSession() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    } catch {
      return null;
    }
  }
  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }
  function saveRun(run) {
    localStorage.setItem(RUN_KEY, JSON.stringify(run));
  }
  function loadRun() {
    try {
      return JSON.parse(localStorage.getItem(RUN_KEY) || "null");
    } catch {
      return null;
    }
  }
  function clearRun() {
    localStorage.removeItem(RUN_KEY);
  }

  /** Local-only solo day (no Upstash). */
  function createSoloDay({ gameType, hostName }) {
    const code = "SOLO" + CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
    return {
      code,
      gameType,
      hostName: String(hostName || "").trim() || "You",
      createdAt: Date.now(),
      players: [],
      status: "open",
      solo: true,
    };
  }

  global.NightDeckSync = {
    createDay,
    getDay,
    joinDay,
    submitScore,
    listScores,
    poll,
    dayUrl,
    boardUrl,
    makeCode,
    makePlayerId,
    saveSession,
    loadSession,
    clearSession,
    saveRun,
    loadRun,
    clearRun,
    createSoloDay,
    setDay,
  };
})(window);
