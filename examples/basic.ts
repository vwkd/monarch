import {
  bracket,
  chainl1,
  createParser,
  filter,
  first,
  many,
  type Parser,
  repeat,
  result,
  sepBy1,
} from "../parser.ts";

export const regexPredicate = (regex: RegExp) => (input: string) =>
  regex.test(input);

const isAlphaNum = regexPredicate(/^\w/);
const isLetter = regexPredicate(/^[a-zA-Z]/);
const isLower = regexPredicate(/^[a-z]/);
const isUpper = regexPredicate(/^[A-Z]/);
const isDigit = regexPredicate(/^\d/);
const isSpace = regexPredicate(/^\s/);

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
 * Parses spaces
 */
export const spaces = many(filter(item, isSpace));

/**
 * Discards trailing spaces
 */
export const token = <T>(parser: Parser<T>) => {
  return parser.bind((p) => spaces.bind(() => result(p)));
};

export const twoItems = repeat(item, 2).map((arr) => arr.join(""));

/**
 * Parses a single character or a keyword
 */
export const literal = (value: string) => {
  return token(createParser((input) => {
    if (input.startsWith(value)) {
      return [{ value, remaining: input.slice(value.length) }];
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
  }));
};

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
 * Parser a string of letters
 */
export const word = many(letter).map((letters) => letters.join(""));

export const alphaNum = many(filter(item, isAlphaNum)).map((letters) =>
  letters.join("")
);

export const identifier = token(letter.bind((l) => alphaNum.map((rest) => l + rest)));

/**
 * Parses a single digit
 */
export const digit = filter(item, isDigit).map(Number.parseInt);

/**
 * Parses a natural number
 */
export const natural = token(chainl1(
  digit,
  result((a: number, b: number) => 10 * a + b),
));

/**
 * Parses an integer
 */
export const integer = token(first(
  literal("-").bind(() => natural).map((x) => -x),
  natural,
));

export const listOf = <T>(p: Parser<T>) =>
  bracket(
    literal("["),
    sepBy1(p, literal(",")),
    literal("]"),
  );

export const listOfInts = listOf(integer);

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
