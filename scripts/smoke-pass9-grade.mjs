#!/usr/bin/env node
/**
 * Pass 9 smoke: for every trivia/identify/music item with options,
 * reveal-isCorrect count === 1 under the fixed grading rules.
 * Also re-checks snapshot shuffle keeps exactly one correctIndex.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import vm from "vm";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function normalize(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isOptionCorrect(item, opt, idx) {
  if (typeof item.correctIndex === "number" && item.correctIndex >= 0) {
    return idx === item.correctIndex;
  }
  if (typeof item.correct === "number" && item.correct >= 0 && Array.isArray(item.options)) {
    return idx === item.correct;
  }
  return normalize(opt) === normalize(item.answer);
}

/** Legacy broken reveal (for regression note) */
function legacyRevealHits(item) {
  const answer = normalize(item.answer);
  const accept = (item.accept || []).map(normalize).filter(Boolean);
  const hits = [];
  for (const opt of item.options || []) {
    const g = normalize(opt);
    let match = false;
    if (answer && (g === answer || answer.includes(g) || g.includes(answer))) match = true;
    for (const n of accept) {
      if (g === n || g.includes(n) || n.includes(g)) match = true;
    }
    if (match) hits.push(opt);
  }
  return hits;
}

function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

// Load game.js into a sandbox to exercise snapshotItem
const gameSrc = fs.readFileSync(path.join(root, "js/game.js"), "utf8");
const sandbox = { window: {}, console };
vm.createContext(sandbox);
vm.runInContext(gameSrc, sandbox);
const Game = sandbox.window.NightDeckGame;

const subjects = [
  "general", "pop", "movies", "science", "geo", "food", "decades", "mixed",
];

const report = { packs: {}, failures: [], legacyWouldFail: 0, totalItems: 0 };

function checkPack(name, type, items) {
  let ok = 0;
  let bad = 0;
  for (let i = 0; i < items.length; i++) {
    const raw = items[i];
    report.totalItems++;
    // Build snapshot-shaped item (shuffle + correctIndex)
    const snap = Game.snapshotItem(type, raw);
    const hits = [];
    snap.options.forEach((opt, idx) => {
      if (Game.isOptionCorrect(snap, opt, idx)) hits.push({ idx, opt });
    });
    // Also verify exact-normalize path alone would be unique
    const exactHits = snap.options.filter((o) => normalize(o) === normalize(snap.answer));
    if (hits.length !== 1 || exactHits.length !== 1) {
      bad++;
      report.failures.push({
        pack: name,
        index: i,
        hits: hits.length,
        exactHits: exactHits.length,
        answer: snap.answer,
        options: snap.options,
      });
    } else {
      ok++;
    }
    // Count how many would have failed under old music/identify reveal
    if (type !== "trivia") {
      const legacy = legacyRevealHits({ ...raw, options: snap.options });
      if (legacy.length !== 1) report.legacyWouldFail++;
    }
  }
  report.packs[name] = { type, items: items.length, ok, bad };
}

for (const s of subjects) {
  const data = loadJson(path.join(root, "data/trivia", s + ".json"));
  // trivia raw uses correct index — snapshotItem expects that
  checkPack("trivia/" + s, "trivia", data.items);
}

checkPack("identify", "identify", loadJson(path.join(root, "data/identify.json")).items);
checkPack("music", "music", loadJson(path.join(root, "data/music.json")).items);

console.log(JSON.stringify(report, null, 2));
const failed = report.failures.length;
if (failed) {
  console.error("SMOKE FAIL", failed);
  process.exit(1);
}
console.log(
  "SMOKE PASS — items:",
  report.totalItems,
  "all reveal-isCorrect===1; legacyWouldFail (pre-fix music/identify):",
  report.legacyWouldFail
);
