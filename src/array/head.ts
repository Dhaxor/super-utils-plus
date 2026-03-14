/**
 * Gets the first element of array.
 * 
 * @param array - The array to query
 * @returns The first element of array
 * 
 * @example
 * ```ts
 * head([1, 2, 3]);
 * // => 1
 * 
 * head([]);
 * // => undefined
 * ```
 */
export function head<T>(array: T[]): T | undefined {
	return array && array.length ? array[0] : undefined;
  }
  
  /**
   * Gets the last element of array.
   * 
   * @param array - The array to query
   * @returns The last element of array
   * 
   * @example
   * ```ts
   * last([1, 2, 3]);
   * // => 3
   * ```
   */
  export function last<T>(array: T[]): T | undefined {
	return array && array.length ? array[array.length - 1] : undefined;
  }
  
  /**
   * Gets all but the first element of array.
   * 
   * @param array - The array to query
   * @returns The slice of array
   * 
   * @example
   * ```ts
   * tail([1, 2, 3]);
   * // => [2, 3]
   * ```
   */
  export function tail<T>(array: T[]): T[] {
	return array && array.length ? array.slice(1) : [];
  }
  
  /**
   * Gets all but the last element of array.
   * 
   * @param array - The array to query
   * @returns The slice of array
   * 
   * @example
   * ```ts
   * initial([1, 2, 3]);
   * // => [1, 2]
   * ```
   */
  export function initial<T>(array: T[]): T[] {
	return array && array.length ? array.slice(0, -1) : [];
  }
  
  // Aliases
  export const first = head;