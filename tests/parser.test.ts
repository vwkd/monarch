import { assertEquals } from "@std/assert";
import { digit, take, letter, takeTwo } from "../examples/basic.ts";
import { any, iterate, many, zero } from "../parser.ts";

Deno.test("zero is an absorbing element of flatMap", () => {
  assertEquals(zero.bind(() => take).parse("m"), zero.parse("m"));
  assertEquals(take.bind(() => zero).parse("m"), zero.parse("m"));
});

Deno.test("iterate", () => {
  assertEquals(iterate(digit).parse("23 and more"), [
    { value: [2, 3], remaining: " and more" },
    { value: [2], remaining: "3 and more" },
    { value: [], remaining: "23 and more" },
  ]);

  assertEquals(iterate(letter).parse("Yes!"), [
    { value: ["Y", "e", "s"], remaining: "!" },
    { value: ["Y", "e"], remaining: "s!" },
    { value: ["Y"], remaining: "es!" },
    { value: [], remaining: "Yes!" },
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
const oneOrTwoItems = any(take, takeTwo);
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
