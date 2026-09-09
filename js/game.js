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
        const pick = pickUnused(deck.answers, room.usedAnswers);
        if (!pick) break;
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
    ensureHands(room, deck);
    beginRound(room);
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
      // Stable blind order for judge UI (avoid reshuffle on every render)
      const entries = Object.entries(room.submissions).map(([playerId, text]) => ({ playerId, text }));
      room.blindOrder = shuffle(entries);
    }
    Room().writeRoom(room);
    return { ok: true, allIn };
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
  };
})(window);
