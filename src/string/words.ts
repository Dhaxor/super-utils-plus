/**
 * Matches words the way case-conversion helpers expect (combining marks stay attached
 * to their base letter, so decomposed text is not split at accents):
 * - runs of upper-case letters that form an acronym (`XML` in `XMLHttpRequest`, `FOO` in `FOO_BAR`)
 * - capitalised or lower-case words, keeping common English contractions (`don't`)
 * - single upper-case letters
 * - runs of letters without case (e.g. CJK) or in titlecase (e.g. ǅ)
 * - ordinals (`1st`, `22nd`, `3RD`) and runs of digits
 */
const WORD_PATTERN =
  /(?:\p{Lu}\p{M}*){2,}(?=\p{Lu}\p{M}*\p{Ll}|\d|[^\p{L}\p{M}\d]|$)|(?:\p{Lu}\p{M}*)?(?:\p{Ll}\p{M}*)+(?:['’](?:d|ll|m|re|s|t|ve)(?!\p{L}))?|\p{Lu}\p{M}*|(?:[\p{Lo}\p{Lt}]\p{M}*)+|\d+(?:st|nd|rd|th|ST|ND|RD|TH)(?!\p{L})|\d+/gu;

/**
 * Splits string into an array of its words.
 *
 * @param string - The string to inspect
 * @param pattern - The pattern to match words
 * @returns The words of string
 *
 * @example
 * ```ts
 * words('fred, barney, & pebbles');
 * // => ['fred', 'barney', 'pebbles']
 *
 * words('XMLHttpRequest');
 * // => ['XML', 'Http', 'Request']
 *
 * words('fred, barney, & pebbles', /[^, ]+/g);
 * // => ['fred', 'barney', '&', 'pebbles']
 * ```
 */
export function words(string: string, pattern?: RegExp | string): string[] {
  if (!string) {
    return [];
  }

  if (pattern === undefined) {
    return string.match(WORD_PATTERN) ?? [];
  }

  const regex =
    typeof pattern === 'string'
      ? new RegExp(pattern, 'g')
      : pattern.global
        ? pattern
        : new RegExp(pattern.source, pattern.flags + 'g');

  return string.match(regex) ?? [];
}
