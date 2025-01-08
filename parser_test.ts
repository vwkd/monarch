import { assertEquals } from "@std/assert";
import { any, filter, flatMap, isChar, iterate, many, zero } from "./parser.ts";
import {
  digit,
  item,
  letter,
  integer,
  twoItems,
  twoItemsf,
} from "./examples/basic.ts";

Deno.test("item", () => {
  assertEquals(item(""), []);
  assertEquals(item("monad"), [{
    value: "m",
    remaining: "onad",
  }]);
});

Deno.test("two items", () => {
  assertEquals(twoItems("m"), []);
  assertEquals(twoItemsf("monad"), [{
    value: "mo",
    remaining: "nad",
  }]);
});

const oneOrTwoItems = any(item, twoItemsf);

Deno.test("alternation", () => {
  assertEquals(oneOrTwoItems(""), []);
  assertEquals(oneOrTwoItems("m"), [{
    value: "m",
    remaining: "",
  }]);
  assertEquals(oneOrTwoItems("monad"), [{
    value: "m",
    remaining: "onad",
  }, {
    value: "mo",
    remaining: "nad",
  }]);
});

Deno.test("zero is an absorbing element of flatMap", () => {
  assertEquals(flatMap(zero, () => item)("m"), zero("m"));
  assertEquals(flatMap(item, () => zero)("m"), zero("m"));
});

Deno.test("filter", () => {
  assertEquals(letter("m"), [{ value: "m", remaining: "" }]);
  assertEquals(letter("m"), [{ value: "m", remaining: "" }]);
});

Deno.test("digit", () => {
  assertEquals(digit("a"), []);
  assertEquals(digit("2"), [{ value: 2, remaining: "" }]);
  assertEquals(digit("23"), [{ value: 2, remaining: "3" }]);
});

const char = filter(item, isChar("m"));
Deno.test("char", () => {
  assertEquals(char("a"), []);
  assertEquals(char("monad"), [{ value: "m", remaining: "onad" }]);
});

Deno.test("iterate", () => {
  assertEquals(iterate(digit)("23 and more"), [
    { value: [2, 3], remaining: " and more" },
    { value: [2], remaining: "3 and more" },
    { value: [], remaining: "23 and more" },
  ]);
});

Deno.test("many", () => {
  assertEquals(many(digit)("23 and more"), [
    { value: [2, 3], remaining: " and more" },
  ]);

  // Matches 0 or more times
  assertEquals(many(digit)("a"), [
    { value: [], remaining: "a" },
  ]);
});

Deno.test("number", () => {
  assertEquals(integer("23 and more"), [
    { value: 23, remaining: " and more" },
  ]);

  assertEquals(integer("and more"), []);
});

// Explore a search space
const explore = many(oneOrTwoItems);
Deno.test("explore", () => {
  assertEquals(explore("many"), [
    { remaining: "", value: ["m", "a", "n", "y"] },
    { remaining: "", value: ["m", "a", "ny"] },
    { remaining: "", value: ["m", "an", "y"] },
    { remaining: "", value: ["ma", "n", "y"] },
    { remaining: "", value: ["ma", "ny"] },
  ]);
});
