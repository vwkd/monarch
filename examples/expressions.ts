/**
 * Example parser for simple arithmetic expressions
 */

import {
  bracket,
  chainl1,
  chainr1,
  first,
  lazy,
  type Parser
} from "../parser.ts";
import { literal, natural } from "./basic.ts";

const additiveOp = first(
  literal("+").map(() => (a: number, b: number) => a + b),
  literal("-").map(() => (a: number, b: number) => a - b),
);

const expOp = literal("^").map(() => (a: number, b: number) => a ** b);

// natural | (expr)
const factor: Parser<number> = lazy(() =>
  first(
    natural,
    bracket(
      literal("("),
      expr,
      literal(")"),
    ),
  )
);

const term = chainr1(factor, expOp);
export const expr = chainl1(term, additiveOp);
