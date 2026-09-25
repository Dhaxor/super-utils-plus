/**
 * Fills elements of array with value from start up to, but not including, end.
 *
 * @param array - The array to fill
 * @param value - The value to fill array with
 * @param start - The start position
 * @param end - The end position
 * @returns The filled array
 *
 * @example
 * ```ts
 * fill([1, 2, 3], 'a');
 * // => ['a', 'a', 'a']
 *
 * fill(Array(3), 2);
 * // => [2, 2, 2]
 *
 * fill([4, 6, 8, 10], '*', 1, 3);
 * // => [4, '*', '*', 10]
 * ```
 */
export function fill<T, U>(array: T[], value: U, start = 0, end?: number): Array<T | U> {
  if (!array || !array.length) {
    return [];
  }

  // Create a shallow copy to avoid modifying the original array
  const result = [...array];

  // Use native Array.fill
  result.fill(value as any, start, end);

  return result;
}
