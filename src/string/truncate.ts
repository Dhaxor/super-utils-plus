import { TruncateOptions } from '../utils/types.js';

/**
 * Truncates string if it's longer than the given maximum string length.
 * The last characters of the truncated string are replaced with the omission
 * string which defaults to "...". When a separator is given, the string is cut
 * at the last separator before the limit so that words are not split; if the
 * cut already lands on a separator, nothing more is removed.
 *
 * @param string - The string to truncate
 * @param options - The options object
 * @returns The truncated string
 *
 * @example
 * ```ts
 * truncate('hi-diddly-ho there, neighborino');
 * // => 'hi-diddly-ho there, neighbo...'
 *
 * truncate('hi-diddly-ho there, neighborino', {
 *   length: 24,
 *   omission: ' [...]'
 * });
 * // => 'hi-diddly-ho there [...]'
 *
 * truncate('hi-diddly-ho there, neighborino', {
 *   length: 24,
 *   omission: ' [...]',
 *   separator: ' '
 * });
 * // => 'hi-diddly-ho [...]'
 *
 * truncate('hi-diddly-ho there, neighborino', {
 *   length: 24,
 *   omission: ' [...]',
 *   separator: /,? +/
 * });
 * // => 'hi-diddly-ho there [...]'
 * ```
 */
export function truncate(string: string, options: TruncateOptions = {}): string {
  if (!string) {
    return '';
  }

  const { length = 30, omission = '...', separator } = options;

  if (string.length <= length) {
    return string;
  }

  const end = Math.max(0, length - omission.length);
  let result = string.slice(0, end);

  if (separator !== undefined && !startsWithSeparator(string.slice(end), separator)) {
    const separatorIndex = lastSeparatorIndex(result, separator);

    if (separatorIndex >= 0) {
      result = result.slice(0, separatorIndex);
    }
  }

  return result + omission;
}

function startsWithSeparator(string: string, separator: string | RegExp): boolean {
  if (typeof separator === 'string') {
    return string.startsWith(separator);
  }

  return string.search(separator) === 0;
}

/**
 * Finds the start index of the last separator match in `string`, or -1.
 */
function lastSeparatorIndex(string: string, separator: string | RegExp): number {
  if (typeof separator === 'string') {
    return string.lastIndexOf(separator);
  }

  const regex = separator.global ? separator : new RegExp(separator.source, separator.flags + 'g');
  regex.lastIndex = 0;

  let lastIndex = -1;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(string)) !== null) {
    lastIndex = match.index;

    // Avoid an infinite loop on zero-length matches
    if (match[0].length === 0) {
      regex.lastIndex++;
    }
  }

  regex.lastIndex = 0;
  return lastIndex;
}
