import { assertEquals } from "@std/assert";
import { all, any, repeat } from "../../main.ts";
import { parseErrors } from "../../../src/errors.ts";

const takeTwo = repeat(any, 2).map((tokens) => tokens.join("")).error(
  "Expected two characters",
);
const oneOrTwo = all(any, takeTwo);

Deno.test("abc", () => {
  assertEquals(oneOrTwo.parse("abc"), {
    success: true,
    results: [{
      value: "a",
      remaining: "bc",
      position: { line: 1, column: 1 },
    }, {
      value: "ab",
      remaining: "c",
      position: { line: 1, column: 2 },
    }],
  });
});

Deno.test("ab", () => {
  assertEquals(oneOrTwo.parse("ab"), {
    success: true,
    results: [{
      value: "a",
      remaining: "b",
      position: { line: 1, column: 1 },
    }, {
      value: "ab",
      remaining: "",
      position: { line: 1, column: 2 },
    }],
  });
});

Deno.test("a", () => {
  assertEquals(oneOrTwo.parse("a"), {
    success: true,
    results: [{
      value: "a",
      remaining: "",
      position: { line: 1, column: 1 },
    }],
  });
});

Deno.test("empty string", () => {
  assertEquals(oneOrTwo.parse(""), {
    success: false,
    position: { line: 1, column: 0 },
    message: parseErrors.takeError,
  });
});
