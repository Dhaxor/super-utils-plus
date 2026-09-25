import { compoundWords } from '../internal/words.js';

/**
 * Converts string to snake case.
 *
 * @param string - The string to convert
 * @returns The snake cased string
 *
 * @example
 * ```ts
 * snakeCase('Foo Bar');
 * // => 'foo_bar'
 *
 * snakeCase('fooBar');
 * // => 'foo_bar'
 *
 * snakeCase('--FOO-BAR--');
 * // => 'foo_bar'
 * ```
 */
export function snakeCase(string: string): string {
  if (!string) {
    return '';
  }

  return compoundWords(string)
    .map(word => word.toLowerCase())
    .join('_');
}
