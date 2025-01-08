import { many } from "../parser.ts";
import {
  createParser,
  filter,
  flatMap,
  isDigit,
  isLetter,
  map,
  sequence,
  unit,
} from "../parser.ts";

/**
 * Parses the first character
 */
export const item = createParser((input) => {
  if (input.length > 0) {
    return [{ value: input[0], remaining: input.slice(1) }];
  }
  return [];
});

/**
 * Parses a single letter (case insensitive)
 */
export const letter = filter(item, isLetter);

/**
 * Parses a single digit
 */
export const digit = map(filter(item, isDigit), Number.parseInt);

/**
 * Parses an integer
 */
export const integer = flatMap(
  digit,
  (a) => flatMap(many(digit), (rest) => unit(Number([a, ...rest].join("")))),
);

export const twoItems = sequence(item, item);
export const twoItemsf = createParser((input) => {
  return flatMap(item, (a) => flatMap(item, (b) => unit(a + b)))(input);
});

const char = (c: string) =>
  createParser((input) => {
    if (input.startsWith(c)) {
      return [{ value: c, remaining: input.slice(1) }];
    } else {
      return [
        { error: (`Expected ${c}, but got '${input[0] || "EOI"}'`) },
      ];
    }
  });

const assertDigit = createParser((input) => {
  return /^\d/.test(input)
    ? [{ value: input[0], remaining: input.slice(1) }]
    : [{ error: `Expected a digit but got ${input[0] || "EOI"}` }];
});

export const assertletter = createParser((input) => {
  return /^[a-zA-Z]/.test(input)
    ? [{ value: input[0], remaining: input.slice(1) }]
    : [{ error: `Expected a letter but got ${input[0] || "EOI"}` }];
});
