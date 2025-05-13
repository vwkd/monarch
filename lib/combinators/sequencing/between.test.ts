import { assertEquals } from "@std/assert";
import { between, digit, letter } from "../../main.ts";
import { parseErrors } from "../../../src/errors.ts";

Deno.test("a1b2c3", () => {
  assertEquals(between(letter, digit, letter).parse("a1b2c3"), {
    success: true,
    results: [{
      value: 1,
      remaining: "2c3",
      position: { line: 1, column: 3 },
    }],
  });
});

Deno.test("a12345", () => {
  assertEquals(between(letter, digit, letter).parse("a12345"), {
    success: false,
    message: parseErrors.letter,
    position: { line: 1, column: 2 },
  });
});

Deno.test("a1", () => {
  assertEquals(between(letter, digit, letter).parse("a1"), {
    success: false,
    message: parseErrors.letter,
    position: { line: 1, column: 2 },
  });
});

Deno.test("abcdef", () => {
  assertEquals(between(letter, digit, letter).parse("abcdef"), {
    success: false,
    message: parseErrors.digit,
    position: { line: 1, column: 1 },
  });
});

Deno.test("a", () => {
  assertEquals(between(letter, digit, letter).parse("a"), {
    success: false,
    message: parseErrors.digit,
    position: { line: 1, column: 1 },
  });
});

Deno.test("123456", () => {
  assertEquals(between(letter, digit, letter).parse("123456"), {
    success: false,
    message: parseErrors.letter,
    position: { line: 1, column: 0 },
  });
});

Deno.test("empty string", () => {
  assertEquals(between(letter, digit, letter).parse(""), {
    success: false,
    message: parseErrors.letter,
    position: { line: 1, column: 0 },
  });
});
