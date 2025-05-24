/**
 * Creates an array of elements split into groups the length of size.
 * If array can't be split evenly, the final chunk will be the remaining elements.
 * 
 * @param array - The array to process
 * @param size - The length of each chunk
 * @returns The new array of chunks
 * 
 * @example
 * ```ts
 * chunk([1, 2, 3, 4], 2);
 * // => [[1, 2], [3, 4]]
 * 
 * chunk([1, 2, 3, 4, 5], 2);
 * // => [[1, 2], [3, 4], [5]]
 * ```
 */
export function chunk<T>(array: T[], size = 1): T[][] {
  if (!array || !array.length) {
    return [];
  }
  
  // Ensure size is at least 1
  const chunkSize = Math.max(Math.floor(size), 1);
  const result: T[][] = [];
  
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  
  return result;
}