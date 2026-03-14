import { isObject } from '../utils/is';

/**
 * Checks if path is a direct property of object.
 * 
 * @param object - The object to query
 * @param key - The key to check
 * @returns Whether the property exists
 * 
 * @example
 * ```ts
 * const object = { 'a': { 'b': 2 } };
 * 
 * has(object, 'a');
 * // => true
 * 
 * has(object, 'a.b');
 * // => false
 * ```
 */
export function has<T extends object>(
  object: T,
  key: string | number | symbol
): boolean {
  if (!isObject(object)) {
    return false;
  }
  
  return Object.prototype.hasOwnProperty.call(object, key);
}

/**
 * Checks if path is a direct or inherited property of object.
 * 
 * @param object - The object to query
 * @param key - The key to check
 * @returns Whether the property exists
 * 
 * @example
 * ```ts
 * function Foo() {
 *   this.a = 1;
 * }
 * 
 * Foo.prototype.b = 2;
 * 
 * hasIn(new Foo, 'a');
 * // => true
 * 
 * hasIn(new Foo, 'b');
 * // => true
 * ```
 */
export function hasIn<T extends object>(
  object: T,
  key: string | number | symbol
): boolean {
  if (!isObject(object)) {
    return false;
  }
  
  return key in object;
}

/**
 * Checks if path is a direct property of object.
 * Uses dot notation for nested properties.
 * 
 * @param object - The object to query
 * @param path - The path to check
 * @returns Whether the path exists
 * 
 * @example
 * ```ts
 * const object = { 'a': { 'b': 2 } };
 * 
 * hasPath(object, 'a.b');
 * // => true
 * 
 * hasPath(object, ['a', 'b']);
 * // => true
 * ```
 */
export function hasPath<T extends object>(
  object: T,
  path: string | Array<string | number | symbol>
): boolean {
  if (!isObject(object)) {
    return false;
  }
  
  const segments = typeof path === 'string' 
    ? path.split('.') 
    : path;
  
  if (!segments.length) {
    return false;
  }
  
  let current: any = object;
  
  for (let i = 0; i < segments.length; i++) {
    const key = segments[i];
    
    if (!isObject(current) || !Object.prototype.hasOwnProperty.call(current, key)) {
      return false;
    }
    
    current = current[key as keyof typeof current];
  }
  
  return true;
}

/**
 * Checks if path is a direct or inherited property of object.
 * Uses dot notation for nested properties.
 * 
 * @param object - The object to query
 * @param path - The path to check
 * @returns Whether the path exists
 * 
 * @example
 * ```ts
 * const object = { 'a': { 'b': 2 } };
 * 
 * hasInPath(object, 'a.b');
 * // => true
 * 
 * hasInPath(object, ['a', 'b']);
 * // => true
 * ```
 */
export function hasInPath<T extends object>(
  object: T,
  path: string | Array<string | number | symbol>
): boolean {
  if (!isObject(object)) {
    return false;
  }
  
  const segments = typeof path === 'string' 
    ? path.split('.') 
    : path;
  
  if (!segments.length) {
    return false;
  }
  
  let current: any = object;
  
  for (let i = 0; i < segments.length - 1; i++) {
    const key = segments[i];
    
    if (!isObject(current) || !(key in current)) {
      return false;
    }
    
    current = current[key as keyof typeof current];
  }
  
  return segments[segments.length - 1] in current;
}