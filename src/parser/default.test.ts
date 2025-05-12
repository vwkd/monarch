import { assertEquals } from "@std/assert";
import { digit } from "../../lib/main.ts";

Deno.test("123", () => {
  assertEquals(digit.default(42).parse("123"), {
    success: true,
    results: [
      {
        value: 1,
        remaining: "23",
        position: { line: 1, column: 1 },
      },
    ],
  });
});

Deno.test("abc", () => {
  assertEquals(digit.default(42).parse("abc"), {
    success: true,
    results: [
      {
        value: 42,
        remaining: "abc",
        position: { line: 1, column: 0 },
      },
    ],
  });
});

Deno.test("empty string", () => {
  assertEquals(digit.default(42).parse(""), {
    success: true,
    results: [
      {
        value: 42,
        remaining: "",
        position: { line: 1, column: 0 },
      },
    ],
  });
});
