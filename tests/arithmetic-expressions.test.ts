import { assertEquals } from "@std/assert/equals";
import { expr } from "../examples/arithmetic-expressions.ts";

Deno.test("arithmetic expressions", () => {
  assertEquals(expr.parse("-1"), [{
    value: -1,
    remaining: "",
  }]);

  assertEquals(expr.parse("+1.5"), [{
    value: 1.5,
    remaining: "",
  }]);

  assertEquals(expr.parse("1/2"), [{
    value: 0.5,
    remaining: "",
  }]);

  assertEquals(expr.parse("1--2"), [{
    value: 3,
    remaining: "",
  }]);

  assertEquals(expr.parse("1+2+3"), [{
    value: 6,
    remaining: "",
  }]);

  assertEquals(expr.parse("1*2*3"), [{
    value: 6,
    remaining: "",
  }]);

  assertEquals(expr.parse("2^2^3"), [{
    value: 2**8,
    remaining: "",
  }]);

  assertEquals(expr.parse("1+2*3"), [{
    value: 7,
    remaining: "",
  }]);

  assertEquals(expr.parse("(1+2)*3"), [{
    value: 9,
    remaining: "",
  }]);

  assertEquals(expr.parse("1+2^3+2/2"), [{
    value: 10,
    remaining: "",
  }]);

  assertEquals(expr.parse("(1+2)^3/3+1"), [{
    value: 10,
    remaining: "",
  }]);
});
