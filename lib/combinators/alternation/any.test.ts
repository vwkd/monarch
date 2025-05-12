import { assertEquals } from "@std/assert";
import { any, repeat, take } from "../../main.ts";
import { parseErrors } from "../../../src/errors.ts";

const takeTwo = repeat(take, 2).map((tokens) => tokens.join("")).error(
  "Expected two characters",
);
const oneOrTwoItems = any(take, takeTwo);

Deno.test("alternation", () => {
  assertEquals(oneOrTwoItems.parse(""), {
    success: false,
    position: { line: 1, column: 0 },
    message: parseErrors.takeError,
  });

  assertEquals(oneOrTwoItems.parse("m"), {
    success: true,
    results: [{ value: "m", remaining: "", position: { line: 1, column: 1 } }],
  });

  assertEquals(oneOrTwoItems.parse("monad"), {
    success: true,
    results: [{
      value: "m",
      remaining: "onad",
      position: { line: 1, column: 1 },
    }, {
      value: "mo",
      remaining: "nad",
      position: { line: 1, column: 2 },
    }],
  });
});
