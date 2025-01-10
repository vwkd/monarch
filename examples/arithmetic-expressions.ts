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
import { integer, literal } from "./basic.ts";

const addOp = first(
  literal("+").map(() => (a: number, b: number) => a + b),
  literal("-").map(() => (a: number, b: number) => a - b),
);
const mulOp = first(
  literal("*").map(() => (a: number, b: number) => a * b),
  literal("/").map(() => (a: number, b: number) => a / b),
);
const expOp = literal("^").map(() => (a: number, b: number) => a ** b);

// integer | (expr)
const atom = memoize(() =>
  first(
    integer,
    bracket(
      literal("("),
      expr,
      literal(")"),
    ),
  )
);

const factor = chainr1(atom, expOp);
const term = chainl1(factor, mulOp);

export const expr: Parser<number> = chainl1(term, addOp);
