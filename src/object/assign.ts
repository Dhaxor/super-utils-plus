import { isObject } from '../utils/is';

/**
 * Assigns own enumerable string keyed properties of source objects to the
 * destination object. Source objects are applied from left to right.
 * Subsequent sources overwrite property assignments of previous sources.
 * 
 * @param object - The destination object
 * @param sources - The source objects
 * @returns The destination object
 * 
 * @example
 * ```ts
 * const object = { 'a': 1 };
 * 
 * assign(object, { 'b': 2 }, { 'c': 3 });
 * // => { 'a': 1, 'b': 2, 'c': 3 }
 * ```
 */
export function assign<T extends object, U extends object>(
  object: T,
  ...sources: U[]
): T & U {
  if (!sources.length) {
    return object as T & U;
  }
  
  // Use native Object.assign
  return Object.assign(object, ...sources);
}

/**
 * This method is like assign except that it iterates over own and
 * inherited source properties.
 * 
 * @param object - The destination object
 * @param sources - The source objects
 * @returns The destination object
 * 
 * @example
 * ```ts
 * function Foo() {
 *   this.a = 1;
 * }
 * 
 * Foo.prototype.b = 2;
 * 
 * assignIn({ 'c': 3 }, new Foo);
 * // => { 'a': 1, 'b': 2, 'c': 3 }
 * ```
 */
export function assignIn<T extends object, U extends object>(
  object: T,
  ...sources: U[]
): T & U {
  if (!sources.length) {
    return object as T & U;
  }
  
  const result = { ...object };
  
  for (const source of sources) {
    // Include inherited properties
    for (const key in source) {
      (result as any)[key] = (source as any)[key];
    }
  }
  
  return result as T & U;
}

/**
 * This method is like assign except that it accepts customizer which
 * is invoked to produce the assigned values. If customizer returns undefined,
 * assignment is handled by the method instead. The customizer is invoked
 * with five arguments: (objValue, srcValue, key, object, source).
 * 
 * @param object - The destination object
 * @param sources - The source objects
 * @param customizer - The function to customize assigned values
 * @returns The destination object
 * 
 * @example
 * ```ts
 * function customizer(objValue, srcValue) {
 *   return _.isUndefined(objValue) ? srcValue : objValue;
 * }
 * 
 * const defaults = _.partialRight(_.assignWith, customizer);
 * 
 * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
 * // => { 'a': 1, 'b': 2 }
 * ```
 */
export function assignWith<T extends object, U extends object>(
  object: T,
  source: U,
  customizer: (
    objValue: any,
    srcValue: any,
    key: string,
    object: T,
    source: U
  ) => any
): T & U {
  if (!isObject(object) || !isObject(source)) {
    return object as T & U;
  }
  
  const result = { ...object };
  
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const objValue = (object as any)[key];
      const srcValue = (source as any)[key];
      const newValue = customizer(objValue, srcValue, key, object, source);
      
      if (newValue !== undefined) {
        (result as any)[key] = newValue;
      } else {
        (result as any)[key] = srcValue;
      }
    }
  }
  
  return result as T & U;
}

/**
 * This method is like assignIn except that it accepts customizer which
 * is invoked to produce the assigned values. If customizer returns undefined,
 * assignment is handled by the method instead. The customizer is invoked
 * with five arguments: (objValue, srcValue, key, object, source).
 * 
 * @param object - The destination object
 * @param sources - The source objects
 * @param customizer - The function to customize assigned values
 * @returns The destination object
 * 
 * @example
 * ```ts
 * function customizer(objValue, srcValue) {
 *   return _.isUndefined(objValue) ? srcValue : objValue;
 * }
 * 
 * const defaults = _.partialRight(_.assignInWith, customizer);
 * 
 * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
 * // => { 'a': 1, 'b': 2 }
 * ```
 */
export function assignInWith<T extends object, U extends object>(
  object: T,
  source: U,
  customizer: (
    objValue: any,
    srcValue: any,
    key: string,
    object: T,
    source: U
  ) => any
): T & U {
  if (!isObject(object) || !isObject(source)) {
    return object as T & U;
  }
  
  const result = { ...object };
  
  for (const key in source) {
    const objValue = (object as any)[key];
    const srcValue = (source as any)[key];
    const newValue = customizer(objValue, srcValue, key, object, source);
    
    if (newValue !== undefined) {
      (result as any)[key] = newValue;
    } else {
      (result as any)[key] = srcValue;
    }
  }
  
  return result as T & U;
}

// Aliases
export const extend = assignIn;
export const extendWith = assignInWith;