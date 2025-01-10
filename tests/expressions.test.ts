import { assertEquals } from "@std/assert/equals";
import { expr } from "../examples/arithmetic-expressions.ts";

Deno.test("expression", () => {
  assertEquals(expr.parse("1+2"), [{
    value: 3,
    remaining: "",
  }]);

  assertEquals(expr.parse("1+2^3+1"), [{
    value: 10,
    remaining: "",
  }]);

  assertEquals(expr.parse("(1+2)^3+1"), [{
    value: 28,
    remaining: "",
  }]);
});
