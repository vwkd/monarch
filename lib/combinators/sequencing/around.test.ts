import { assertEquals } from "@std/assert";
import { around, digit, letter } from "../../main.ts";
import { parseErrors } from "../../../src/errors.ts";

Deno.test("1a2b3c", () => {
  assertEquals(around(digit, letter, digit).parse("1a2b3c"), {
    success: true,
    results: [{
      value: [1, 2],
      remaining: "b3c",
      position: { line: 1, column: 3 },
    }],
  });
});

Deno.test("1abcde", () => {
  assertEquals(around(digit, letter, digit).parse("1abcde"), {
    success: false,
    message: parseErrors.digit,
    position: { line: 1, column: 2 },
  });
});

Deno.test("1a", () => {
  assertEquals(around(digit, letter, digit).parse("1a"), {
    success: false,
    message: parseErrors.digit,
    position: { line: 1, column: 2 },
  });
});

Deno.test("123456", () => {
  assertEquals(around(digit, letter, digit).parse("123456"), {
    success: false,
    message: parseErrors.letter,
    position: { line: 1, column: 1 },
  });
});

Deno.test("1", () => {
  assertEquals(around(digit, letter, digit).parse("1"), {
    success: false,
    message: parseErrors.letter,
    position: { line: 1, column: 1 },
  });
});

Deno.test("abcdef", () => {
  assertEquals(around(digit, letter, digit).parse("abcdef"), {
    success: false,
    message: parseErrors.digit,
    position: { line: 1, column: 0 },
  });
});

Deno.test("empty string", () => {
  assertEquals(around(digit, letter, digit).parse(""), {
    success: false,
    message: parseErrors.digit,
    position: { line: 1, column: 0 },
  });
});
