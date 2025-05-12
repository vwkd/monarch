import { createParser, type Parser } from "../../../src/parser/main.ts";
import { sortPosition } from "../../../src/utilities.ts";

/**
 * A parser that tries all parsers until one succeeds
 *
 * @param parsers The parsers
 * @returns A parser returning the first successful parse result
 *
 * @example Text
 *
 * ```ts
 * const text = or(digit, letter);
 *
 * text.parse("123abc");
 * // results: [{ value: 1, remaining: "23abc", ... }]
 * text.parse("abc123");
 * // results: [{ value: "a", remaining: "bc123", ... }]
 * ```
 */
export const or = <T>(...parsers: Parser<T>[]): Parser<T> => {
  return createParser((input, position) => {
    const results = [];

    for (const parser of parsers) {
      const result = parser.parse(input, position);

      if (result.success === true) {
        return result;
      }

      results.push(result);
    }

    const error = results
      .sort((a, b) => sortPosition(a.position, b.position))[0];

    return error;
  });
};
