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
export const isUndefined = (value: unknown): value is undefined => value === undefined;

/**
 * Checks if value is null
 */
export const isNull = (value: unknown): value is null => value === null;

/**
 * Checks if value is a number
 * Unlike Lodash, this correctly returns false for NaN
 */
export const isNumber = (value: unknown): value is number =>
  typeof value === 'number' && !Number.isNaN(value);

/**
 * Checks if value is a string
 */
export const isString = (value: unknown): value is string => typeof value === 'string';

/**
 * Checks if value is a boolean
 */
export const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';

/**
 * Checks if value is a function
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export const isFunction = (value: unknown): value is Function => typeof value === 'function';

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
export const isDate = (value: unknown): value is Date => value instanceof Date;

/**
 * Checks if value is a RegExp object
 */
export const isRegExp = (value: unknown): value is RegExp => value instanceof RegExp;

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
export const isNaN = (value: unknown): boolean => Number.isNaN(value);

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
 * Checks if two values are deeply equal.
 *
 * Supports primitives (NaN equals NaN), arrays, plain objects and class instances
 * (own enumerable string keys), `Date`, `RegExp`, `Map`, `Set`, typed arrays,
 * and circular references.
 */
export const isEqual = (value: unknown, other: unknown): boolean =>
  baseIsEqual(value, other, new Map());

/**
 * The pairs currently being compared on the recursion path, keyed by the left value.
 * A value can be under comparison against several right values at once (for example
 * when two different cycles are compared), so each key holds a set of partners.
 */
type ActivePairs = Map<object, Set<object>>;

const isActivePair = (stack: ActivePairs, value: object, other: object): boolean =>
  stack.get(value)?.has(other) ?? false;

const enterPair = (stack: ActivePairs, value: object, other: object): void => {
  const partners = stack.get(value);
  if (partners) {
    partners.add(other);
  } else {
    stack.set(value, new Set([other]));
  }
};

const leavePair = (stack: ActivePairs, value: object, other: object): void => {
  const partners = stack.get(value);
  if (partners) {
    partners.delete(other);
    if (partners.size === 0) stack.delete(value);
  }
};

const baseIsEqual = (value: unknown, other: unknown, stack: ActivePairs): boolean => {
  // Same reference or both NaN
  if (value === other || (isNaN(value) && isNaN(other))) return true;

  // Different types or null/undefined
  if (isNil(value) || isNil(other) || typeof value !== typeof other) return false;

  if (typeof value !== 'object' || typeof other !== 'object') return false;

  const valueObject = value as object;
  const otherObject = other as object;

  // Circular references: a pair already under comparison is assumed equal here;
  // any real difference surfaces elsewhere on the path.
  if (isActivePair(stack, valueObject, otherObject)) return true;

  if (isDate(value) || isDate(other)) {
    return isDate(value) && isDate(other) && value.getTime() === other.getTime();
  }

  if (isRegExp(value) || isRegExp(other)) {
    return isRegExp(value) && isRegExp(other) && value.toString() === other.toString();
  }

  if (ArrayBuffer.isView(value) || ArrayBuffer.isView(other)) {
    return ArrayBuffer.isView(value) && ArrayBuffer.isView(other) && viewsAreEqual(value, other);
  }

  enterPair(stack, valueObject, otherObject);
  try {
    if (isArray(value) || isArray(other)) {
      return (
        isArray(value) &&
        isArray(other) &&
        value.length === other.length &&
        value.every((item, i) => baseIsEqual(item, other[i], stack))
      );
    }

    if (value instanceof Map || other instanceof Map) {
      return (
        value instanceof Map &&
        other instanceof Map &&
        value.size === other.size &&
        mapsAreEqual(value, other, stack)
      );
    }

    if (value instanceof Set || other instanceof Set) {
      return (
        value instanceof Set &&
        other instanceof Set &&
        value.size === other.size &&
        setsAreEqual(value, other, stack)
      );
    }

    // Plain objects and class instances: compare own enumerable string keys
    const valueKeys = Object.keys(value);
    if (valueKeys.length !== Object.keys(other).length) return false;

    return valueKeys.every(
      key =>
        Object.prototype.hasOwnProperty.call(other, key) &&
        baseIsEqual(
          (value as Record<string, unknown>)[key],
          (other as Record<string, unknown>)[key],
          stack
        )
    );
  } finally {
    leavePair(stack, valueObject, otherObject);
  }
};

