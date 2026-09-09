/** NightDeck content packs — trivia / identify / music. */
(function (global) {
  const PACKS = {
    trivia: { id: "trivia", name: "Trivia", path: "data/trivia.json", emoji: "🧠" },
    identify: { id: "identify", name: "Identify", path: "data/identify.json", emoji: "🔍" },
    music: { id: "music", name: "Music", path: "data/music.json", emoji: "🎵" },
  };

  async function loadPack(id) {
    const meta = PACKS[id];
    if (!meta) throw new Error("Unknown pack: " + id);
    const res = await fetch(meta.path);
    if (!res.ok) throw new Error("Failed to load " + id);
    const data = await res.json();
    return {
      id: meta.id,
      name: data.title || meta.name,
      emoji: meta.emoji,
      items: data.items || [],
    };
  }

  async function loadAll() {
    const [trivia, identify, music] = await Promise.all([
      loadPack("trivia"),
      loadPack("identify"),
      loadPack("music"),
    ]);
    return { trivia, identify, music };
  }

  function listPacks() {
    return Object.values(PACKS).map((p) => ({ id: p.id, name: p.name, emoji: p.emoji }));
  }

  global.NightDeckCatalog = {
    PACKS,
    loadPack,
    loadAll,
    listPacks,
  };
})(window);
