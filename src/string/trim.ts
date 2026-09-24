/**
 * Removes leading and trailing whitespace or specified characters from string.
 *
 * @param string - The string to trim
 * @param chars - The characters to trim (whitespace when omitted; an empty string trims nothing)
 * @returns The trimmed string
 *
 * @example
 * ```ts
 * trim('  abc  ');
 * // => 'abc'
 *
 * trim('-_-abc-_-', '_-');
 * // => 'abc'
 * ```
 */
export function trim(string: string, chars?: string): string {
  if (!string) {
    return '';
  }

  if (chars == null) {
    return string.trim();
  }

  return string.slice(startOffset(string, chars), endOffset(string, chars));
}

/**
 * Removes leading whitespace or specified characters from string.
 *
 * @param string - The string to trim
 * @param chars - The characters to trim
 * @returns The trimmed string
 *
 * @example
 * ```ts
 * trimStart('  abc  ');
 * // => 'abc  '
 *
 * trimStart('-_-abc-_-', '_-');
 * // => 'abc-_-'
 * ```
 */
export function trimStart(string: string, chars?: string): string {
  if (!string) {
    return '';
  }

  if (chars == null) {
    return string.trimStart();
  }

  return string.slice(startOffset(string, chars));
}

/**
 * Removes trailing whitespace or specified characters from string.
 *
 * @param string - The string to trim
 * @param chars - The characters to trim
 * @returns The trimmed string
 *
 * @example
 * ```ts
 * trimEnd('  abc  ');
 * // => '  abc'
 *
 * trimEnd('-_-abc-_-', '_-');
 * // => '-_-abc'
 * ```
 */
export function trimEnd(string: string, chars?: string): string {
  if (!string) {
    return '';
  }

  if (chars == null) {
    return string.trimEnd();
  }

  return string.slice(0, endOffset(string, chars));
}

function startOffset(string: string, chars: string): number {
  let start = 0;
  while (start < string.length && chars.includes(string[start])) {
    start++;
  }
  return start;
}

function endOffset(string: string, chars: string): number {
  let end = string.length;
  while (end > 0 && chars.includes(string[end - 1])) {
    end--;
  }
  return end;
}
