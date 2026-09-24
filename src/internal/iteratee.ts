import { isArray, isNil, isObject } from '../utils/is.js';
import { PredicateShorthand, ValueIteratee } from '../utils/types.js';

/**
 * Normalizes the predicate shorthands accepted by `find`, `filter`, and friends
 * into a plain predicate function.
 *
 * - function: used as-is
 * - `[property, value]`: matches items whose property strictly equals value
 * - object: matches items whose listed properties all strictly equal the given values
 * - string: matches items whose property is truthy
 *
 * @internal
 */
export function toPredicate<T>(
  predicate: PredicateShorthand<T>
): (value: T, index: number, collection: T[]) => boolean {
  if (typeof predicate === 'function') {
    return predicate as (value: T, index: number, collection: T[]) => boolean;
  }

  if (isArray(predicate) && predicate.length === 2) {
    const [property, expected] = predicate;
    return (item: T) => isObject(item) && item[property] === expected;
  }

  if (isObject(predicate)) {
    const entries = Object.entries(predicate);
    return (item: T) =>
      isObject(item) && entries.every(([key, expected]) => item[key] === expected);
  }

  if (typeof predicate === 'string') {
    return (item: T) => isObject(item) && Boolean(item[predicate]);
  }

  return (item: T) => Boolean(item);
}

/**
 * Normalizes a "value iteratee" (a function or a property name) into a function.
 *
 * @internal
 */
export function toValueIteratee<T, K>(iteratee: ValueIteratee<T, K>): (value: T) => K {
  if (typeof iteratee === 'function') {
    return iteratee;
  }

  return (value: T) =>
    isNil(value) ? (undefined as unknown as K) : (value[iteratee] as unknown as K);
}

/**
 * Normalizes a property-name shorthand for `map`-style iteratees. Unlike
 * `toValueIteratee`, the resulting function receives the full `(value, index, collection)`
 * arguments so it can wrap user callbacks unchanged.
 *
 * @internal
 */
export function toPropertyIteratee<T, R>(
  iteratee: ((value: T, index: number, collection: T[]) => R) | string
): (value: T, index: number, collection: T[]) => R {
  if (typeof iteratee === 'function') {
    return iteratee;
  }

  return (value: T) =>
    isNil(value) ? (undefined as unknown as R) : ((value as any)[iteratee] as R);
}
