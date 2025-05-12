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

  // p1.chain((_) => p2.chain((_) => ... => pN.chain((r) => result(r)) ... ));
  return rest.reduceRight<Parser<T>>(
    (acc, parser) => parser.chain((_) => acc),
    lastParser.chain((r) => result(r)),
  );
}
