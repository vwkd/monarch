import { assertEquals } from "@std/assert";
import { result } from "../main.ts";

Deno.test("abc", () => {
  assertEquals(result(123).parse("abc"), {
    success: true,
    results: [{
      value: 123,
      remaining: "abc",
      position: { line: 1, column: 0 },
    }],
  });
});
