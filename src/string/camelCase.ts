import { compoundWords } from '../internal/words.js';

/**
 * Converts string to camel case.
 *
 * @param string - The string to convert
 * @returns The camel cased string
 *
 * @example
 * ```ts
 * camelCase('Foo Bar');
 * // => 'fooBar'
 *
 * camelCase('--foo-bar--');
 * // => 'fooBar'
 *
 * camelCase('__FOO_BAR__');
 * // => 'fooBar'
 *
 * camelCase('XMLHttpRequest');
 * // => 'xmlHttpRequest'
 *
 * camelCase("don't stop");
 * // => 'dontStop'
 * ```
 */
export function camelCase(string: string): string {
  if (!string) {
    return '';
  }

  return compoundWords(string)
    .map((word, index) => {
      const lower = word.toLowerCase();
      return index === 0 ? lower : lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join('');
}
