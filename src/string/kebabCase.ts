import { compoundWords } from '../internal/words.js';

/**
 * Converts string to kebab case.
 *
 * @param string - The string to convert
 * @returns The kebab cased string
 *
 * @example
 * ```ts
 * kebabCase('Foo Bar');
 * // => 'foo-bar'
 *
 * kebabCase('fooBar');
 * // => 'foo-bar'
 *
 * kebabCase('__FOO_BAR__');
 * // => 'foo-bar'
 *
 * kebabCase('Crème Brûlée');
 * // => 'creme-brulee'
 * ```
 */
export function kebabCase(string: string): string {
  if (!string) {
    return '';
  }

  return compoundWords(string)
    .map(word => word.toLowerCase())
    .join('-');
}
