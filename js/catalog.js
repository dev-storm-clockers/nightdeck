/** NightDeck content packs — trivia (by subject) / identify / music. */
(function (global) {
  const SUBJECTS = [
    { id: "general", title: "General Knowledge", emoji: "🌍", blurb: "Everyday facts" },
    { id: "pop", title: "Pop Culture", emoji: "✨", blurb: "Shows, stars, trends" },
    { id: "movies", title: "Movies & TV", emoji: "🎬", blurb: "Screens & series" },
    { id: "science", title: "Science & Nature", emoji: "🔬", blurb: "How the world works" },
    { id: "geo", title: "Geography", emoji: "🗺️", blurb: "Places & planet" },
    { id: "food", title: "Food & Drink", emoji: "🍽️", blurb: "Kitchen & cuisine" },
    { id: "decades", title: "Decades (90s/2000s)", emoji: "📼", blurb: "Nostalgia hits" },
    { id: "mixed", title: "Mixed Staff Night", emoji: "🎲", blurb: "Balanced mix" },
  ];

  const SUBJECT_MAP = Object.fromEntries(SUBJECTS.map((s) => [s.id, s]));

  const PACKS = {
    trivia: { id: "trivia", name: "Trivia", emoji: "🧠", subjects: true },
    identify: { id: "identify", name: "Identify", path: "data/identify.json", emoji: "🔍" },
    music: { id: "music", name: "Music", path: "data/music.json", emoji: "🎵" },
  };

  function subjectMeta(id) {
    return SUBJECT_MAP[id] || null;
  }

  function subjectLabel(id) {
    const s = subjectMeta(id);
    return s ? s.title : id || "";
  }

  function subjectEmoji(id) {
    const s = subjectMeta(id);
    return s ? s.emoji : "🧠";
  }

  function listSubjects() {
    return SUBJECTS.slice();
  }

  async function loadPack(id, subject) {
    const meta = PACKS[id];
    if (!meta) throw new Error("Unknown pack: " + id);

    if (id === "trivia") {
      const sid = subject || "mixed";
      if (!SUBJECT_MAP[sid]) throw new Error("Unknown trivia subject: " + sid);
      const res = await fetch("data/trivia/" + sid + ".json");
      if (!res.ok) throw new Error("Failed to load trivia/" + sid);
      const data = await res.json();
      const sub = SUBJECT_MAP[sid];
      return {
        id: "trivia",
        name: data.title || sub.title,
        emoji: sub.emoji,
        subject: sid,
        subjectTitle: data.title || sub.title,
        items: data.items || [],
      };
    }

    const res = await fetch(meta.path);
    if (!res.ok) throw new Error("Failed to load " + id);
    const data = await res.json();
    return {
      id: meta.id,
      name: data.title || meta.name,
      emoji: meta.emoji,
      subject: null,
      items: data.items || [],
    };
  }

  async function loadAll() {
    const [trivia, identify, music] = await Promise.all([
      loadPack("trivia", "mixed"),
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
    SUBJECTS,
    loadPack,
    loadAll,
    listPacks,
    listSubjects,
    subjectMeta,
    subjectLabel,
    subjectEmoji,
  };
})(window);
