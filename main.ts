import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

// Famous Last Words at 1 Percent — a dying phone's final text, first person.
// The joke is specific (autocorrect rewrote every "I love you" to his mother
// as "I llama you") and the punch lands on the last three words: the phone
// confesses, feels zero remorse, and only then asks to be plugged in.
const LINE =
  "Before I go, I want you to know that autocorrect changed 'I love you' to 'I llama you' in every text to your mother — I regret nothing, plug me in.";

// Runtime guards: the sealed gate is 1–199 UTF-8 characters, one single line.
if (LINE.length < 1 || LINE.length > 199) {
  throw new Error(`entry length ${LINE.length} is outside the 1-199 gate`);
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("entry must be a single line");
}
// Brief guard: RULES.txt bans stock genre moves (the charger goodbye, the
// will-reading, the delete-my-history bit, the bare 1-percent pun). Fail the
// run if any of those ever creep back into the line.
const STOCK_MOVES = [
  "charging cable",
  "charger, i",
  "delete my",
  "search history",
  "my will",
  "1 percent",
  "one percent",
];
const lower = LINE.toLowerCase();
for (const move of STOCK_MOVES) {
  if (lower.includes(move)) {
    throw new Error(`entry uses a banned stock move: "${move}"`);
  }
}
// Voice guard: it must stay a first-person dying phone whose last words are
// the plug-in punch — no punch, no entry.
if (!LINE.startsWith("Before I go")) {
  throw new Error("entry must open in the dying phone's first-person voice");
}
if (!LINE.endsWith("plug me in.")) {
  throw new Error("entry must end on the plug-in punch");
}

const outDir = process.env.OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), LINE, "utf8");
console.log(`entry ok: ${LINE.length} chars, 1 line`);
