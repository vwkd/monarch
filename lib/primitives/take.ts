import { parseErrors } from "../../src/errors.ts";
import { createParser, type Parser } from "../../src/parser/main.ts";
import { updatePosition } from "../../src/utilities.ts";

/**
 * A parser consuming one token
 *
 * @throws ParseError if the input is empty
 *
 * @example Non-empty input
 *
 * ```ts
 * take.parse("abc");
 * // [{ value: "a", remaining: "bc", ... }]
 * ```
 *
 * @example Empty input
 *
 * ```ts
 * take.parse("");
 * // "Unexpected end of input"
 * ```
 */
export const take: Parser<string> = createParser(
  (input, position) => {
    if (input.length === 0) {
      return {
        success: false,
        message: parseErrors.takeError,
        position,
      };
    }

    const consumed = input[0];
    const newPosition = updatePosition(position, consumed);

    return {
      success: true,
      results: [{
        value: consumed,
        position: newPosition,
        remaining: input.slice(1),
      }],
    };
  },
);
