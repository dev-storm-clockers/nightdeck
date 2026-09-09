/** NightDeck deck catalog + unlock gate (Pass 1 mock). */
(function (global) {
  const UNLOCK_STORAGE = "nightdeck:unlocks";
  const DECKS = {
    "lobby-warmup": {
      id: "lobby-warmup",
      name: "Lobby Warmup",
      free: true,
      path: "data/lobby-warmup.json",
    },
    "group-chat-unhinged": {
      id: "group-chat-unhinged",
      name: "Group Chat Unhinged",
      free: false,
      unlockCode: "NIGHTDECK-GCU",
      path: "data/group-chat-unhinged.json",
    },
  };

  function getUnlocks() {
    try {
      return JSON.parse(localStorage.getItem(UNLOCK_STORAGE) || "{}");
    } catch {
      return {};
    }
  }

  function saveUnlocks(map) {
    localStorage.setItem(UNLOCK_STORAGE, JSON.stringify(map));
  }

  function isUnlocked(deckId) {
    const meta = DECKS[deckId];
    if (!meta) return false;
    if (meta.free) return true;
    return !!getUnlocks()[deckId];
  }

  function tryUnlock(code) {
    const normalized = String(code || "").trim().toUpperCase();
    for (const meta of Object.values(DECKS)) {
      if (!meta.free && meta.unlockCode === normalized) {
        const map = getUnlocks();
        map[meta.id] = true;
        saveUnlocks(map);
        return { ok: true, deckId: meta.id, name: meta.name };
      }
    }
    return { ok: false, error: "Invalid unlock code — try NIGHTDECK-GCU for Group Chat Unhinged" };
  }

  async function loadDeck(deckId) {
    const meta = DECKS[deckId];
    if (!meta) throw new Error("Unknown deck: " + deckId);
    if (!isUnlocked(deckId)) {
      throw new Error("Deck locked — unlock " + meta.name + " with its code (Lobby Warmup stays free).");
    }
    const res = await fetch(meta.path);
    if (!res.ok) throw new Error("Failed to load deck " + deckId);
    const data = await res.json();
    return {
      id: meta.id,
      name: meta.name,
      free: meta.free,
      prompts: data.prompts || [],
      answers: data.answers || [],
    };
  }

  function listDecks() {
    return Object.values(DECKS).map((d) => ({
      id: d.id,
      name: d.name,
      free: d.free,
      unlocked: isUnlocked(d.id),
    }));
  }

  global.NightDeckCatalog = {
    DECKS,
    listDecks,
    isUnlocked,
    tryUnlock,
    loadDeck,
  };
})(window);
