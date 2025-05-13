import type { Parser } from "../../../src/parser/main.ts";
import { result } from "../../primitives/result.ts";
import { or } from "../choice/or.ts";

/**
 * Returns the longest matching parse array (0 or more matches)
 *
 * @example
 *
 * ```ts
 * const digit = regex(/^\d/);
 * const { results } = many(digit).parse("23 and more"); // [{value: ["2", "3"], remaining: " and more", ...}]
 * ```
 */
export const many = <T>(parser: Parser<T>): Parser<T[]> => {
  return or(
    parser.bind((a) => many(parser).bind((x) => result([a, ...x]))),
    result([]),
  );
};
