import { isArray, isFunction, isNil, isString } from '../utils/is.js';
import { PropertyPath } from '../utils/types.js';

/**
 * Resolves the value at path of object. If the resolved value is a function
 * it's invoked with the `this` binding of its parent object.
 *
 * @param object - The object to query
 * @param path - The path of the property to resolve
 * @param defaultValue - The value returned for undefined resolved values
 * @returns The resolved value
 */
export function result<T = any>(object: any, path: PropertyPath, defaultValue?: T): T | undefined {
  if (isNil(object)) {
    return resolveDefaultValue(defaultValue, undefined);
  }

  const segments = normalizePath(path);

  if (!segments.length) {
    return object;
  }

  let current = object;
  let parent: any = object;

  for (const segment of segments) {
    if (isNil(current)) {
      return resolveDefaultValue(defaultValue, parent);
    }

    parent = current;
    current = current[segment];
  }

  if (current === undefined) {
    return resolveDefaultValue(defaultValue, parent);
  }

  return isFunction(current) ? current.call(parent) : current;
}

function normalizePath(path: PropertyPath): Array<string | number | symbol> {
  if (isString(path)) {
    return parsePath(path);
  }

  if (isArray(path)) {
    return path as Array<string | number | symbol>;
  }

  return [path as string | number | symbol];
}

function resolveDefaultValue<T>(value: T, thisArg: any): T {
  return isFunction(value) ? value.call(thisArg) : value;
}

function parsePath(path: string): Array<string | number> {
  const segments: Array<string | number> = [];
  let currentSegment = '';
  let inBrackets = false;

  for (let index = 0; index < path.length; index++) {
    const character = path[index];

    if (character === '[') {
      if (currentSegment) {
        segments.push(currentSegment);
        currentSegment = '';
      }
      inBrackets = true;
    } else if (character === ']') {
      if (/^\d+$/.test(currentSegment)) {
        segments.push(parseInt(currentSegment, 10));
      } else {
        segments.push(currentSegment);
      }
      currentSegment = '';
      inBrackets = false;
    } else if (character === '.' && !inBrackets) {
      if (currentSegment) {
        segments.push(currentSegment);
        currentSegment = '';
      }
    } else {
      currentSegment += character;
    }
  }

  if (currentSegment) {
    segments.push(currentSegment);
  }

  return segments;
}
