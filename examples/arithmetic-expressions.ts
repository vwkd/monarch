/**
 * Example parser for simple arithmetic expressions
 */

import {
  bracket,
  foldL1,
  foldR1,
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

const factor = foldR1(atom, expOp);
const term = foldL1(factor, mulOp);

export const expr: Parser<number> = foldL1(term, addOp);
