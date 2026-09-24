import { isObject } from '../utils/is.js';

/**
 * Creates an object composed of the inverted keys and values of object.
 *
 * @param object - The object to invert
 * @returns The inverted object
 */
export function invert<T extends object>(object: T): Record<string, string> {
  if (!isObject(object)) {
    return {};
  }

  const result: Record<string, string> = {};

  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      result[String((object as any)[key])] = key;
    }
  }

  return result;
}

/**
 * This method is like `invert` except that the inverted object is generated
 * from the results of running each element of object through iteratee.
 *
 * @param object - The object to invert
 * @param iteratee - The iteratee invoked per element
 * @returns The grouped inverted object
 */
export function invertBy<T extends object>(
  object: T,
  iteratee: (value: T[keyof T]) => string = value => String(value)
): Record<string, string[]> {
  if (!isObject(object)) {
    return {};
  }

  const result: Record<string, string[]> = {};

  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      const invertedKey = iteratee((object as any)[key]);

      if (!result[invertedKey]) {
        result[invertedKey] = [];
      }

      result[invertedKey].push(key);
    }
  }

  return result;
}
