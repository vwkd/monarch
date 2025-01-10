import { assertEquals } from "@std/assert/equals";
import { arithmetic } from "../examples/arithmetic-expressions.ts";

Deno.test("expression", () => {
  assertEquals(arithmetic.parse("1+2"), [{
    value: 3,
    remaining: "",
  }]);

  assertEquals(arithmetic.parse("1+2^3+1"), [{
    value: 10,
    remaining: "",
  }]);

  assertEquals(arithmetic.parse("(1+2)^3+1"), [{
    value: 28,
    remaining: "",
  }]);
});
