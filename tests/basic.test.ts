import { assertEquals } from "@std/assert";
import {
  digit,
  integer,
  item,
  letter,
  literal,
  twoItems,
  twoItemsf,
} from "../examples/basic.ts";
import { any } from "../parser.ts";

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

Deno.test("letter", () => {
  assertEquals(letter.parse("m"), [{ value: "m", remaining: "" }]);
  assertEquals(letter.parse("m"), [{ value: "m", remaining: "" }]);
});

Deno.test("digit", () => {
  assertEquals(digit.parse("a"), []);
  assertEquals(digit.parse("2"), [{ value: 2, remaining: "" }]);
  assertEquals(digit.parse("23"), [{ value: 2, remaining: "3" }]);
});

Deno.test("literal", () => {
  assertEquals(literal("m").parse("a"), []);
  assertEquals(literal("m").parse("monad"), [{
    value: "m",
    remaining: "onad",
  }]);
});

Deno.test("number", () => {
  assertEquals(integer.parse("23 and more"), [
    { value: 23, remaining: " and more" },
  ]);

  assertEquals(integer.parse("and more"), []);
});
