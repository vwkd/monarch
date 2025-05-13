import type { Parser } from "../../../src/parser/main.ts";
import { and } from "./and.ts";

/**
 * A parser that discards the results of the first and last parsers
 *
 * @param start The first parser
 * @param mid The parser in between
 * @param end The last parser
 * @returns A parser returning the result of the middle parser
 *
 * @example
 *
 * ```ts
 * const text = between(digit, letter, digit);
 *
 * text.parse("1a2b3c");
 * // [{ value: [ "a" ], remaining: "b3c", ... }]
 * ```
 */
export function between<T, U, V>(
  start: Parser<T>,
  mid: Parser<U>,
  end: Parser<V>,
): Parser<U> {
  return and(start, mid, end).map(([_, m, __]) => m);
}
