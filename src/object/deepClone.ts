import { isArray, isDate, isRegExp } from '../utils/is.js';
import { assignOwnKey } from '../internal/path.js';

/**
 * Creates a deep clone of value.
 *
 * Handles primitives, arrays, plain objects, class instances (the prototype is
 * preserved), `Date`, `RegExp`, `Map`, `Set`, `ArrayBuffer`, typed arrays, and
 * circular references. Functions are returned by reference. Enumerable own string
 * and symbol keys are copied.
 *
 * @param value - The value to clone
 * @returns The deep cloned value
 *
 * @example
 * ```ts
 * const objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * const deep = deepClone(objects);
 * console.log(deep[0] === objects[0]);
 * // => false
 * ```
 */
export function deepClone<T>(value: T): T {
  return cloneValue(value, new WeakMap());
}

function cloneValue<T>(value: T, seen: WeakMap<object, unknown>): T {
  // Primitives and functions are returned as-is
  if (value === null || typeof value !== 'object') {
    return value;
  }

  const source = value as unknown as object;
  const existing = seen.get(source);
  if (existing !== undefined) {
    return existing as T;
  }

  if (isDate(value)) {
    return new Date(value.getTime()) as unknown as T;
  }

  if (isRegExp(value)) {
    const result = new RegExp(value.source, value.flags);
    result.lastIndex = value.lastIndex;
    return result as unknown as T;
  }

  if (value instanceof ArrayBuffer) {
    return value.slice(0) as unknown as T;
  }

  // Node.js Buffer: Buffer.slice() shares memory and `new Buffer()` is deprecated
  const BufferCtor = (globalThis as any).Buffer;
  if (BufferCtor && BufferCtor.isBuffer(value)) {
    return BufferCtor.from(value) as T;
  }

  if (ArrayBuffer.isView(value)) {
    // DataView and every typed array
    const view = value as unknown as ArrayBufferView;
    const buffer = view.buffer.slice(view.byteOffset, view.byteOffset + view.byteLength);
    const Ctor = view.constructor as new (buffer: ArrayBufferLike) => ArrayBufferView;
    return new Ctor(buffer) as unknown as T;
  }

  if (value instanceof Map) {
    const result = new Map();
    seen.set(source, result);
    value.forEach((entryValue, key) => {
      result.set(cloneValue(key, seen), cloneValue(entryValue, seen));
    });
    return result as unknown as T;
  }

  if (value instanceof Set) {
    const result = new Set();
    seen.set(source, result);
    value.forEach(entry => {
      result.add(cloneValue(entry, seen));
    });
    return result as unknown as T;
  }

  if (isArray(value)) {
    const result: unknown[] = [];
    seen.set(source, result);
    for (let i = 0; i < value.length; i++) {
      result[i] = cloneValue(value[i], seen);
    }
    return result as unknown as T;
  }

  // Plain objects and class instances: preserve the prototype
  const result = Object.create(Object.getPrototypeOf(source));
  seen.set(source, result);

  for (const key of Object.keys(source)) {
    // assignOwnKey keeps an own "__proto__" key an own key on the clone
    assignOwnKey(result, key, cloneValue((source as Record<string, unknown>)[key], seen));
  }

  for (const symbol of Object.getOwnPropertySymbols(source)) {
    if (Object.prototype.propertyIsEnumerable.call(source, symbol)) {
      result[symbol] = cloneValue((source as Record<symbol, unknown>)[symbol], seen);
    }
  }

  return result as T;
}
