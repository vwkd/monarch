import type { Parser } from "../../../src/parser/main.ts";
import { result } from "../../primitives/result.ts";
import { all } from "../alternation/all.ts";

/**
 * A parser that runs a parser iteratively
 *
 * @param parser The parser
 * @returns A parser returning an array of iterative parse results
 *
 * @example
 *
 * ```ts
 * const digits = iterate(digit);
 *
 * digits.parse("123abc");
 * // [{ value: [1, 2, 3], remaining: "abc", ... }, { value: [1, 2], remaining: "3abc", ... }, { value: [1], remaining: "23abc", ... }, { value: [], remaining: "123abc", ... }]
 * ```
 */
export const iterate = <T>(parser: Parser<T>): Parser<T[]> => {
  return all(
    parser.chain((a) => iterate(parser).chain((x) => result([a, ...x]))),
    result([]),
  );
};
