import { ParseError } from "../errors.ts";
import type { ParseResult, ParsingHandler, Position } from "../types.ts";
import { sortPosition } from "../utilities.ts";

/**
 * Utility to create a new parser
 */
export const createParser = <T>(
  fn: ParsingHandler<T>,
): Parser<T> => new Parser(fn);

/**
 * The monadic parser class
 */
export class Parser<T> {
  #parse: ParsingHandler<T>;
  #error = "";

  /**
   * Creates a new {@linkcode Parser}
   *
   * @see {@linkcode createParser}
   */
  constructor(parse: ParsingHandler<T>) {
    this.#parse = parse;
  }

  /**
   * Parses the input
   *
   * @param input The input to parse
   * @param position The starting position
   */
  parse(
    input: string,
    position: Position = { line: 1, column: 0 },
  ): ParseResult<T> {
    const result = this.#parse(input, position);

    if (!result.success && this.#error) {
      return { success: false, message: this.#error, position };
    }

    return result;
  }

  /**
   * Parse an input with a given parser and extract the first result value or throw if the parse fails
   */
  parseOrThrow(
    input: string,
  ): T {
    const result = this.parse(input);

    if (!result.success) {
      const lines = input.split("\n");
      const { line } = result.position;
      const snippet = lines[line - 1];

      throw new ParseError(
        result.position,
        result.message,
        snippet,
      );
    }

    return result.results[0].value;
  }

  /**
   * Defaults to the value if the parser fails
   *
   * @param value The default value
   * @returns A parser returning the successful parse result or the default value
   *
   * @example
   *
   * ```ts
   * digit.default(42).parse("123");
   * // [{ value: 1, remaining: "23", ... }]
   * digit.default(42).parse("abc");
   * // [{ value: 42, remaining: "abc", ... }]
   * ```
   */
  default(value: T): Parser<T> {
    return createParser((input, position) => {
      const result = this.parse(input, position);

      if (result.success) {
        return result;
      }

      return {
        success: true,
        results: [
          {
            value,
            remaining: input,
            position,
          },
        ],
      };
    });
  }

  /**
   * Transforms the value of the parser
   *
   * @param transform A function being passed the results of the parser that returns the new value
   * @returns A parser returning the new value
   *
   * @example
   *
   * ```ts
   * const digit = digit.map((d) => d + 41);
   * digit.parse("123abc");
   * // [{ value: 42, remaining: "23abc", ... }]
   * ```
   */
  map<U>(transform: (value: T) => U): Parser<U> {
    return createParser((input, position) => {
      const result = this.parse(input, position);

      if (!result.success) {
        return result;
      }

      const allResults = result.results
        .map(({ value, remaining, position }) => ({
          value: transform(value),
          remaining,
          position,
        }));

      return {
        success: true,
        results: allResults,
      };
    });
  }

  /**
   * Adds a parser after the parser
   *
   * - useful for conditional parsing when `and(...).map(...)` are not enough
   *
   * @param transform A function being passed the results of the parser that returns the next parser
   * @returns A parser returning all successful results of the next parser, or if all failed the error of the parser that got furthest
   *
   * @example
   *
   * ```ts
   * const digit = digit.chain((d) => d === 0 ? letter.map((l) => `${d}${l}`) : result(d));
   *
   * digit.parse("0ab");
   * // [{ value: "0a", remaining: "b", ... }]
   * digit.parse("123");
   * // [{ value: 1, remaining: "23", ... }]
   * ```
   */
  chain<U>(transform: (value: T) => Parser<U>): Parser<U> {
    return createParser((input, position) => {
      const result = this.parse(input, position);

      if (!result.success) {
        return result;
      }

      const allResults = result.results
        .map(({ position, remaining, value }) =>
          transform(value).parse(remaining, position)
        );

      if (allResults.every((r) => r.success === false)) {
        const error = allResults
          .sort((a, b) => sortPosition(a.position, b.position))[0];

        return error;
      }

      const results = allResults
        .filter((r) => r.success === true)
        .flatMap((r) => r.results);

      return {
        success: true,
        results,
      };
    });
  }

  /**
   * Customize the error message of a parser
   *
   * @example
   *
   * ```ts
   * const even = regex(/^[02468]/).error("Expected an even number");
   *
   * const { results } = even.parse("24"); // [{value: '2', remaining: '4', ...}]
   * const { message } = even.parse("13"); // "Expected an even number"
   * ```
   */
  error(message: string): this {
    this.#error = message;
    return this;
  }
}
