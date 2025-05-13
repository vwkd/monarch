import type { Parser } from "../../../src/parser/main.ts";
import { and } from "./and.ts";

/**
 * A parser that discards the result of the parser in between
 *
 * @param start The first parser
 * @param mid The parser in between
 * @param end The last parser
 * @returns A parser returning the results of the first and last parsers
 *
 * @example
 *
 * ```ts
 * const text = around(digit, letter, digit);
 *
 * text.parse("1a2b3c");
 * // [{ value: [ 1, 2 ], remaining: "b3c", ... }]
 * ```
 */
export function around<T, U, V>(
  start: Parser<T>,
  mid: Parser<U>,
  end: Parser<V>,
): Parser<[T, V]> {
  return and(start, mid, end).map(([s, _, e]) => [s, e]);
}
