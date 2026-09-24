/**
 * Generates a random floating-point number between min (inclusive) and max (exclusive).
 *
 * @param min - The lower bound (inclusive)
 * @param max - The upper bound (exclusive)
 * @returns A random number in the range [min, max)
 *
 * @example
 * ```ts
 * random(1, 10);
 * // => 4.237...
 * ```
 */
export function random(min = 0, max = 1): number {
  return Math.random() * (max - min) + min;
}

/**
 * Generates a random integer between min and max (inclusive).
 *
 * @param min - The minimum value
 * @param max - The maximum value
 * @returns A random integer between min and max
 *
 * @example
 * ```ts
 * randomInt(1, 10);
 * // => an integer between 1 and 10
 * ```
 */
export function randomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a random string of the specified length.
 *
 * @param length - The length of the string
 * @param charset - The characters to use (defaults to alphanumeric)
 * @returns A random string
 *
 * @example
 * ```ts
 * randomString(10);
 * // => "a1b2c3d4e5"
 *
 * randomString(5, 'ABC');
 * // => "BACAB"
 * ```
 */
export function randomString(
  length: number,
  charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}

/**
 * Generates a random UUID v4.
 *
 * @returns A random UUID v4 string
 *
 * @example
 * ```ts
 * randomUUID();
 * // => "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed"
 * ```
 */
export function randomUUID(): string {
  // Use the built-in crypto.randomUUID if available (Node.js 16+)
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  // Otherwise, implement a simple UUID v4 generator
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
