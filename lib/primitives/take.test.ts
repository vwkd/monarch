import { assertEquals } from "@std/assert";
import { take } from "../main.ts";
import { parseErrors } from "../../src/errors.ts";

Deno.test("abc", () => {
  assertEquals(take.parse("abc"), {
    success: true,
    results: [{
      value: "a",
      remaining: "bc",
      position: { line: 1, column: 1 },
    }],
  });
});

Deno.test("empty string", () => {
  assertEquals(take.parse(""), {
    success: false,
    message: parseErrors.takeError,
    position: { line: 1, column: 0 },
  });
});
