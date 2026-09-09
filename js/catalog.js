/** NightDeck deck catalog + unlock gate (staff-night: Lobby Warmup default). */
(function (global) {
  const UNLOCK_STORAGE = "nightdeck:unlocks";
  const DECKS = {
    "lobby-warmup": {
      id: "lobby-warmup",
      name: "Lobby Warmup",
      free: true,
      featured: true,
      path: "data/lobby-warmup.json",
    },
    "group-chat-unhinged": {
      id: "group-chat-unhinged",
      name: "Group Chat Unhinged",
      free: false,
      featured: false,
      staffHide: true,
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
    return { ok: false, error: "Invalid unlock code" };
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

  function listDecks(opts) {
    const staff = !opts || opts.staff !== false;
    return Object.values(DECKS)
      .filter((d) => {
        if (!staff) return true;
        // Staff night: only show locked packs if already unlocked; never feature them
        if (d.staffHide && !isUnlocked(d.id)) return false;
        return true;
      })
      .map((d) => ({
        id: d.id,
        name: d.name,
        free: d.free,
        featured: !!d.featured,
        unlocked: isUnlocked(d.id),
        staffHide: !!d.staffHide,
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
