import { assertEquals, assertThrows } from "@std/assert";
import { repeat } from "$combinators";
import { digit } from "$common";
import { parseErrors } from "../../errors.ts";

Deno.test("negative arguments", () => {
  assertThrows(
    () => repeat(digit, -3, -2).parse("abcdef"),
    "repeat: min cannot be negative",
  );
});

Deno.test("argument order", () => {
  assertThrows(
    () => repeat(digit, 3, 2).parse("abcdef"),
    "repeat: max cannot be less than min",
  );
});

Deno.test("zero arguments", () => {
  assertEquals(repeat(digit, 0, 0).parse("abcdef"), {
    success: true,
    results: [{
      value: [],
      remaining: "abcdef",
      position: { line: 1, column: 0 },
    }],
  });
});

Deno.test("1234ab", () => {
  assertEquals(repeat(digit, 2, 3).parse("1234ab"), {
    success: true,
    results: [{
      value: [1, 2, 3],
      remaining: "4ab",
      position: { line: 1, column: 3 },
    }],
  });
});

Deno.test("123abc", () => {
  assertEquals(repeat(digit, 2, 3).parse("123abc"), {
    success: true,
    results: [{
      value: [1, 2, 3],
      remaining: "abc",
      position: { line: 1, column: 3 },
    }],
  });
});

Deno.test("12abcd", () => {
  assertEquals(repeat(digit, 2, 3).parse("12abcd"), {
    success: true,
    results: [{
      value: [1, 2],
      remaining: "abcd",
      position: { line: 1, column: 2 },
    }],
  });
});

Deno.test("1abcde", () => {
  assertEquals(repeat(digit, 2, 3).parse("1abcde"), {
    success: false,
    message: parseErrors.digit,
    position: { line: 1, column: 1 },
  });
});

Deno.test("abcdef", () => {
  assertEquals(repeat(digit, 2, 3).parse("abcdef"), {
    success: false,
    message: parseErrors.digit,
    position: { line: 1, column: 0 },
  });
});

Deno.test("empty string", () => {
  assertEquals(repeat(digit, 2, 3).parse(""), {
    success: false,
    message: parseErrors.digit,
    position: { line: 1, column: 0 },
  });
});
