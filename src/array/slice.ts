/**
 * Creates a slice of array from start up to, but not including, end.
 *
 * @param array - The array to slice
 * @param start - The start position
 * @param end - The end position
 * @returns The slice of array
 *
 * @example
 * ```ts
 * const arr = [1, 2, 3, 4];
 *
 * slice(arr, 1, 3);
 * // => [2, 3]
 * ```
 */
export function slice<T>(array: T[], start = 0, end?: number): T[] {
  if (!array || !array.length) {
    return [];
  }

  return array.slice(start, end);
}
