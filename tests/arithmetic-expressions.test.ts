import { assertEquals } from "@std/assert/equals";
import { arithmetic } from "../examples/arithmetic-expressions.ts";

Deno.test("expression", () => {
  assertEquals(arithmetic.parse("1+2*3"), [{
    value: 7,
    remaining: "",
  }]);

  assertEquals(arithmetic.parse("(1+2)*3"), [{
    value: 9,
    remaining: "",
  }]);

  assertEquals(arithmetic.parse("1+2^3+2/2"), [{
    value: 10,
    remaining: "",
  }]);

  assertEquals(arithmetic.parse("(1+2)^3/3+1"), [{
    value: 10,
    remaining: "",
  }]);
});
