/** Latin letters that do not decompose into a base letter plus combining marks. */
const LATIN_REPLACEMENTS: Record<string, string> = {
  Æ: 'Ae',
  æ: 'ae',
  Ð: 'D',
  ð: 'd',
  Ø: 'O',
  ø: 'o',
  Þ: 'Th',
  þ: 'th',
  ß: 'ss',
  Đ: 'D',
  đ: 'd',
  Ħ: 'H',
  ħ: 'h',
  ı: 'i',
  ĸ: 'k',
  Ŀ: 'L',
  ŀ: 'l',
  ŉ: "'n",
  Ŋ: 'N',
  ŋ: 'n',
  Ĳ: 'IJ',
  ĳ: 'ij',
  Ł: 'L',
  ł: 'l',
  Œ: 'Oe',
  œ: 'oe',
  Ŧ: 'T',
  ŧ: 't',
  ſ: 's',
};

const LATIN_REPLACEMENT_PATTERN = new RegExp(`[${Object.keys(LATIN_REPLACEMENTS).join('')}]`, 'g');
const COMBINING_MARKS = /\p{M}/gu;

/**
 * Deburrs string by converting Latin-1 Supplement and Latin Extended-A letters to
 * basic Latin letters and removing combining diacritical marks.
 *
 * @param string - The string to deburr
 * @returns The deburred string
 *
 * @example
 * ```ts
 * deburr('d\u00e9j\u00e0 vu');
 * // => 'deja vu'
 *
 * deburr('Stra\u00dfe');
 * // => 'Strasse'
 * ```
 */
export function deburr(string: string): string {
  if (!string) {
    return '';
  }

  return string
    .normalize('NFD')
    .replace(COMBINING_MARKS, '')
    .replace(LATIN_REPLACEMENT_PATTERN, char => LATIN_REPLACEMENTS[char]);
}
