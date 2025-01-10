/**
 * Example parser for simple arithmetic expressions
 */

import {
  bracket,
  chainl1,
  chainr1,
  first,
  memoize,
  type Parser,
} from "../parser.ts";
import { literal, natural } from "./basic.ts";

const additiveOp = first(
  literal("+").map(() => (a: number, b: number) => a + b),
  literal("-").map(() => (a: number, b: number) => a - b),
);

const expOp = literal("^").map(() => (a: number, b: number) => a ** b);

// natural | (expr)
const factor: Parser<number> = memoize(() =>
  first(
    natural,
    bracket(
      literal("("),
      arithmetic,
      literal(")"),
    ),
  )
);

const term = chainr1(factor, expOp);
export const arithmetic = chainl1(term, additiveOp);
