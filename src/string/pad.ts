/**
 * Pads a string on both sides if it's shorter than the given length.
 *
 * @param string - The string to pad
 * @param length - The target length
 * @param chars - The padding characters
 * @returns The padded string
 */
export function pad(string: string, length = 0, chars = ' '): string {
  if (string.length >= length) {
    return string;
  }

  const totalPadding = length - string.length;
  const leftPadding = Math.floor(totalPadding / 2);
  const rightPadding = totalPadding - leftPadding;

  return createPadding(leftPadding, chars) + string + createPadding(rightPadding, chars);
}

/**
 * Pads a string on the left if it's shorter than the given length.
 *
 * @param string - The string to pad
 * @param length - The target length
 * @param chars - The padding characters
 * @returns The padded string
 */
export function padStart(string: string, length = 0, chars = ' '): string {
  if (string.length >= length) {
    return string;
  }

  return createPadding(length - string.length, chars) + string;
}

/**
 * Pads a string on the right if it's shorter than the given length.
 *
 * @param string - The string to pad
 * @param length - The target length
 * @param chars - The padding characters
 * @returns The padded string
 */
export function padEnd(string: string, length = 0, chars = ' '): string {
  if (string.length >= length) {
    return string;
  }

  return string + createPadding(length - string.length, chars);
}

function createPadding(length: number, chars: string): string {
  if (length <= 0 || chars.length === 0) {
    return '';
  }

  const repeatCount = Math.ceil(length / chars.length);
  return chars.repeat(repeatCount).slice(0, length);
}
