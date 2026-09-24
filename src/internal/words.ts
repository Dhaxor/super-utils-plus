import { deburr } from '../string/deburr.js';
import { words } from '../string/words.js';

const APOSTROPHES = /['\u2019]/g;

/**
 * Splits a string into the words the case converters join back together:
 * deburred, with apostrophes removed so contractions stay one word (`don't` -> `dont`).
 *
 * @internal
 */
export function compoundWords(string: string): string[] {
  return words(deburr(string).replace(APOSTROPHES, ''));
}
