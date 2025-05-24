/**
 * Type checking functions with improved TypeScript support
 */

/**
 * Checks if value is null or undefined
 */
export const isNil = (value: unknown): value is null | undefined => 
  value === null || value === undefined;

/**
 * Checks if value is undefined
 */
export const isUndefined = (value: unknown): value is undefined => 
  value === undefined;

/**
 * Checks if value is null
 */
export const isNull = (value: unknown): value is null => 
  value === null;

/**
 * Checks if value is a number
 * Unlike Lodash, this correctly returns false for NaN
 */
export const isNumber = (value: unknown): value is number => 
  typeof value === 'number' && !Number.isNaN(value);

/**
 * Checks if value is a string
 */
export const isString = (value: unknown): value is string => 
  typeof value === 'string';

/**
 * Checks if value is a boolean
 */
export const isBoolean = (value: unknown): value is boolean => 
  typeof value === 'boolean';

/**
 * Checks if value is a function
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export const isFunction = (value: unknown): value is Function => 
  typeof value === 'function';

/**
 * Checks if value is an array
 */
export const isArray = Array.isArray;

/**
 * Checks if value is an object (excluding null)
 * This is different from Lodash as it doesn't consider arrays as objects
 */
export const isObject = (value: unknown): value is Record<string, any> => 
  value !== null && typeof value === 'object' && !isArray(value);

/**
 * Checks if value is a plain object (created by Object constructor or object literal)
 */
export const isPlainObject = (value: unknown): value is Record<string, any> => {
  if (value === null || typeof value !== 'object') return false;
  
  const proto = Object.getPrototypeOf(value);
  return proto === null || proto === Object.prototype;
};

/**
 * Checks if value is a Date object
 */
export const isDate = (value: unknown): value is Date => 
  value instanceof Date;

/**
 * Checks if value is a RegExp object
 */
export const isRegExp = (value: unknown): value is RegExp => 
  value instanceof RegExp;

/**
 * Checks if value is a valid finite number
 */
export const isFinite = (value: unknown): value is number => 
  isNumber(value) && Number.isFinite(value);

/**
 * Checks if value is an integer
 */
export const isInteger = (value: unknown): value is number => 
  isNumber(value) && Number.isInteger(value);

/**
 * Checks if value is NaN
 */
export const isNaN = (value: unknown): boolean => 
  Number.isNaN(value);

/**
 * Checks if value is empty
 * Works with strings, arrays, objects, maps, sets
 */
export const isEmpty = (value: unknown): boolean => {
  if (isNil(value)) return true;
  if (isString(value) || isArray(value)) return value.length === 0;
  if (value instanceof Map || value instanceof Set) return value.size === 0;
  if (isObject(value)) return Object.keys(value).length === 0;
  return false;
};

/**
 * Checks if two values are equal (deep comparison)
 */
export const isEqual = (value: unknown, other: unknown): boolean => {
  // Same reference or both NaN
  if (value === other || (isNaN(value as any) && isNaN(other as any))) return true;
  
  // Different types or null/undefined
  if (isNil(value) || isNil(other) || typeof value !== typeof other) return false;
  
  // Compare arrays
  if (isArray(value) && isArray(other)) {
    if (value.length !== other.length) return false;
    return value.every((item, i) => isEqual(item, other[i]));
  }
  
  // Compare dates
  if (isDate(value) && isDate(other)) {
    return value.getTime() === other.getTime();
  }
  
  // Compare regexps
  if (isRegExp(value) && isRegExp(other)) {
    return value.toString() === other.toString();
  }
  
  // Compare objects
  if (isObject(value) && isObject(other)) {
    const valueKeys = Object.keys(value);
    const otherKeys = Object.keys(other);
    
    if (valueKeys.length !== otherKeys.length) return false;
    
    return valueKeys.every(key => {
      return Object.prototype.hasOwnProperty.call(other, key) && 
        isEqual(value[key], other[key]);
    });
  }
  
  return false;
};