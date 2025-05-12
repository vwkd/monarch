import { createParser, type Parser } from "../../src/parser/main.ts";

/**
 * A parser that always fails
 *
 * - doesn't consume any input
 * - use `.error()` to set a custom error
 *
 * @returns A parser returning a default error
 */
export const fail: Parser<never> = createParser((_, position) => ({
  success: false,
  message: "fail: default error",
  position,
}));
