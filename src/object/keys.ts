/**
 * Creates an array of the own enumerable property names of object.
 * 
 * @param object - The object to query
 * @returns The array of property names
 * 
 * @example
 * ```ts
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 * 
 * Foo.prototype.c = 3;
 * 
 * keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 * 
 * keys('hi');
 * // => ['0', '1']
 * ```
 */
export function keys<T extends object>(object: T): Array<string & keyof T> {
	if (!object) {
	  return [];
	}
	
	return Object.keys(object) as Array<string & keyof T>;
  }
  
  /**
   * Creates an array of the own and inherited enumerable property names of object.
   * 
   * @param object - The object to query
   * @returns The array of property names
   * 
   * @example
   * ```ts
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   * 
   * Foo.prototype.c = 3;
   * 
   * keysIn(new Foo);
   * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
   * ```
   */
  export function keysIn<T extends object>(object: T): string[] {
	if (!object) {
	  return [];
	}
	
	const result: string[] = [];
	
	for (const key in object) {
	  result.push(key);
	}
	
	return result;
  }
  
  /**
   * Creates an array of the own enumerable string keyed property values of object.
   * 
   * @param object - The object to query
   * @returns The array of property values
   * 
   * @example
   * ```ts
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   * 
   * Foo.prototype.c = 3;
   * 
   * values(new Foo);
   * // => [1, 2] (iteration order is not guaranteed)
   * 
   * values('hi');
   * // => ['h', 'i']
   * ```
   */
  export function values<T extends object>(object: T): Array<T[keyof T]> {
	if (!object) {
	  return [];
	}
	
	return Object.values(object);
  }
  
  /**
   * Creates an array of the own and inherited enumerable string keyed property
   * values of object.
   * 
   * @param object - The object to query
   * @returns The array of property values
   * 
   * @example
   * ```ts
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   * 
   * Foo.prototype.c = 3;
   * 
   * valuesIn(new Foo);
   * // => [1, 2, 3] (iteration order is not guaranteed)
   * ```
   */
  export function valuesIn<T extends object>(object: T): any[] {
	if (!object) {
	  return [];
	}
	
	const result: any[] = [];
	
	for (const key in object) {
	  result.push((object as any)[key]);
	}
	
	return result;
  }
  
  /**
   * Creates an array of own enumerable string keyed-value pairs for object.
   * 
   * @param object - The object to query
   * @returns The key-value pairs
   * 
   * @example
   * ```ts
   * toPairs({ 'a': 1, 'b': 2 });
   * // => [['a', 1], ['b', 2]]
   * ```
   */
  export function toPairs<T extends object>(object: T): Array<[string, any]> {
	if (!object) {
	  return [];
	}
	
	return Object.entries(object);
  }
  
  /**
   * Creates an array of own and inherited enumerable string keyed-value pairs
   * for object.
   * 
   * @param object - The object to query
   * @returns The key-value pairs
   * 
   * @example
   * ```ts
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   * 
   * Foo.prototype.c = 3;
   * 
   * toPairsIn(new Foo);
   * // => [['a', 1], ['b', 2], ['c', 3]] (iteration order is not guaranteed)
   * ```
   */
  export function toPairsIn<T extends object>(object: T): Array<[string, any]> {
	if (!object) {
	  return [];
	}
	
	const result: Array<[string, any]> = [];
	
	for (const key in object) {
	  result.push([key, (object as any)[key]]);
	}
	
	return result;
  }
  
  // Aliases
  export const entries = toPairs;
  export const entriesIn = toPairsIn;