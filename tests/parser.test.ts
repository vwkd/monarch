import { assertEquals } from "@std/assert";
import { digit, item, twoItems } from "../examples/basic.ts";
import { any, iterate, many, zero } from "../parser.ts";

Deno.test("zero is an absorbing element of flatMap", () => {
  assertEquals(zero.bind(() => item).parse("m"), zero.parse("m"));
  assertEquals(item.bind(() => zero).parse("m"), zero.parse("m"));
});

Deno.test("iterate", () => {
  assertEquals(iterate(digit).parse("23 and more"), [
    { value: [2, 3], remaining: " and more" },
    { value: [2], remaining: "3 and more" },
    { value: [], remaining: "23 and more" },
  ]);
});

Deno.test("many", () => {
  assertEquals(many(digit).parse("23 and more"), [
    { value: [2, 3], remaining: " and more" },
  ]);

  // Matches 0 or more times
  assertEquals(many(digit).parse("a"), [
    { value: [], remaining: "a" },
  ]);
});

// Explore a search space
const oneOrTwoItems = any(item, twoItems);
const explore = many(oneOrTwoItems);

Deno.test("explore", () => {
  assertEquals(explore.parse("many"), [
    { remaining: "", value: ["m", "a", "n", "y"] },
    { remaining: "", value: ["m", "a", "ny"] },
    { remaining: "", value: ["m", "an", "y"] },
    { remaining: "", value: ["ma", "n", "y"] },
    { remaining: "", value: ["ma", "ny"] },
  ]);
});
