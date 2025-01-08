type Parser<T> = (input: State) => ParseResult<T>[];
type State = string;

type ParseResult<T> = {
  value?: T;
  remaining?: State;
  error?: string;
};

// Helpers

export const createParser = <T>(fn: Parser<T>): Parser<T> => fn;

export const success = <T>(value: T, remaining: State): ParseResult<T> => {
  return { value, remaining };
};

export const failure = (error: string): ParseResult<never> => {
  return { error };
};

/**
 * The empty parser
 */
export const unit = <T>(value: T): Parser<T> => {
  return (remaining: State) => [{ value, remaining }];
};

/**
 * Zero is the unit of alternation
 * It also is an absorbing element of flatMap
 */
export const zero = (_: State) => [];

/**
 * Monadic sequencing of parsers
 */
export const flatMap = <T, U>(
  parser: Parser<T>,
  transform: (value: T) => Parser<U>,
): Parser<U> => {
  return (input: State) => {
    return parser(input).flatMap(({ value, remaining, error }) => {
      if (value !== undefined && remaining !== undefined) {
        return transform(value)(remaining);
      } else if (error) {
        return [{ error }];
      }
      return [];
    });
  };
};

// Combinators

// Sequencing

/**
 * Makes a sequence of parses
 */
const sequence = <T>(...parsers: Parser<T>[]) => {
  return createParser((input) =>
    parsers.reduce((prev, curr) => flatMap(prev, () => curr))(input)
  );
};

// Alternation

/**
 * Returns all matching parses
 */
export const any = <T>(...parsers: Parser<T>[]) => {
  return createParser((input) => {
    const results = parsers.flatMap((parser) => parser(input));

    if (results.some((res) => res.value !== undefined)) {
      return results.filter((res) => res.value !== undefined);
    }

    return [];
  });
};

// Choice

/**
 * Only returns the first successful parse results
 */
export const first = <T>(...parsers: Parser<T>[]): Parser<T> => {
  return createParser((input) => {
    for (const parser of parsers) {
      const results = parser(input);
      if (results.find((result) => result.value !== undefined)) {
        return results;
      }
    }
    return [];
  });
};

// Iteration

/**
 * Returns an array of all iterated parses
 */
export const iterate = <T>(parser: Parser<T>): Parser<T[]> => {
  return createParser((input) => {
    return any(
      flatMap(
        parser,
        (a) => flatMap(iterate(parser), (x) => unit([a, ...x])),
      ),
      unit([]),
    )(input);
  });
};

/**
 * Return the longest matching parse array (0 or more)
 */
export const many = <T>(parser: Parser<T>): Parser<T[]> => {
  return createParser((input) => {
    return first(
      flatMap(parser, (a) => flatMap(many(parser), (x) => unit([a, ...x]))),
      unit([]),
    )(input);
  });
};

// Filtering

/**
 * Preserves `zero` and distributes over alternation
 */
export const filter = <T>(
  parser: Parser<T>,
  predicate: (value: T) => boolean,
  error?: string,
): Parser<T> => {
  return flatMap(parser, (value) => {
    if (predicate(value)) {
      return unit(value);
    } else if (error) {
      return () => [failure(error)];
    }
    return zero;
  });
};

// Predicates

export const isLetter = (input: string) => /^[a-zA-Z]/.test(input);
export const isDigit = (input: string) => /^\d/.test(input);
export const isChar = (char: string) => (input: string) =>
  input.startsWith(char);

/**
 * Basic parsers
 */

export const item = createParser((input) => {
  if (input.length > 0) {
    return [success(input[0], input.slice(1))];
  }
  return [];
});

export const twoItems = sequence(item, item);
export const twoItemsf = createParser((input) => {
  return flatMap(item, (a) => flatMap(item, (b) => unit(a + b)))(input);
});

const char = (c: string): Parser<string> =>
  createParser((input) => {
    if (input.startsWith(c)) {
      return [success(c, input.slice(1))];
    } else {
      return [
        failure(`Expected ${c}, but got '${input[0] || "EOI"}'`),
      ];
    }
  });

const digit = createParser((input) => {
  return /^\d/.test(input)
    ? [{ value: input[0], remaining: input.slice(1) }]
    : [failure(`Expected a digit but got ${input[0] || "EOI"}`)];
});

export const letter = createParser((input) => {
  return /^[a-zA-Z]/.test(input)
    ? [{ value: input[0], remaining: input.slice(1) }]
    : [failure(`Expected a letter but got ${input[0] || "EOI"}`)];
});
