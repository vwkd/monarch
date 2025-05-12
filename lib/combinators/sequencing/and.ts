import type { Parser } from "../../../src/parser/main.ts";
import { result } from "../../primitives/result.ts";
import type { UnwrappedTuple } from "../../types.ts";

/**
 * Parses a sequence
 *
 * @param parsers The parsers
 * @returns A parser returning an array of parse results
 *
 * @example Text
 *
 * ```ts
 * const text = and(digit, letter);
 *
 * text.parse("1a2b");
 * // results: [{ value: [1, "a"], remaining: "2b", ... }]
 * ```
 */
export function and<T extends Parser<unknown>[]>(
  ...parsers: [...T]
): Parser<UnwrappedTuple<T>> {
  //  p1.chain((r1) => p2.chain((r2) => ... => pN.chain((rN) => result([r1, r2, ..., rN])) ... ));
  return parsers.reduceRight(
    (acc, parser) =>
      parser.chain((r) => acc.map((rs) => [r, ...rs] as UnwrappedTuple<T>)),
    result([] as UnwrappedTuple<T>),
  );
}
