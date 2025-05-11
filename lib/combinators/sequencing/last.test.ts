import { assertEquals } from "@std/assert";
import { digit, last, letter, whitespace } from "../../main.ts";
import { parseErrors } from "../../../src/errors.ts";

Deno.test("1a 2b ", () => {
  assertEquals(last(digit, letter, whitespace).parse("1a 2b "), {
    success: true,
    results: [{
      value: " ",
      remaining: "2b ",
      position: { line: 1, column: 3 },
    }],
  });
});

Deno.test("1abcde", () => {
  assertEquals(last(digit, letter, whitespace).parse("1abcde"), {
    success: false,
    message: "Expected a white space character",
    position: { line: 1, column: 2 },
  });
});

Deno.test("1a", () => {
  assertEquals(last(digit, letter, whitespace).parse("1a"), {
    success: false,
    message: "Expected a white space character",
    position: { line: 1, column: 2 },
  });
});

Deno.test("12abcd", () => {
  assertEquals(last(digit, letter, whitespace).parse("12abcd"), {
    success: false,
    message: parseErrors.letter,
    position: { line: 1, column: 1 },
  });
});

Deno.test("1", () => {
  assertEquals(last(digit, letter, whitespace).parse("1"), {
    success: false,
    message: parseErrors.letter,
    position: { line: 1, column: 1 },
  });
});

Deno.test("abcdef", () => {
  assertEquals(last(digit, letter, whitespace).parse("abcdef"), {
    success: false,
    message: parseErrors.digit,
    position: { line: 1, column: 0 },
  });
});

Deno.test("empty string", () => {
  assertEquals(last(digit, letter, whitespace).parse(""), {
    success: false,
    message: parseErrors.digit,
    position: { line: 1, column: 0 },
  });
});
