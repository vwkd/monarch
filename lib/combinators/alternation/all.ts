import { createParser, type Parser } from "../../../src/parser/main.ts";
import { sortPosition } from "../../../src/utilities.ts";

/**
 * A parser that runs all parsers
 *
 * @param parsers The parsers
 * @returns A parser returning all successful parse results, or if all failed the error of the parser that got furthest
 *
 * @example Numbers
 *
 * ```ts
 * const numbers = all(digit, number);
 *
 * numbers.parse("123abc");
 * // results: [{ value: 1, remaining: "23abc", ... }, { value: 123, remaining: "abc", ... }]
 * ```
 */
export const all = <T>(...parsers: Parser<T>[]): Parser<T> => {
  return createParser((input, position) => {
    const allResults = parsers.map((parser) => parser.parse(input, position));

    if (allResults.every((r) => r.success === false)) {
      const error = allResults
        .sort((a, b) => sortPosition(a.position, b.position))[0];

      return error;
    }

    const results = allResults
      .filter((res) => res.success === true)
      .flatMap((r) => r.results);

    return {
      success: true,
      results,
    };
  });
};
