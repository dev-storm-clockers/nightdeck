/** NightDeck Staff Night — trivia / identify / music rounds. */
(function (global) {
  const Room = () => global.NightDeckRoom;

  function normalize(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function matchesAccept(guess, item) {
    const g = normalize(guess);
    if (!g) return false;
    const answer = normalize(item.answer);
    if (answer && (g === answer || answer.includes(g) || g.includes(answer))) return true;
    const accept = item.accept || [];
    for (const a of accept) {
      const n = normalize(a);
      if (!n) continue;
      if (g === n || g.includes(n) || n.includes(g)) return true;
    }
    // Exact option match
    if (Array.isArray(item.options)) {
      for (const opt of item.options) {
        if (normalize(opt) === g) {
          return normalize(opt) === normalize(item.answer);
        }
      }
    }
    return false;
  }

  function pickUnused(pack, usedList) {
    const items = pack.items || [];
    const available = items
      .map((item, index) => ({ item, index }))
      .filter((x) => !usedList.includes(x.index));
    if (!available.length) {
      // recycle
      return items.length
        ? { item: items[Math.floor(Math.random() * items.length)], index: Math.floor(Math.random() * items.length), recycled: true }
        : null;
    }
    return available[Math.floor(Math.random() * available.length)];
  }

  function snapshotItem(type, item) {
    if (type === "trivia") {
      return {
        type,
        q: item.q,
        options: item.options.slice(),
        correct: item.correct,
        answer: item.options[item.correct],
      };
    }
    if (type === "identify") {
      return {
        type,
        prompt: item.prompt,
        clue: item.clue || "",
        options: (item.options || []).slice(),
        answer: item.answer,
        accept: (item.accept || []).slice(),
      };
    }
    return {
      type: "music",
      cue: item.cue,
      hint: item.hint || "",
      options: (item.options || []).slice(),
      answer: item.answer,
      accept: (item.accept || []).slice(),
    };
  }

  function startNight(room, packs) {
    room.packs = {
      trivia: { id: packs.trivia.id, name: packs.trivia.name, items: packs.trivia.items },
      identify: { id: packs.identify.id, name: packs.identify.name, items: packs.identify.items },
      music: { id: packs.music.id, name: packs.music.name, items: packs.music.items },
    };
    room.status = "playing";
    room.phase = "picking";
    room.round = 0;
    room.current = null;
    room.used = Room().emptyUsed();
    room.history = [];
    room.endedAt = null;
    Room().writeRoom(room);
    return room;
  }

  function startRound(room, type) {
    if (room.status !== "playing") return { ok: false, error: "Night not in play" };
    if (room.phase !== "picking" && room.phase !== "reveal") {
      return { ok: false, error: "Finish the current round first" };
    }
    if (!["trivia", "identify", "music"].includes(type)) {
      return { ok: false, error: "Unknown round type" };
    }
    const pack = room.packs && room.packs[type];
    if (!pack) return { ok: false, error: "Packs not loaded" };

    const used = room.used[type] || [];
    const pick = pickUnused(pack, used);
    if (!pick) return { ok: false, error: "No items left" };

    if (!pick.recycled) {
      room.used[type] = used.concat([pick.index]);
    } else {
      room.used[type] = [pick.index];
    }

    room.round += 1;
    room.phase = "answering";
    room.current = {
      type,
      index: pick.index,
      item: snapshotItem(type, pick.item),
      answers: {},
      locked: {},
      correctMap: {},
      revealed: false,
      scored: false,
      openedAt: Date.now(),
    };
    Room().writeRoom(room);
    runBotAnswers(room);
    return { ok: true };
  }

  function lockAnswer(room, playerId, answerText) {
    if (room.phase !== "answering" || !room.current) {
      return { ok: false, error: "Not answering right now" };
    }
    const player = room.players.find((p) => p.id === playerId);
    if (!player) return { ok: false, error: "Unknown player" };
    if (room.current.locked[playerId]) {
      return { ok: false, error: "Already locked in" };
    }
    const text = String(answerText || "").trim();
    if (!text) return { ok: false, error: "Pick or type something" };

    room.current.answers[playerId] = text;
    room.current.locked[playerId] = true;
    Room().writeRoom(room);
    return { ok: true };
  }

  function runBotAnswers(room) {
    if (!room || room.phase !== "answering" || !room.current) return;
    const item = room.current.item;
    for (const p of room.players) {
      if (!p.bot) continue;
      if (room.current.locked[p.id]) continue;
      let answer;
      if (item.type === "trivia") {
        // ~55% correct for fun solo demos
        if (Math.random() < 0.55) {
          answer = item.options[item.correct];
        } else {
          const wrong = item.options.filter((_, i) => i !== item.correct);
          answer = wrong[Math.floor(Math.random() * wrong.length)] || item.options[0];
        }
      } else {
        if (Math.random() < 0.5) {
          answer = item.answer;
        } else if (item.options && item.options.length) {
          answer = item.options[Math.floor(Math.random() * item.options.length)];
        } else {
          answer = "No idea";
        }
      }
      room.current.answers[p.id] = answer;
      room.current.locked[p.id] = true;
    }
    Room().writeRoom(room);
  }

  function autoGrade(room) {
    const cur = room.current;
    if (!cur) return;
    const item = cur.item;
    cur.correctMap = cur.correctMap || {};
    for (const p of room.players) {
      const ans = cur.answers[p.id];
      if (ans == null) {
        cur.correctMap[p.id] = false;
        continue;
      }
      if (item.type === "trivia") {
        cur.correctMap[p.id] = normalize(ans) === normalize(item.answer);
      } else {
        cur.correctMap[p.id] = matchesAccept(ans, item);
      }
    }
  }

  function revealRound(room) {
    if (room.phase !== "answering" || !room.current) {
      return { ok: false, error: "Nothing to reveal" };
    }
    room.current.revealed = true;
    room.phase = "reveal";
    autoGrade(room);
    applyScores(room);
    Room().writeRoom(room);
    return { ok: true };
  }

  function applyScores(room) {
    const cur = room.current;
    if (!cur || cur.scored) return;
    for (const p of room.players) {
      if (cur.correctMap[p.id]) {
        p.score += 1;
      }
    }
    cur.scored = true;
  }

  function markCorrect(room, playerId, isCorrect) {
    if (room.phase !== "reveal" || !room.current) {
      return { ok: false, error: "Reveal first" };
    }
    const cur = room.current;
    const was = !!cur.correctMap[playerId];
    const now = !!isCorrect;
    if (was === now) return { ok: true };
    const player = room.players.find((p) => p.id === playerId);
    if (!player) return { ok: false, error: "Unknown player" };
    // Adjust score if already scored
    if (cur.scored) {
      if (now && !was) player.score += 1;
      if (!now && was) player.score = Math.max(0, player.score - 1);
    }
    cur.correctMap[playerId] = now;
    Room().writeRoom(room);
    return { ok: true };
  }

  function backToPicker(room) {
    if (room.phase !== "reveal") return { ok: false, error: "Reveal first" };
    if (room.current) {
      room.history.push({
        round: room.round,
        type: room.current.type,
        answer: room.current.item.answer,
      });
    }
    room.current = null;
    room.phase = "picking";
    Room().writeRoom(room);
    return { ok: true };
  }

  function endNight(room) {
    if (room.current && room.phase === "reveal") {
      room.history.push({
        round: room.round,
        type: room.current.type,
        answer: room.current.item.answer,
      });
    }
    room.status = "ended";
    room.phase = "ended";
    room.endedAt = Date.now();
    room.current = null;
    Room().writeRoom(room);
  }

  function rankedPlayers(room) {
    return room.players.slice().sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
  }

  function shareText(room) {
    const ranks = rankedPlayers(room);
    const lines = [
      "NightDeck Staff Night — room " + room.code,
      room.round + " round" + (room.round === 1 ? "" : "s") + " · Trivia · Identify · Music",
      "",
      ...ranks.map(
        (p, i) => (i + 1) + ". " + p.name + " — " + p.score + " pt" + (p.score === 1 ? "" : "s")
      ),
      "",
      "Played on NightDeck",
    ];
    return lines.join("\n");
  }

  function lockedCount(room) {
    if (!room.current) return 0;
    return Object.keys(room.current.locked || {}).length;
  }

  global.NightDeckGame = {
    startNight,
    startRound,
    lockAnswer,
    revealRound,
    markCorrect,
    backToPicker,
    endNight,
    rankedPlayers,
    shareText,
    runBotAnswers,
    lockedCount,
    matchesAccept,
  };
})(window);