const viewsAreEqual = (value: ArrayBufferView, other: ArrayBufferView): boolean => {
  if (
    Object.getPrototypeOf(value) !== Object.getPrototypeOf(other) ||
    value.byteLength !== other.byteLength
  ) {
    return false;
  }
  const a = new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
  const b = new Uint8Array(other.buffer, other.byteOffset, other.byteLength);
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

/**
 * A cheap structural signature: two deeply equal values always share a signature,
 * so candidates for a deep match only need to be searched within one bucket.
 */
const signatureOf = (value: object): string => {
  if (isArray(value)) return `A${value.length}`;
  if (isDate(value)) return `D${value.getTime()}`;
  if (isRegExp(value)) return `R${value.toString()}`;
  if (value instanceof Map) return `M${value.size}`;
  if (value instanceof Set) return `S${value.size}`;
  if (ArrayBuffer.isView(value)) return `V${value.byteLength}`;

  const parts: string[] = [];
  for (const key of Object.keys(value).sort()) {
    const entry = (value as Record<string, unknown>)[key];
    parts.push(
      entry !== null && typeof entry === 'object'
        ? `${key}:*`
        : `${key}:${typeof entry}:${String(entry)}`
    );
  }
  return `O${parts.join('\u0000')}`;
};

/** Groups object members by signature, preserving insertion order within a bucket. */
const bucketize = <T extends object>(members: Iterable<T>): Map<string, T[]> => {
  const buckets = new Map<string, T[]>();
  for (const member of members) {
    const signature = signatureOf(member);
    const bucket = buckets.get(signature);
    if (bucket) {
      bucket.push(member);
    } else {
      buckets.set(signature, [member]);
    }
  }
  return buckets;
};

/** Removes and returns the first bucket member satisfying `matches`, or null. */
const takeDeepMatch = (
  buckets: Map<string, object[]>,
  entry: object,
  matches: (candidate: object) => boolean
): object | null => {
  const bucket = buckets.get(signatureOf(entry));
  if (!bucket) return null;
  const index = bucket.findIndex(matches);
  if (index === -1) return null;
  return bucket.splice(index, 1)[0];
};

const isObjectLike = (value: unknown): value is object =>
  value !== null && typeof value === 'object';

/**
 * Compares two same-sized Sets as multisets: every member of `value` must match a
 * distinct member of `other`, by SameValueZero first and deep equality otherwise.
 */
const setsAreEqual = (value: Set<unknown>, other: Set<unknown>, stack: ActivePairs): boolean => {
  const unmatched = new Set(other);
  let buckets: Map<string, object[]> | undefined;

  for (const entry of value) {
    if (unmatched.has(entry)) {
      unmatched.delete(entry);
      if (buckets && isObjectLike(entry)) {
        takeDeepMatch(buckets, entry, candidate => candidate === entry);
      }
      continue;
    }

    if (!isObjectLike(entry)) return false;

    // Lazily index the remaining object members of `other` by signature
    buckets ??= bucketize([...unmatched].filter(isObjectLike));
    const matched = takeDeepMatch(buckets, entry, candidate =>
      baseIsEqual(entry, candidate, stack)
    );
    if (matched === null) return false;
    unmatched.delete(matched);
  }

  return true;
};

/**
 * Compares two same-sized Maps as multisets of entries: every entry of `value` must
 * match a distinct entry of `other`, comparing keys by SameValueZero first and deep
 * equality otherwise, and values deeply.
 */
const mapsAreEqual = (
  value: Map<unknown, unknown>,
  other: Map<unknown, unknown>,
  stack: ActivePairs
): boolean => {
  const unmatched = new Map(other);
  let buckets: Map<string, object[]> | undefined;

  for (const [key, entry] of value) {
    if (unmatched.has(key) && baseIsEqual(entry, unmatched.get(key), stack)) {
      unmatched.delete(key);
      if (buckets && isObjectLike(key)) {
        takeDeepMatch(buckets, key, candidate => candidate === key);
      }
      continue;
    }

    if (!isObjectLike(key)) return false;

    // Lazily index the remaining object keys of `other` by signature
    buckets ??= bucketize([...unmatched.keys()].filter(isObjectLike));
    const matched = takeDeepMatch(
      buckets,
      key,
      candidate =>
        baseIsEqual(key, candidate, stack) && baseIsEqual(entry, unmatched.get(candidate), stack)
    );
    if (matched === null) return false;
    unmatched.delete(matched);
  }

  return true;
};
