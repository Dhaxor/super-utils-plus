/**
 * Pads a string on both sides if it's shorter than the given length.
 *
 * @param string - The string to pad
 * @param length - The target length
 * @param chars - The padding characters
 * @returns The padded string
 */
export function pad(string: string, length = 0, chars = ' '): string {
  const value = string ?? '';

  if (value.length >= length) {
    return value;
  }

  const totalPadding = length - value.length;
  const leftPadding = Math.floor(totalPadding / 2);
  const rightPadding = totalPadding - leftPadding;

  return createPadding(leftPadding, chars) + value + createPadding(rightPadding, chars);
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
  const value = string ?? '';

  if (value.length >= length) {
    return value;
  }

  return createPadding(length - value.length, chars) + value;
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
  const value = string ?? '';

  if (value.length >= length) {
    return value;
  }

  return value + createPadding(length - value.length, chars);
}

function createPadding(length: number, chars: string): string {
  if (length <= 0 || chars.length === 0) {
    return '';
  }

  const repeatCount = Math.ceil(length / chars.length);
  return chars.repeat(repeatCount).slice(0, length);
}
