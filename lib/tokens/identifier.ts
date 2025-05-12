import type { Parser } from "../../src/parser/main.ts";
import { alphaNums } from "./alphaNums.ts";
import { letter } from "./letter.ts";

/**
 * Parses an identifier token as letter + alphanums
 */
export const identifier: Parser<string> = letter.chain((l) =>
  alphaNums.map((rest) => l + rest)
);
