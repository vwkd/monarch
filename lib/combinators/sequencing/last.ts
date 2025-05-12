import { result } from "../../primitives/result.ts";
import type { Parser } from "../../../src/parser/main.ts";

/**
 * Skips all parsers but the last one
 *
 * @param parsers The parsers
 * @returns A parser returning the result of the last parser
 *
 * @example Discard leading spaces
 *
 * ```ts
 * const word = last(whitespace, letters);
 *
 * word.parse(" abc");
 * // [{ value: "abc", remaining: "", ... }]
 * ```
 */
export function last<T>(
  ...parsers: [...Parser<unknown>[], Parser<unknown>, Parser<T>]
): Parser<T> {
  const rest = parsers.slice(0, -1) as Parser<unknown>[];
  const lastParser = parsers.at(-1) as Parser<T>;

  // p1.bind((_) => p2.bind((_) => ... => pN.bind((r) => result(r)) ... ));
  return rest.reduceRight<Parser<T>>(
    (acc, parser) => parser.bind((_) => acc),
    lastParser.bind((r) => result(r)),
  );
}
