import {
  bracket,
  createParser,
  filter,
  first,
  foldL1,
  many,
  type Parser,
  repeat,
  result,
  sepBy1,
  sequence,
} from "../index.ts";

export const regexPredicate = (regex: RegExp) => (input: string) =>
  regex.test(input);

export const isAlphaNum = regexPredicate(/^\w/);
export const isLetter = regexPredicate(/^[a-zA-Z]/);
export const isLower = regexPredicate(/^[a-z]/);
export const isUpper = regexPredicate(/^[A-Z]/);
export const isDigit = regexPredicate(/^\d/);
export const isSpace = regexPredicate(/^\s/);

/**
 * Parses the next character
 */
export const take = createParser((input) => {
  if (input.length > 0) {
    return [{ value: input[0], remaining: input.slice(1) }];
  }
  return [];
});

/**
 * Parses the next two characters
 */
export const takeTwo = repeat(take, 2).map((arr) => arr.join(""));

/**
 * Parses spaces
 */
export const spaces = many(filter(take, isSpace));

/**
 * Discards trailing spaces
 */
export const token = <T>(parser: Parser<T>) => {
  return parser.bind((p) => spaces.bind(() => result(p)));
};

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
export const letter = filter(take, isLetter);

/**
 * Pareses a single lower case letter
 */
export const lower = filter(take, isLower);

/**
 * Pareses a single upper case letter
 */
export const upper = filter(take, isUpper);

/**
 * Parser a string of letters
 */
export const word = many(letter).map((letters) => letters.join(""));

export const alphaNum = many(filter(take, isAlphaNum)).map((letters) =>
  letters.join("")
);

export const identifier = token(
  letter.bind((l) => alphaNum.map((rest) => l + rest)),
);

/**
 * Parses a single digit
 */
export const digit = filter(take, isDigit).map(Number.parseInt);

/**
 * Parses a natural number
 */
export const natural = token(foldL1(
  digit,
  result((a: number, b: number) => 10 * a + b),
));

/**
 * Parses an integer (element of ℤ)
 */
export const integer = token(first(
  literal("-").bind(() => natural).map((x) => -x),
  literal("+").bind(() => natural).map((x) => x),
  natural,
));

/**
 * Parses a decimal number aka a float
 */
export const decimal = token(
  sequence([integer, literal("."), natural]).map(([pre, _, post]) =>
    pre + Math.pow(10, -Math.ceil(Math.log10(post))) * post
  ),
);

/**
 * Parses a number as decimal | integer
 */
export const number = first(decimal, integer);

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
