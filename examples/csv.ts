/**
 * Example parser for CSV files
 */

import {
  bracket,
  first,
  type Parser,
  result,
  sepBy
} from "../parser.ts";
import { integer, literal, token, word } from "./basic.ts";

/**
 * Zips arrays of the same length
 *
 * @example let zipped = zip([1,2], ['a','b']);
 * zipped; // [[1, 'a'], [2, 'b']]
 */
const zip = <T, U>(array1: T[], array2: U[]): [T, U][] => {
  return array1.map((a, i) => {
    return [a, array2[i]];
  });
};

const string = token(bracket(literal('"'), word, literal('"')));
const item = first<string | number>(integer, string);

const header: Parser<
  (row: (string | number)[]) => Record<string, (string | number)>
> = sepBy(
  string,
  literal(","),
).map((headings) => (row: (string | number)[]) => {
  return Object.fromEntries(zip(headings, row));
});

const row = sepBy(item, literal(","));
const rows = sepBy(row, literal(";"));

export const csv: Parser<Record<string, string | number>[]> = header.bind((
  makeEntry,
) => rows.bind((rowsOfData) => result(rowsOfData.map(makeEntry))));
