import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("portable contract keeps four debate phases", () => {
  const source = fs.readFileSync(new URL("../src/index.ts", import.meta.url), "utf8");
  for (const phase of ["constructive", "rebuttal", "summary", "final-focus"]) assert.match(source, new RegExp(`\\"${phase}\\"`));
  assert.doesNotMatch(source, /window\.|wx\.|react-native/);
});
