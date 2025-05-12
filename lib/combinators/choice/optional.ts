import { createParser, type Parser } from "../../../src/parser/main.ts";

/**
 * Tries a parser or defaults to `undefined`
 *
 * @param parser The parser
 * @returns A parser returning the successful parse result or `undefined`
 *
 * @example
 *
 * ```ts
 * const number = optional(digit);
 *
 * number.parse("123");
 * // [{ value: 1, remaining: "23", ... }]
 * number.parse("abc");
 * // [{ value: undefined, remaining: "abc", ... }]
 */
export const optional = <T>(parser: Parser<T>): Parser<T | undefined> => {
  return createParser<T | undefined>((input, position) => {
    const result = parser.parse(input, position);

    if (result.success) {
      return result;
    }

    return {
      success: true,
      results: [
        {
          value: undefined,
          remaining: input,
          position,
        },
      ],
    };
  });
};
