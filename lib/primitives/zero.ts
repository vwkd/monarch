import { createParser, type Parser } from "../../src/parser/main.ts";

/**
 * The always failing parser
 *
 * It is the unit of alternation and plus, and also is an absorbing element of bind
 */
export const zero: Parser<never> = createParser((_, position) => ({
  success: false,
  message: "",
  position,
}));
