/** NightDeck — self-paced day runs (one game type) + helpers. */
(function (global) {
  const QUESTIONS_PER_RUN = 8;

  function normalize(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function words(s) {
    return normalize(s).split(" ").filter(Boolean);
  }

  /** Consecutive word-sequence containment (typed guesses only). */
  function containsWordSeq(hayWords, needleWords) {
    if (!needleWords.length || needleWords.length > hayWords.length) return false;
    for (let i = 0; i <= hayWords.length - needleWords.length; i++) {
      let ok = true;
      for (let j = 0; j < needleWords.length; j++) {
        if (hayWords[i + j] !== needleWords[j]) {
          ok = false;
          break;
        }
      }
      if (ok) return true;
    }
    return false;
  }

  /**
   * Typed identify/music grading.
   * Exact normalize on answer + each accept alias.
   * Optional careful multi-word containment (never used for MCQ reveal).
   */
  function matchesAccept(guess, item) {
    const g = normalize(guess);
    if (!g) return false;
    const answer = normalize(item.answer);
    if (answer && g === answer) return true;
    const accept = item.accept || [];
    for (const a of accept) {
      const n = normalize(a);
      if (n && g === n) return true;
    }
    // Careful: multi-word phrase contained as whole words (typed only)
    const gw = words(g);
    if (answer) {
      const aw = words(answer);
      if (gw.length >= 2 && containsWordSeq(aw, gw)) return true;
      if (aw.length >= 2 && containsWordSeq(gw, aw)) return true;
    }
    for (const a of accept) {
      const n = normalize(a);
      if (!n) continue;
      const aw = words(n);
      if (gw.length >= 2 && containsWordSeq(aw, gw)) return true;
      if (aw.length >= 2 && containsWordSeq(gw, aw)) return true;
    }
    return false;
  }

  /** Reveal / MCQ: exactly one option — by correctIndex or exact answer text. */
  function isOptionCorrect(item, opt, idx) {
    if (typeof item.correctIndex === "number" && item.correctIndex >= 0) {
      return idx === item.correctIndex;
    }
    if (typeof item.correct === "number" && item.correct >= 0 && Array.isArray(item.options)) {
      return idx === item.correct;
    }
    return normalize(opt) === normalize(item.answer);
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  function snapshotItem(type, item) {
    if (type === "trivia") {
      const raw = (item.options || []).slice();
      const answerText = raw[item.correct];
      const options = shuffle(raw);
      const correctIndex = options.findIndex((o) => o === answerText);
      return {
        type,
        q: item.q,
        options,
        correct: correctIndex,
        correctIndex,
        answer: answerText,
        difficulty: item.difficulty || null,
      };
    }
    if (type === "identify") {
      const options = shuffle((item.options || []).slice());
      const answer = item.answer;
      let correctIndex = options.findIndex((o) => normalize(o) === normalize(answer));
      if (correctIndex < 0) correctIndex = options.findIndex((o) => o === answer);
      return {
        type,
        prompt: item.prompt,
        clue: item.clue || "",
        options,
        correctIndex,
        answer,
        accept: (item.accept || []).slice(),
      };
    }
    const options = shuffle((item.options || []).slice());
    const answer = item.answer;
    let correctIndex = options.findIndex((o) => normalize(o) === normalize(answer));
    if (correctIndex < 0) correctIndex = options.findIndex((o) => o === answer);
    return {
      type: "music",
      cue: item.cue,
      hint: item.hint || "",
      options,
      correctIndex,
      answer,
      accept: (item.accept || []).slice(),
    };
  }

  function gradeAnswer(item, answerText) {
    const text = String(answerText || "").trim();
    if (!text) return false;
    if (item.type === "trivia") {
      return normalize(text) === normalize(item.answer);
    }
    // Identify / Music typed or MCQ text: exact option match OR accept aliases
    if (Array.isArray(item.options)) {
      const hit = item.options.find((o) => normalize(o) === normalize(text));
      if (hit) return normalize(hit) === normalize(item.answer);
    }
    return matchesAccept(text, item);
  }

  function startRun({ gameType, pack, dayCode, playerId, playerName, total }) {
    const items = (pack && pack.items) || [];
    const count = Math.min(total || QUESTIONS_PER_RUN, items.length || 0);
    if (!count) throw new Error("No questions in pack");
    const indices = shuffle(items.map((_, i) => i)).slice(0, count);
    const queue = indices.map((index) => ({
      index,
      item: snapshotItem(gameType, items[index]),
    }));
    return {
      gameType,
      subject: (pack && pack.subject) || null,
      dayCode,
      playerId,
      playerName,
      queue,
      cursor: 0,
      score: 0,
      answers: [],
      phase: "answering",
      currentGuess: null,
      currentCorrect: null,
      startedAt: Date.now(),
      finishedAt: null,
    };
  }

  function currentQuestion(run) {
    if (!run || run.cursor >= run.queue.length) return null;
    return run.queue[run.cursor];
  }

  function lockAndReveal(run, answerText) {
    if (!run || run.phase !== "answering") return { ok: false, error: "Not answering" };
    const cur = currentQuestion(run);
    if (!cur) return { ok: false, error: "No question" };
    const guess = String(answerText || "").trim();
    if (!guess) return { ok: false, error: "Pick or type something" };
    const correct = gradeAnswer(cur.item, guess);
    run.currentGuess = guess;
    run.currentCorrect = correct;
    run.phase = "reveal";
    if (correct) run.score += 1;
    run.answers.push({
      index: cur.index,
      guess,
      correct,
      answer: cur.item.answer,
    });
    return { ok: true, correct, answer: cur.item.answer };
  }

  function nextQuestion(run) {
    if (!run || run.phase !== "reveal") return { ok: false, error: "Reveal first" };
    run.cursor += 1;
    run.currentGuess = null;
    run.currentCorrect = null;
    if (run.cursor >= run.queue.length) {
      run.phase = "done";
      run.finishedAt = Date.now();
      return { ok: true, done: true };
    }
    run.phase = "answering";
    return { ok: true, done: false };
  }

  function progress(run) {
    if (!run) return { index: 0, total: 0, score: 0 };
    return {
      index: Math.min(run.cursor + 1, run.queue.length),
      total: run.queue.length,
      score: run.score,
      phase: run.phase,
    };
  }

  const SUBJECT_TITLES = {
    general: "General Knowledge",
    pop: "Pop Culture",
    movies: "Movies & TV",
    science: "Science & Nature",
    geo: "Geography",
    food: "Food & Drink",
    decades: "Decades (90s/2000s)",
    mixed: "Mixed Staff Night",
  };

  function typeLabel(type) {
    return { trivia: "Trivia", identify: "Identify", music: "Music" }[type] || type;
  }

  function typeEmoji(type) {
    return { trivia: "🧠", identify: "🔍", music: "🎵" }[type] || "🎮";
  }

  function subjectLabel(subject) {
    if (!subject) return "";
    return SUBJECT_TITLES[subject] || subject;
  }

  function typeLine(gameType, subject) {
    const base = typeLabel(gameType);
    if (gameType === "trivia" && subject) return base + " · " + subjectLabel(subject);
    return base;
  }

  function shareText({ dayCode, gameType, subject, playerName, score, total }) {
    return [
      "NightDeck Staff Night",
      typeLine(gameType, subject) + " · day " + dayCode,
      (playerName || "Player") + " — " + score + "/" + total,
      "",
      "Played on NightDeck",
    ].join("\n");
  }

  function rankedPlayers(players) {
    return (players || [])
      .slice()
      .sort((a, b) => (b.score || 0) - (a.score || 0) || String(a.name).localeCompare(String(b.name)));
  }

  global.NightDeckGame = {
    QUESTIONS_PER_RUN,
    startRun,
    currentQuestion,
    lockAndReveal,
    nextQuestion,
    progress,
    gradeAnswer,
    matchesAccept,
    isOptionCorrect,
    normalize,
    typeLabel,
    typeEmoji,
    subjectLabel,
    typeLine,
    shareText,
    rankedPlayers,
    snapshotItem,
  };
})(window);
