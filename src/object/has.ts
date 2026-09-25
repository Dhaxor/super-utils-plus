import { isNil } from '../utils/is.js';
import { PropertyPath } from '../utils/types.js';
import { toPath } from '../internal/path.js';

const hasOwn = (object: unknown, key: string | number | symbol): boolean =>
  !isNil(object) && Object.prototype.hasOwnProperty.call(object, key);

const hasInherited = (object: unknown, key: string | number | symbol): boolean =>
  !isNil(object) && key in Object(object);

/**
 * Checks if key is a direct (own) property of object.
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
export function has<T extends object>(object: T, key: string | number | symbol): boolean {
  return hasOwn(object, key);
}

/**
 * Checks if key is a direct or inherited property of object.
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
export function hasIn<T extends object>(object: T, key: string | number | symbol): boolean {
  return hasInherited(object, key);
}

/**
 * Checks if path is a direct (own) property path of object.
 * Supports dot and bracket notation as well as array paths.
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
export function hasPath<T extends object>(object: T, path: PropertyPath): boolean {
  return checkPath(object, path, hasOwn);
}

/**
 * Checks if path is a direct or inherited property path of object.
 * Supports dot and bracket notation as well as array paths.
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
export function hasInPath<T extends object>(object: T, path: PropertyPath): boolean {
  return checkPath(object, path, hasInherited);
}

function checkPath(
  object: unknown,
  path: PropertyPath,
  check: (object: unknown, key: string | number | symbol) => boolean
): boolean {
  if (isNil(object)) {
    return false;
  }

  const segments = toPath(path);

  if (!segments.length) {
    return false;
  }

  let current: any = object;

  for (const segment of segments) {
    if (!check(current, segment)) {
      return false;
    }

    current = current[segment];
  }

  return true;
}
