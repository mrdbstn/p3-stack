import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { linesOf } from "../frontends/dot.ts";
import { fileLines } from "../run.ts";

test("Windows TLC line endings match LF input in both string and file readers", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "p3-statechart-lines-"));
  try {
    for (const ending of ["\n", "\r\n"]) {
      const text = ["first", "second", ""].join(ending);
      const file = path.join(dir, "tlc.out");
      fs.writeFileSync(file, text);
      assert.deepEqual([...linesOf(text)], ["first", "second", ""]);
      assert.deepEqual([...fileLines(file)], ["first", "second", ""]);
    }
  } finally {
    assert.equal(path.dirname(path.resolve(dir)), path.resolve(os.tmpdir()));
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
