/** NightDeck play loop: draw, submit blind, rotating judge, scores. */
(function (global) {
  const Room = () => global.NightDeckRoom;

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function pickUnused(pool, used) {
    const available = pool
      .map((text, index) => ({ text, index }))
      .filter((x) => !used.includes(x.index));
    if (!available.length) return null;
    return available[Math.floor(Math.random() * available.length)];
  }

  function ensureHands(room, deck) {
    const handSize = Room().HAND_SIZE;
    room.hands = room.hands || {};
    room.usedAnswers = room.usedAnswers || [];
    for (const p of room.players) {
      let hand = room.hands[p.id] || [];
      while (hand.length < handSize) {
        let pick = pickUnused(deck.answers, room.usedAnswers);
        if (!pick) {
          // Long staff nights / 12 seats: recycle answers once the pool is empty.
          room.usedAnswers = [];
          pick = pickUnused(deck.answers, room.usedAnswers);
          if (!pick) break;
        }
        room.usedAnswers.push(pick.index);
        hand.push(pick.text);
      }
      room.hands[p.id] = hand;
    }
  }

  function startGame(room, deck) {
    room.deckSnapshot = {
      id: deck.id,
      name: deck.name,
      prompts: deck.prompts,
      answers: deck.answers,
    };
    room.status = "playing";
    room.round = 0;
    room.judgeIndex = 0;
    room.usedPrompts = [];
    room.usedAnswers = [];
    room.hands = {};
    room.judgeWindowMs = room.judgeWindowMs || Room().JUDGE_WINDOW_MS;
    ensureHands(room, deck);
    beginRound(room);
    runBotTurns(room);
    Room().writeRoom(room);
    return room;
  }

  function currentJudge(room) {
    if (!room.players.length) return null;
    return room.players[room.judgeIndex % room.players.length];
  }

  function beginRound(room) {
    const deck = room.deckSnapshot;
    room.round += 1;
    room.submissions = {};
    room.blindOrder = [];
    room.revealed = false;
    room.winnerId = null;
    room.winnerAnswer = null;
    room.phase = "submit";
    room.judgeOpenedAt = null;
    room.submitOpenedAt = Date.now();
    const pick = pickUnused(deck.prompts, room.usedPrompts);
    if (!pick) {
      endGame(room);
      return;
    }
    room.usedPrompts.push(pick.index);
    room.prompt = pick.text;
    room.promptIndex = pick.index;
    ensureHands(room, deck);
  }

  function submitAnswer(room, playerId, answerText) {
    if (room.phase !== "submit") return { ok: false, error: "Not in submit phase" };
    const judge = currentJudge(room);
    if (judge && judge.id === playerId) {
      return { ok: false, error: "Judge sits this round out" };
    }
    const hand = room.hands[playerId] || [];
    const idx = hand.indexOf(answerText);
    if (idx === -1) return { ok: false, error: "Card not in hand" };
    if (room.submissions[playerId]) return { ok: false, error: "Already submitted" };
    room.submissions[playerId] = answerText;
    hand.splice(idx, 1);
    room.hands[playerId] = hand;

    const needed = room.players.filter((p) => p.id !== judge.id);
    const allIn = needed.every((p) => room.submissions[p.id]);
    if (allIn) {
      room.phase = "judge";
      room.revealed = true;
      room.judgeOpenedAt = Date.now();
      // Stable blind order for judge UI (avoid reshuffle on every render)
      const entries = Object.entries(room.submissions).map(([playerId, text]) => ({ playerId, text }));
      room.blindOrder = shuffle(entries);
    }
    Room().writeRoom(room);
    return { ok: true, allIn };
  }

  /** Bots auto-submit random hand cards; bot judge auto-picks after short delay (solo demo). */
  function runBotTurns(room) {
    if (!room || room.status !== "playing") return { acted: false };
    let acted = false;
    const judge = currentJudge(room);

    if (room.phase === "submit") {
      for (const p of room.players) {
        if (!p.bot) continue;
        if (judge && p.id === judge.id) continue;
        if (room.submissions[p.id]) continue;
        const hand = room.hands[p.id] || [];
        if (!hand.length) continue;
        const pick = hand[Math.floor(Math.random() * hand.length)];
        const res = submitAnswer(room, p.id, pick);
        if (res.ok) acted = true;
      }
    }

    if (room.phase === "judge" && judge && judge.bot) {
      const entries = Object.keys(room.submissions || {});
      if (entries.length) {
        // Soft delay: only auto-pick if judge window has been open briefly (solo demo speed)
        const opened = room.judgeOpenedAt || Date.now();
        if (Date.now() - opened >= 600) {
          const winnerId = entries[Math.floor(Math.random() * entries.length)];
          const res = pickWinner(room, judge.id, winnerId);
          if (res.ok) acted = true;
        }
      }
    }

    return { acted };
  }

  function pickWinner(room, judgeId, winnerPlayerId) {
    if (room.phase !== "judge") return { ok: false, error: "Not in judge phase" };
    const judge = currentJudge(room);
    if (!judge || judge.id !== judgeId) return { ok: false, error: "Only the judge can pick" };
    if (!room.submissions[winnerPlayerId]) {
      return { ok: false, error: "That player did not submit" };
    }
    const winner = room.players.find((p) => p.id === winnerPlayerId);
    if (!winner) return { ok: false, error: "Unknown winner" };
    winner.score += 1;
    room.winnerId = winnerPlayerId;
    room.winnerAnswer = room.submissions[winnerPlayerId];
    room.phase = "reveal";
    Room().writeRoom(room);
    return { ok: true };
  }

  function nextRound(room) {
    if (room.phase !== "reveal") return { ok: false, error: "Reveal first" };
    if (room.round >= room.roundCap) {
      endGame(room);
      return { ok: true, ended: true };
    }
    room.judgeIndex = (room.judgeIndex + 1) % room.players.length;
    beginRound(room);
    if (room.status === "ended") return { ok: true, ended: true };
    runBotTurns(room);
    Room().writeRoom(room);
    return { ok: true, ended: false };
  }

  function endGame(room) {
    room.status = "ended";
    room.phase = "ended";
    room.endedAt = Date.now();
    Room().writeRoom(room);
  }

  function getBlindSubmissions(room) {
    if (Array.isArray(room.blindOrder) && room.blindOrder.length) {
      return room.blindOrder.slice();
    }
    const entries = Object.entries(room.submissions || {}).map(([playerId, text]) => ({
      playerId,
      text,
    }));
    return shuffle(entries);
  }

  function rankedPlayers(room) {
    return room.players.slice().sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
  }

  function judgeRemainingMs(room) {
    if (room.phase !== "judge" || !room.judgeOpenedAt) return null;
    const windowMs = room.judgeWindowMs || Room().JUDGE_WINDOW_MS;
    return Math.max(0, windowMs - (Date.now() - room.judgeOpenedAt));
  }

  function formatDuration(ms) {
    if (ms == null) return "";
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    if (h > 0) return h + "h " + m + "m";
    if (m > 0) return m + " min";
    return totalSec + "s";
  }

  function shareText(room) {
    const ranks = rankedPlayers(room);
    const lines = [
      "NightDeck results — room " + room.code,
      "Deck: " + (room.deckSnapshot?.name || room.deckId),
      "Rounds: " + room.round,
      "",
      ...ranks.map((p, i) => (i + 1) + ". " + p.name + " — " + p.score + " pt" + (p.score === 1 ? "" : "s")),
      "",
      "Played on NightDeck",
    ];
    return lines.join("\n");
  }

  global.NightDeckGame = {
    startGame,
    currentJudge,
    submitAnswer,
    pickWinner,
    nextRound,
    endGame,
    getBlindSubmissions,
    rankedPlayers,
    shareText,
    ensureHands,
    runBotTurns,
    judgeRemainingMs,
    formatDuration,
  };
})(window);
