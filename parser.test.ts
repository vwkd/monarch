import { assertEquals } from "@std/assert";
import {
  any,
  createParser,
  filter,
  isChar,
  iterate,
  many,
  zero,
} from "./parser.ts";
import {
  digit,
  integer,
  item,
  letter,
  twoItems,
  twoItemsf,
} from "./examples/basic.ts";

Deno.test("item", () => {
  assertEquals(item.parse(""), []);
  assertEquals(item.parse("monad"), [{
    value: "m",
    remaining: "onad",
  }]);
});

Deno.test("two items", () => {
  assertEquals(twoItems.parse("m"), []);
  assertEquals(twoItemsf.parse("monad"), [{
    value: "mo",
    remaining: "nad",
  }]);
});

const oneOrTwoItems = any(item, twoItemsf);

Deno.test("alternation", () => {
  assertEquals(oneOrTwoItems.parse(""), []);
  assertEquals(oneOrTwoItems.parse("m"), [{
    value: "m",
    remaining: "",
  }]);
  assertEquals(oneOrTwoItems.parse("monad"), [{
    value: "m",
    remaining: "onad",
  }, {
    value: "mo",
    remaining: "nad",
  }]);
});

Deno.test("zero is an absorbing element of flatMap", () => {
  assertEquals(zero.bind(() => item)("m"), zero("m"));
  assertEquals(item.bind(() => createParser(zero)).parse("m"), zero("m"));
});

Deno.test("filter", () => {
  assertEquals(letter.parse("m"), [{ value: "m", remaining: "" }]);
  assertEquals(letter.parse("m"), [{ value: "m", remaining: "" }]);
});

Deno.test("digit", () => {
  assertEquals(digit.parse("a"), []);
  assertEquals(digit.parse("2"), [{ value: 2, remaining: "" }]);
  assertEquals(digit.parse("23"), [{ value: 2, remaining: "3" }]);
});

const char = filter(item, isChar("m"));
Deno.test("char", () => {
  assertEquals(char.parse("a"), []);
  assertEquals(char.parse("monad"), [{ value: "m", remaining: "onad" }]);
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

Deno.test("number", () => {
  assertEquals(integer.parse("23 and more"), [
    { value: 23, remaining: " and more" },
  ]);

  assertEquals(integer.parse("and more"), []);
});

// Explore a search space
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
