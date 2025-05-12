import { createParser, type Parser } from "../../src/parser/main.ts";

/**
 * A parser that always succeeds
 *
 * - doesn't consume any input
 *
 * @param value The value the parser succeeds with
 * @returns A parser returning the value
 */
export const result = <T>(value: T): Parser<T> => {
  return createParser((input, position) => ({
    success: true,
    results: [
      {
        value,
        remaining: input,
        position,
      },
    ],
  }));
};
