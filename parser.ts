type State = string;

type ParseResult<T> = {
  value?: T;
  remaining?: State;
  error?: string;
};

class Parser<T> {
  parse: (input: State) => ParseResult<T>[];

  constructor(parse: (input: State) => ParseResult<T>[]) {
    this.parse = parse;
  }

  /**
   * Transforms a parser of type T into a parser of type U
   */
  map<U>(transform: (value: T) => U): Parser<U> {
    return createParser((input) => {
      return this.parse(input).map((result) => ({
        ...result,
        value: result?.value !== undefined
          ? transform(result.value)
          : undefined,
      }));
    });
  }

  /**
   * Applies a function parser to a lifted value
   */
  apply<U>(fn: Parser<(value: T) => U>): Parser<U> {
    return createParser((input: State) => {
      return fn.parse(input).flatMap(({ value, remaining, error }) => {
        if (value && remaining !== undefined) {
          return this.parse(remaining).map((res) => {
            if (res.value && res.remaining) {
              return {
                value: value(res.value),
                remaining: res.remaining,
              } satisfies ParseResult<U>;
            }
            return { error: res.error };
          });
        }
        return [{ error }];
      });
    });
  }

  /**
   * Monadic sequencing of parsers
   */
  bind<U>(transform: (value: T) => Parser<U>): Parser<U> {
    return createParser((input: State) => {
      return this.parse(input).flatMap(({ value, remaining, error }) => {
        if (value !== undefined && remaining !== undefined) {
          return transform(value).parse(remaining);
        } else if (error) {
          return [{ error }];
        }
        return [];
      });
    });
  }
}

// Helpers

export const createParser = <T>(
  fn: (input: State) => ParseResult<T>[],
): Parser<T> => new Parser(fn);

/**
 * The default embedding of a value in the Parser context
 *
 * Succeeds without consuming any of the input string
 */
export const unit = <T>(value: T): Parser<T> => {
  return createParser((remaining: State) => [{ value, remaining }]);
};

/**
 * Zero is the unit of alternation, and always fails
 *
 * It also is an absorbing element of flatMap
 */
export const zero = createParser<any>((_: State) => []);

/**
 * Decorator that makes a parser return an error message if it fails
 */
export const orThrow = <T>(parser: Parser<T>, error: string): Parser<T> => {
  return createParser((input) => {
    const results = parser.parse(input);
    if (results.filter((result) => result.value !== undefined).length > 0) {
      return results;
    }
    return [{ error }];
  });
};

// Combinators

// Sequencing

/**
 * Makes a sequence of parses
 */
export const sequence = <T>(...parsers: Parser<T>[]) => {
  return createParser((input) =>
    parsers.reduce((prev, curr) => prev.bind(() => curr)).parse(input)
  );
};

// Alternation

/**
 * Returns all matching parses
 */
export const any = <T>(...parsers: Parser<T>[]) => {
  return createParser((input) => {
    const results = parsers.flatMap((parser) => parser.parse(input));

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
export const first = <T>(
  ...parsers: Parser<T>[]
): Parser<T> => {
  return createParser((input) => {
    for (const parser of parsers) {
      const results = parser.parse(input);
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
      parser.bind(
        (a) => (iterate(parser).bind((x) => unit([a, ...x]))),
      ),
      unit([]),
    ).parse(input);
  });
};

/**
 * Return the longest matching parse array (0 or more)
 */
export const many = <T>(parser: Parser<T>): Parser<T[]> => {
  return createParser((input) => {
    return first(
      parser.bind((a) => many(parser).bind((x) => unit([a, ...x]))),
      unit([]),
    ).parse(input);
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
  return parser.bind((value) => {
    if (predicate(value)) {
      return unit(value);
    } else if (error) {
      return createParser(() => [{ error }]);
    }
    return zero;
  });
};

// Predicates

export const isLetter = (input: string) => /^[a-zA-Z]/.test(input);
export const isDigit = (input: string) => /^\d/.test(input);
export const isChar = (char: string) => (input: string) =>
  input.startsWith(char);
