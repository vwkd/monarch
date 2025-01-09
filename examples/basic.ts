import { createParser, filter, many, sequence, unit } from "../parser.ts";

export const regexPredicate = (regex: RegExp) => (input: string) =>
  regex.test(input);

const isLetter = regexPredicate(/^[a-zA-Z]/);
const isLower = regexPredicate(/^[a-z]/);
const isUpper = regexPredicate(/^[A-Z]/);
const isDigit = regexPredicate(/^\d/);

/**
 * Parses the first character
 */
export const item = createParser((input) => {
  if (input.length > 0) {
    return [{ value: input[0], remaining: input.slice(1) }];
  }
  return [];
});

export const twoItems = sequence(item, item).map((arr) => arr.join(""));

/**
 * Parses a single letter (case insensitive)
 */
export const letter = filter(item, isLetter);

/**
 * Pareses a single lower case letter
 */
export const lower = filter(item, isLower);

/**
 * Pareses a single upper case letter
 */
export const upper = filter(item, isUpper);

/**
 * Parses a single digit
 */
export const digit = filter(item, isDigit).map(Number.parseInt);

/**
 * Parses an integer
 */
export const integer = digit.bind(
  (a) => many(digit).bind((rest) => unit(Number([a, ...rest].join("")))),
);

/**
 * Parses a single character or a keyword
 */
export const literal = (value: string) =>
  filter(item, (input) => input.startsWith(value));

const assertLiteral = (value: string) => {
  return createParser((input) => {
    if (input.startsWith(value)) {
      return [{ value: value, remaining: input.slice(value.length) }];
    } else {
      return [
        {
          error:
            (`Expected ${value}, but got '${
              input.slice(0, value.length) || "EOI"
            }'`),
        },
      ];
    }
  });
};

const assertDigit = createParser((input) => {
  return /^\d/.test(input)
    ? [{ value: input[0], remaining: input.slice(1) }]
    : [{ error: `Expected a digit but got ${input[0] || "EOI"}` }];
});

const assertletter = createParser((input) => {
  return /^[a-zA-Z]/.test(input)
    ? [{ value: input[0], remaining: input.slice(1) }]
    : [{ error: `Expected a letter but got ${input[0] || "EOI"}` }];
});
