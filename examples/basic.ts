import {
  createParser,
  filter,
  isDigit,
  isLetter, many, sequence,
  unit
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

export const twoItems = sequence(item, item);
export const twoItemsf = item.bind((a) => item.bind((b) => unit(a + b)));

/**
 * Parses a single letter (case insensitive)
 */
export const letter = filter(item, isLetter);

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

export const assertLiteral = (value: string) => {
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

export const assertletter = createParser((input) => {
  return /^[a-zA-Z]/.test(input)
    ? [{ value: input[0], remaining: input.slice(1) }]
    : [{ error: `Expected a letter but got ${input[0] || "EOI"}` }];
});
