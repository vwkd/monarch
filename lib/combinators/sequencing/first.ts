import type { Parser } from "../../../src/parser/main.ts";
import { result } from "../../primitives/result.ts";

/**
 * Skips all parsers but the first one
 *
 * @param parsers The parsers
 * @returns A parser returning the result of the first parser
 *
 * @example Discard trailing spaces
 *
 * ```ts
 * const word = first(letters, whitespace);
 *
 * word.parse("abc ");
 * // [{ value: "abc", remaining: "", ... }]
 * ```
 */
export function first<T>(
  ...parsers: [Parser<T>, Parser<unknown>, ...Parser<unknown>[]]
): Parser<T> {
  const [firstParser, ...rest] = parsers;
  //  return p1.chain((r) => p2.chain((_) => ... => pN.chain((_) => result(r)) ... ));
  return firstParser.chain((r) =>
    rest.reduceRight<Parser<T>>(
      (acc, parser) => parser.chain((_) => acc),
      result(r),
    )
  );
}
