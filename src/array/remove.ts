/**
 * Removes all elements from array that predicate returns truthy for
 * and returns an array of the removed elements.
 * 
 * @param array - The array to modify
 * @param predicate - The function invoked per iteration
 * @returns Returns the new array of removed elements
 * 
 * @example
 * ```ts
 * const array = [1, 2, 3, 4];
 * const evens = remove(array, function(n) {
 *   return n % 2 === 0;
 * });
 * 
 * console.log(array);
 * // => [1, 3]
 * 
 * console.log(evens);
 * // => [2, 4]
 * ```
 */
export function remove<T>(
	array: T[],
	predicate: (value: T, index: number, array: T[]) => boolean
  ): T[] {
	if (!array || !array.length) {
	  return [];
	}
	
	// Create a copy to avoid mutating the original array
	const result: T[] = [];
	const length = array.length;
	
	// Use for loop with downward iteration to safely remove elements
	for (let i = length - 1; i >= 0; i--) {
	  const value = array[i];
	  if (predicate(value, i, array)) {
		result.unshift(value);
		array.splice(i, 1);
	  }
	}
	
	return result;
  }