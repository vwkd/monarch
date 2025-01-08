import { assertEquals } from "@std/assert";
import {
  any,
  filter,
  flatMap,
  isChar,
  isDigit,
  isLetter,
  item,
  iterate,
  letter,
  many,
  twoItems,
  twoItemsf,
  unit,
  zero,
} from "./parser.ts";

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

const letter2 = filter(item, isLetter);

Deno.test("filter", () => {
  assertEquals(letter("m"), [{ value: "m", remaining: "" }]);
  assertEquals(letter2("m"), [{ value: "m", remaining: "" }]);
});

const digit2 = flatMap(filter(item, isDigit), (value) => unit(Number(value)));

Deno.test("digit", () => {
  assertEquals(digit2("a"), []);
  assertEquals(digit2("2"), [{ value: 2, remaining: "" }]);
  assertEquals(digit2("23"), [{ value: 2, remaining: "3" }]);
});

const char = filter(item, isChar("m"));
Deno.test("char", () => {
  assertEquals(char("a"), []);
  assertEquals(char("monad"), [{ value: "m", remaining: "onad" }]);
});

Deno.test("iterate", () => {
  assertEquals(iterate(digit2)("23 and more"), [
    { value: [2, 3], remaining: " and more" },
    { value: [2], remaining: "3 and more" },
    { value: [], remaining: "23 and more" },
  ]);
});

Deno.test("many", () => {
  assertEquals(many(digit2)("23 and more"), [
    { value: [2, 3], remaining: " and more" },
  ]);

  // Matches 0 or more
  assertEquals(many(digit2)("a"), [
    { value: [], remaining: "a" },
  ]);
});

const number = flatMap(
  digit2,
  (a) => flatMap(many(digit2), (rest) => unit(Number([a, ...rest].join("")))),
);

Deno.test("number", () => {
  assertEquals(number("23 and more"), [
    { value: 23, remaining: " and more" },
  ]);

  assertEquals(number("and more"), []);
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
