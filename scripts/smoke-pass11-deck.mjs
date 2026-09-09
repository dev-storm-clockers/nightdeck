#!/usr/bin/env node
/**
 * Pass 11 smoke: same day deck → two startRuns share the same index set
 * (sorted equal) and often differ in order. pickDeck length = min(8, pack).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import vm from "vm";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const gameSrc = fs.readFileSync(path.join(root, "js/game.js"), "utf8");
const sandbox = { window: {}, console, Math, Date, Array, Object, String, Number, Error, JSON };
vm.createContext(sandbox);
vm.runInContext(gameSrc, sandbox);
const Game = sandbox.window.NightDeckGame;

function loadPack(rel) {
  const data = JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));
  return { id: "trivia", subject: "general", items: data.items || [] };
}

const pack = loadPack("data/trivia/general.json");
const deck = Game.pickDeck(pack, 8);

if (!Array.isArray(deck) || deck.length !== 8) {
  console.error("FAIL pickDeck length", deck && deck.length);
  process.exit(1);
}
if (new Set(deck).size !== deck.length) {
  console.error("FAIL pickDeck has duplicates", deck);
  process.exit(1);
}

const runA = Game.startRun({
  gameType: "trivia",
  pack,
  dayCode: "TEST1",
  playerId: "p_a",
  playerName: "A",
  deck,
});
const runB = Game.startRun({
  gameType: "trivia",
  pack,
  dayCode: "TEST1",
  playerId: "p_b",
  playerName: "B",
  deck,
});

const setA = runA.queue.map((q) => q.index).slice().sort((a, b) => a - b);
const setB = runB.queue.map((q) => q.index).slice().sort((a, b) => a - b);
const orderA = runA.queue.map((q) => q.index);
const orderB = runB.queue.map((q) => q.index);

if (JSON.stringify(setA) !== JSON.stringify(setB)) {
  console.error("FAIL sets differ", setA, setB);
  process.exit(1);
}
if (JSON.stringify(setA) !== JSON.stringify(deck.slice().sort((a, b) => a - b))) {
  console.error("FAIL set != deck", setA, deck);
  process.exit(1);
}

// Fallback without deck still works
const runF = Game.startRun({
  gameType: "trivia",
  pack,
  dayCode: "TEST2",
  playerId: "p_f",
  playerName: "F",
});
if (runF.queue.length !== 8) {
  console.error("FAIL fallback length", runF.queue.length);
  process.exit(1);
}

// Options still shuffled (snapshot has correctIndex)
const snap = runA.queue[0].item;
if (typeof snap.correctIndex !== "number" || snap.correctIndex < 0) {
  console.error("FAIL snapshot correctIndex", snap);
  process.exit(1);
}

let orderDiffered = false;
for (let i = 0; i < 40; i++) {
  const r1 = Game.startRun({ gameType: "trivia", pack, dayCode: "X", playerId: "1", playerName: "1", deck });
  const r2 = Game.startRun({ gameType: "trivia", pack, dayCode: "X", playerId: "2", playerName: "2", deck });
  if (JSON.stringify(r1.queue.map((q) => q.index)) !== JSON.stringify(r2.queue.map((q) => q.index))) {
    orderDiffered = true;
    break;
  }
}

console.log(
  JSON.stringify(
    {
      ok: true,
      deck,
      setA,
      orderA,
      orderB,
      sameSet: true,
      orderDifferedOften: orderDiffered,
      fallbackLen: runF.queue.length,
    },
    null,
    2
  )
);
if (!orderDiffered) {
  console.warn("WARN: orders matched across 40 trials (unlikely but not a hard fail)");
}
