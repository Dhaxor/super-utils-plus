import {
  isUndefined,
  isNull,
  isString,
  isBoolean,
  isFunction,
  isArray,
  isObject,
  isPlainObject,
  isDate,
  isRegExp,
  isFinite,
  isInteger,
  isNaN,
  isEmpty,
  isEqual,
} from '../is.js';

class Point {
  constructor(
    public x: number,
    public y: number
  ) {}
}

describe('Type checking functions (extra)', () => {
  describe('isUndefined', () => {
    test('should identify undefined', () => {
      expect(isUndefined(undefined)).toBe(true);
      expect(isUndefined(void 0)).toBe(true);
    });

    test('should reject other values', () => {
      expect(isUndefined(null)).toBe(false);
      expect(isUndefined(0)).toBe(false);
      expect(isUndefined('')).toBe(false);
      expect(isUndefined(false)).toBe(false);
      expect(isUndefined(NaN)).toBe(false);
      expect(isUndefined({})).toBe(false);
    });
  });

  describe('isNull', () => {
    test('should identify null', () => {
      expect(isNull(null)).toBe(true);
    });

    test('should reject other values', () => {
      expect(isNull(undefined)).toBe(false);
      expect(isNull(0)).toBe(false);
      expect(isNull('')).toBe(false);
      expect(isNull(false)).toBe(false);
      expect(isNull({})).toBe(false);
    });
  });

  describe('isString', () => {
    test('should identify strings', () => {
      expect(isString('')).toBe(true);
      expect(isString('abc')).toBe(true);
      expect(isString(String(123))).toBe(true);
      expect(isString(`template`)).toBe(true);
    });

    test('should reject non-strings', () => {
      expect(isString(1)).toBe(false);
      expect(isString(['a'])).toBe(false);
      expect(isString({})).toBe(false);
      expect(isString(null)).toBe(false);
      expect(isString(undefined)).toBe(false);
      expect(isString(Symbol('a'))).toBe(false);
    });
  });

  describe('isBoolean', () => {
    test('should identify booleans', () => {
      expect(isBoolean(true)).toBe(true);
      expect(isBoolean(false)).toBe(true);
      expect(isBoolean(Boolean(0))).toBe(true);
    });

    test('should reject non-booleans', () => {
      expect(isBoolean(0)).toBe(false);
      expect(isBoolean(1)).toBe(false);
      expect(isBoolean('true')).toBe(false);
      expect(isBoolean(null)).toBe(false);
      expect(isBoolean(undefined)).toBe(false);
      expect(isBoolean({})).toBe(false);
    });
  });

  describe('isFunction', () => {
    test('should identify functions', () => {
      expect(isFunction(function () {})).toBe(true);
      expect(isFunction(() => {})).toBe(true);
      expect(isFunction(async () => {})).toBe(true);
      expect(isFunction(function* () {})).toBe(true);
      expect(isFunction(class {})).toBe(true);
      expect(isFunction(Math.max)).toBe(true);
    });

    test('should reject non-functions', () => {
      expect(isFunction({})).toBe(false);
      expect(isFunction([])).toBe(false);
      expect(isFunction('function')).toBe(false);
      expect(isFunction(null)).toBe(false);
      expect(isFunction(undefined)).toBe(false);
      expect(isFunction(/abc/)).toBe(false);
    });
  });

  describe('isArray', () => {
    test('should identify arrays', () => {
      expect(isArray([])).toBe(true);
      expect(isArray([1, 2, 3])).toBe(true);
      expect(isArray(new Array(3))).toBe(true);
      expect(isArray(Array.from('abc'))).toBe(true);
    });

    test('should reject non-arrays', () => {
      expect(isArray({ length: 0 })).toBe(false);
      expect(isArray('abc')).toBe(false);
      expect(isArray(new Uint8Array(2))).toBe(false);
      expect(isArray(new Set([1]))).toBe(false);
      expect(isArray(null)).toBe(false);
      expect(isArray(undefined)).toBe(false);
    });
  });

  describe('isObject', () => {
    test('should identify objects', () => {
      expect(isObject({})).toBe(true);
      expect(isObject({ a: 1 })).toBe(true);
      expect(isObject(new Point(1, 2))).toBe(true);
      expect(isObject(new Date())).toBe(true);
      expect(isObject(/abc/)).toBe(true);
      expect(isObject(new Map())).toBe(true);
      expect(isObject(Object.create(null))).toBe(true);
    });

    test('should not consider arrays as objects', () => {
      expect(isObject([])).toBe(false);
      expect(isObject([1, 2, 3])).toBe(false);
    });

    test('should not consider null as an object', () => {
      expect(isObject(null)).toBe(false);
    });

    test('should reject primitives and functions', () => {
      expect(isObject(undefined)).toBe(false);
      expect(isObject(1)).toBe(false);
      expect(isObject('abc')).toBe(false);
      expect(isObject(true)).toBe(false);
      expect(isObject(Symbol('a'))).toBe(false);
      expect(isObject(() => {})).toBe(false);
    });
  });

  describe('isPlainObject', () => {
    test('should identify object literals', () => {
      expect(isPlainObject({})).toBe(true);
      expect(isPlainObject({ a: 1 })).toBe(true);
      expect(isPlainObject(new Object())).toBe(true);
    });

    test('should identify objects with a null prototype', () => {
      expect(isPlainObject(Object.create(null))).toBe(true);
    });

    test('should reject class instances', () => {
      expect(isPlainObject(new Point(1, 2))).toBe(false);
      expect(isPlainObject(Object.create({}))).toBe(false);
    });

    test('should reject arrays', () => {
      expect(isPlainObject([])).toBe(false);
      expect(isPlainObject([1, 2])).toBe(false);
    });

    test('should reject dates and other built-ins', () => {
      expect(isPlainObject(new Date())).toBe(false);
      expect(isPlainObject(/abc/)).toBe(false);
      expect(isPlainObject(new Map())).toBe(false);
      expect(isPlainObject(new Set())).toBe(false);
    });

    test('should reject null and primitives', () => {
      expect(isPlainObject(null)).toBe(false);
      expect(isPlainObject(undefined)).toBe(false);
      expect(isPlainObject(1)).toBe(false);
      expect(isPlainObject('abc')).toBe(false);
      expect(isPlainObject(true)).toBe(false);
      expect(isPlainObject(() => {})).toBe(false);
    });
  });

  describe('isDate', () => {
    test('should identify Date objects', () => {
      expect(isDate(new Date())).toBe(true);
      expect(isDate(new Date('2022-01-01'))).toBe(true);
      expect(isDate(new Date('invalid'))).toBe(true);
    });

    test('should reject non-dates', () => {
      expect(isDate(Date.now())).toBe(false);
      expect(isDate('2022-01-01')).toBe(false);
      expect(isDate({})).toBe(false);
      expect(isDate(null)).toBe(false);
      expect(isDate(undefined)).toBe(false);
    });
  });

  describe('isRegExp', () => {
    test('should identify regular expressions', () => {
      expect(isRegExp(/abc/)).toBe(true);
      expect(isRegExp(/abc/gi)).toBe(true);
      expect(isRegExp(new RegExp('abc'))).toBe(true);
    });

    test('should reject non-regular expressions', () => {
      expect(isRegExp('/abc/')).toBe(false);
      expect(isRegExp({})).toBe(false);
      expect(isRegExp(null)).toBe(false);
      expect(isRegExp(undefined)).toBe(false);
      expect(isRegExp(() => {})).toBe(false);
    });
  });

  describe('isFinite', () => {
    test('should identify finite numbers', () => {
      expect(isFinite(0)).toBe(true);
      expect(isFinite(1)).toBe(true);
      expect(isFinite(-1.5)).toBe(true);
      expect(isFinite(Number.MAX_VALUE)).toBe(true);
      expect(isFinite(Number.MIN_SAFE_INTEGER)).toBe(true);
    });

    test('should reject NaN and infinities', () => {
      expect(isFinite(NaN)).toBe(false);
      expect(isFinite(Infinity)).toBe(false);
      expect(isFinite(-Infinity)).toBe(false);
    });

    test('should reject numeric strings and other types', () => {
      expect(isFinite('1')).toBe(false);
      expect(isFinite('')).toBe(false);
      expect(isFinite(null)).toBe(false);
      expect(isFinite(undefined)).toBe(false);
      expect(isFinite(true)).toBe(false);
      expect(isFinite([1])).toBe(false);
    });
  });

  describe('isInteger', () => {
    test('should identify integers', () => {
      expect(isInteger(0)).toBe(true);
      expect(isInteger(1)).toBe(true);
      expect(isInteger(-5)).toBe(true);
      expect(isInteger(1.0)).toBe(true);
      expect(isInteger(Number.MAX_SAFE_INTEGER)).toBe(true);
    });

    test('should reject non-integer numbers', () => {
      expect(isInteger(1.5)).toBe(false);
      expect(isInteger(-0.1)).toBe(false);
      expect(isInteger(NaN)).toBe(false);
      expect(isInteger(Infinity)).toBe(false);
      expect(isInteger(-Infinity)).toBe(false);
    });

    test('should reject non-numbers', () => {
      expect(isInteger('1')).toBe(false);
      expect(isInteger(null)).toBe(false);
      expect(isInteger(undefined)).toBe(false);
      expect(isInteger(true)).toBe(false);
      expect(isInteger([1])).toBe(false);
    });
  });

  describe('isNaN', () => {
    test('should identify NaN', () => {
      expect(isNaN(NaN)).toBe(true);
      expect(isNaN(Number('abc'))).toBe(true);
      expect(isNaN(0 / 0)).toBe(true);
    });

    test('should reject numbers', () => {
      expect(isNaN(0)).toBe(false);
      expect(isNaN(1)).toBe(false);
      expect(isNaN(Infinity)).toBe(false);
    });

    test('should reject non-numbers unlike the global isNaN', () => {
      expect(isNaN('abc')).toBe(false);
      expect(isNaN(undefined)).toBe(false);
      expect(isNaN(null)).toBe(false);
      expect(isNaN({})).toBe(false);
      expect(isNaN([])).toBe(false);
    });
  });

  describe('isEmpty', () => {
    test('should treat null and undefined as empty', () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
    });

    test('should treat empty strings and arrays as empty', () => {
      expect(isEmpty('')).toBe(true);
      expect(isEmpty([])).toBe(true);
    });

    test('should treat objects without own keys as empty', () => {
      expect(isEmpty({})).toBe(true);
      expect(isEmpty(Object.create(null))).toBe(true);
      expect(isEmpty(Object.create({ inherited: 1 }))).toBe(true);
    });

    test('should treat empty maps and sets as empty', () => {
      expect(isEmpty(new Map())).toBe(true);
      expect(isEmpty(new Set())).toBe(true);
    });

    test('should treat non-empty values as not empty', () => {
      expect(isEmpty('a')).toBe(false);
      expect(isEmpty(' ')).toBe(false);
      expect(isEmpty([1])).toBe(false);
      expect(isEmpty([undefined])).toBe(false);
      expect(isEmpty({ a: 1 })).toBe(false);
      expect(isEmpty({ a: undefined })).toBe(false);
      expect(isEmpty(new Map([['a', 1]]))).toBe(false);
      expect(isEmpty(new Set([1]))).toBe(false);
      expect(isEmpty(new Point(1, 2))).toBe(false);
    });

    test('should treat numbers and booleans as not empty', () => {
      expect(isEmpty(0)).toBe(false);
      expect(isEmpty(1)).toBe(false);
      expect(isEmpty(NaN)).toBe(false);
      expect(isEmpty(true)).toBe(false);
      expect(isEmpty(false)).toBe(false);
    });

    test('should treat functions and symbols as not empty', () => {
      expect(isEmpty(() => {})).toBe(false);
      expect(isEmpty(Symbol('a'))).toBe(false);
    });
  });

  describe('isEqual', () => {
    test('should compare primitives', () => {
      expect(isEqual(1, 1)).toBe(true);
      expect(isEqual('a', 'a')).toBe(true);
      expect(isEqual(true, true)).toBe(true);
      expect(isEqual(false, false)).toBe(true);
      expect(isEqual(1, 2)).toBe(false);
      expect(isEqual('a', 'b')).toBe(false);
      expect(isEqual(true, false)).toBe(false);
    });

    test('should not coerce types', () => {
      expect(isEqual(1, '1')).toBe(false);
      expect(isEqual(0, false)).toBe(false);
      expect(isEqual('', false)).toBe(false);
      expect(isEqual(0, '')).toBe(false);
      expect(isEqual(1, true)).toBe(false);
    });

    test('should treat NaN as equal to NaN', () => {
      expect(isEqual(NaN, NaN)).toBe(true);
      expect(isEqual(NaN, 0)).toBe(false);
      expect(isEqual(NaN, 'NaN')).toBe(false);
      expect(isEqual([NaN], [NaN])).toBe(true);
      expect(isEqual({ a: NaN }, { a: NaN })).toBe(true);
    });

    test('should treat 0 and -0 as equal', () => {
      expect(isEqual(0, -0)).toBe(true);
      expect(isEqual(-0, 0)).toBe(true);
    });

    test('should treat null and undefined as unequal', () => {
      expect(isEqual(null, undefined)).toBe(false);
      expect(isEqual(undefined, null)).toBe(false);
      expect(isEqual(null, null)).toBe(true);
      expect(isEqual(undefined, undefined)).toBe(true);
      expect(isEqual(null, 0)).toBe(false);
      expect(isEqual(undefined, '')).toBe(false);
      expect(isEqual(null, {})).toBe(false);
      expect(isEqual({}, undefined)).toBe(false);
    });

    test('should compare symbols by reference', () => {
      const symbol = Symbol('a');

      expect(isEqual(symbol, symbol)).toBe(true);
      expect(isEqual(Symbol('a'), Symbol('a'))).toBe(false);
    });

    test('should compare functions by reference', () => {
      const func = () => 1;

      expect(isEqual(func, func)).toBe(true);
      expect(
        isEqual(
          () => 1,
          () => 1
        )
      ).toBe(false);
      expect(isEqual(func, {})).toBe(false);
    });

    test('should compare flat arrays', () => {
      expect(isEqual([], [])).toBe(true);
      expect(isEqual([1, 2, 3], [1, 2, 3])).toBe(true);
      expect(isEqual([1, 2, 3], [3, 2, 1])).toBe(false);
      expect(isEqual([1, 2, 3], [1, 2])).toBe(false);
      expect(isEqual([1, 2], [1, 2, 3])).toBe(false);
    });

    test('should compare nested arrays', () => {
      expect(isEqual([1, [2, [3, [4]]]], [1, [2, [3, [4]]]])).toBe(true);
      expect(isEqual([1, [2, [3, [4]]]], [1, [2, [3, [5]]]])).toBe(false);
      expect(
        isEqual(
          [[1, 2], [3]],
          [
            [1, 2],
            [3, 4],
          ]
        )
      ).toBe(false);
    });

    test('should compare arrays of objects', () => {
      expect(isEqual([{ a: 1 }, { b: 2 }], [{ a: 1 }, { b: 2 }])).toBe(true);
      expect(isEqual([{ a: 1 }, { b: 2 }], [{ a: 1 }, { b: 3 }])).toBe(false);
    });

    test('should not treat arrays and objects as equal', () => {
      expect(isEqual([], {})).toBe(false);
      expect(isEqual({}, [])).toBe(false);
      expect(isEqual([1], { 0: 1 })).toBe(false);
      expect(isEqual({ 0: 1, length: 1 }, [1])).toBe(false);
    });

    test('should compare flat objects', () => {
      expect(isEqual({}, {})).toBe(true);
      expect(isEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
      expect(isEqual({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true);
      expect(isEqual({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(false);
    });

    test('should detect key-count mismatches', () => {
      expect(isEqual({ a: 1, b: 2 }, { a: 1 })).toBe(false);
      expect(isEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
      expect(isEqual({ a: 1 }, { b: 1 })).toBe(false);
      expect(isEqual({ a: undefined }, {})).toBe(false);
    });

    test('should compare nested objects', () => {
      expect(isEqual({ a: { b: { c: [1, { d: 2 }] } } }, { a: { b: { c: [1, { d: 2 }] } } })).toBe(
        true
      );
      expect(isEqual({ a: { b: { c: [1, { d: 2 }] } } }, { a: { b: { c: [1, { d: 3 }] } } })).toBe(
        false
      );
      expect(isEqual({ a: { b: 1 } }, { a: { c: 1 } })).toBe(false);
    });

    test('should compare class instances by their own enumerable properties', () => {
      expect(isEqual(new Point(1, 2), new Point(1, 2))).toBe(true);
      expect(isEqual(new Point(1, 2), new Point(2, 1))).toBe(false);
      expect(isEqual(new Point(1, 2), { x: 1, y: 2 })).toBe(true);
    });

    test('should compare dates by time value', () => {
      expect(isEqual(new Date('2022-01-01'), new Date('2022-01-01'))).toBe(true);
      expect(isEqual(new Date('2022-01-01'), new Date('2022-01-02'))).toBe(false);
      expect(isEqual(new Date(0), new Date(0))).toBe(true);
    });

    test('should not treat a date as equal to a non-date', () => {
      const date = new Date('2022-01-01');

      expect(isEqual(date, date.getTime())).toBe(false);
      expect(isEqual(date, date.toISOString())).toBe(false);
      expect(isEqual(date, {})).toBe(false);
      expect(isEqual({}, date)).toBe(false);
    });

    test('should compare regular expressions by source and flags', () => {
      expect(isEqual(/abc/, /abc/)).toBe(true);
      expect(isEqual(/abc/gi, /abc/gi)).toBe(true);
      expect(isEqual(/abc/gi, /abc/gi)).toBe(true);
      expect(isEqual(new RegExp('abc', 'g'), /abc/g)).toBe(true);
      expect(isEqual(/abc/g, /abc/i)).toBe(false);
      expect(isEqual(/abc/g, /abc/)).toBe(false);
      expect(isEqual(/abc/, /abd/)).toBe(false);
    });

    test('should not treat a regular expression as equal to a non-regexp', () => {
      expect(isEqual(/abc/, '/abc/')).toBe(false);
      expect(isEqual(/abc/, {})).toBe(false);
      expect(isEqual({}, /abc/)).toBe(false);
    });

    test('should compare maps with the same entries as equal regardless of insertion order', () => {
      const a = new Map<string, number>([
        ['x', 1],
        ['y', 2],
      ]);
      const b = new Map<string, number>([
        ['y', 2],
        ['x', 1],
      ]);

      expect(isEqual(a, b)).toBe(true);
      expect(isEqual(new Map(), new Map())).toBe(true);
    });

    test('should compare map values deeply', () => {
      const a = new Map([['key', { nested: [1, 2] }]]);
      const b = new Map([['key', { nested: [1, 2] }]]);
      const c = new Map([['key', { nested: [1, 3] }]]);

      expect(isEqual(a, b)).toBe(true);
      expect(isEqual(a, c)).toBe(false);
    });

    test('should treat maps with different values as unequal', () => {
      const a = new Map([['x', 1]]);
      const b = new Map([['x', 2]]);

      expect(isEqual(a, b)).toBe(false);
    });

    test('should treat maps with different keys as unequal', () => {
      const a = new Map([['x', 1]]);
      const b = new Map([['y', 1]]);

      expect(isEqual(a, b)).toBe(false);
    });

    test('should treat maps with different sizes as unequal', () => {
      const a = new Map([['x', 1]]);
      const b = new Map([
        ['x', 1],
        ['y', 2],
      ]);

      expect(isEqual(a, b)).toBe(false);
      expect(isEqual(b, a)).toBe(false);
    });

    test('should not treat a map as equal to a plain object', () => {
      const map = new Map([['x', 1]]);

      expect(isEqual(map, { x: 1 })).toBe(false);
      expect(isEqual({ x: 1 }, map)).toBe(false);
      expect(isEqual(new Map(), {})).toBe(false);
    });

    test('should compare sets with the same members as equal regardless of insertion order', () => {
      expect(isEqual(new Set([1, 2, 3]), new Set([3, 2, 1]))).toBe(true);
      expect(isEqual(new Set(), new Set())).toBe(true);
      expect(isEqual(new Set(['a']), new Set(['a']))).toBe(true);
    });

    test('should treat sets with different members as unequal', () => {
      expect(isEqual(new Set([1, 2, 3]), new Set([1, 2, 4]))).toBe(false);
    });

    test('should treat sets with different sizes as unequal', () => {
      expect(isEqual(new Set([1, 2]), new Set([1, 2, 3]))).toBe(false);
      expect(isEqual(new Set([1, 2, 3]), new Set([1, 2]))).toBe(false);
    });

    test('should not treat a set as equal to a map, array or plain object', () => {
      expect(isEqual(new Set([1]), new Map([[1, 1]]))).toBe(false);
      expect(isEqual(new Map([[1, 1]]), new Set([1]))).toBe(false);
      expect(isEqual(new Set([1]), [1])).toBe(false);
      expect(isEqual(new Set(), {})).toBe(false);
      expect(isEqual({}, new Set())).toBe(false);
    });

    test('should compare typed arrays by their bytes', () => {
      expect(isEqual(new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 3]))).toBe(true);
      expect(isEqual(new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 4]))).toBe(false);
      expect(isEqual(new Uint8Array([]), new Uint8Array([]))).toBe(true);
      expect(isEqual(new Float64Array([1.5, 2.5]), new Float64Array([1.5, 2.5]))).toBe(true);
      expect(isEqual(new Float64Array([1.5, 2.5]), new Float64Array([1.5, 2.6]))).toBe(false);
    });

    test('should treat typed arrays with different lengths as unequal', () => {
      expect(isEqual(new Uint8Array([1, 2]), new Uint8Array([1, 2, 3]))).toBe(false);
    });

    test('should treat typed arrays of different types as unequal', () => {
      expect(isEqual(new Uint8Array([1, 2]), new Int8Array([1, 2]))).toBe(false);
      expect(isEqual(new Uint8Array([1, 0, 2, 0]), new Uint16Array([1, 2]))).toBe(false);
    });

    test('should compare typed array views over a shared buffer', () => {
      const buffer = new Uint8Array([9, 1, 2, 3, 9]).buffer;
      const view = new Uint8Array(buffer, 1, 3);

      expect(isEqual(view, new Uint8Array([1, 2, 3]))).toBe(true);
      expect(isEqual(view, new Uint8Array([9, 1, 2]))).toBe(false);
    });

    test('should not treat a typed array as equal to a plain array or object', () => {
      expect(isEqual(new Uint8Array([1, 2]), [1, 2])).toBe(false);
      expect(isEqual([1, 2], new Uint8Array([1, 2]))).toBe(false);
      expect(isEqual(new Uint8Array([1, 2]), { 0: 1, 1: 2 })).toBe(false);
      expect(isEqual({ 0: 1, 1: 2 }, new Uint8Array([1, 2]))).toBe(false);
    });

    test('should compare separately built circular objects with the same shape', () => {
      const a: Record<string, unknown> = { value: 1 };
      a.self = a;
      const b: Record<string, unknown> = { value: 1 };
      b.self = b;

      expect(isEqual(a, b)).toBe(true);
      expect(isEqual(a, a)).toBe(true);
    });

    test('should detect differences inside circular objects', () => {
      const a: Record<string, unknown> = { value: 1 };
      a.self = a;
      const b: Record<string, unknown> = { value: 2 };
      b.self = b;

      expect(isEqual(a, b)).toBe(false);
    });

    test('should compare circular arrays', () => {
      const a: unknown[] = [1, 2];
      a.push(a);
      const b: unknown[] = [1, 2];
      b.push(b);
      const c: unknown[] = [1, 3];
      c.push(c);

      expect(isEqual(a, b)).toBe(true);
      expect(isEqual(a, c)).toBe(false);
    });

    test('should compare structures with mutual circular references', () => {
      const a1: Record<string, unknown> = { name: 'a' };
      const a2: Record<string, unknown> = { name: 'b', back: a1 };
      a1.next = a2;

      const b1: Record<string, unknown> = { name: 'a' };
      const b2: Record<string, unknown> = { name: 'b', back: b1 };
      b1.next = b2;

      expect(isEqual(a1, b1)).toBe(true);
    });

    test('should compare circular structures inside maps', () => {
      const a = new Map<string, unknown>([['n', 1]]);
      a.set('self', a);
      const b = new Map<string, unknown>([['n', 1]]);
      b.set('self', b);

      expect(isEqual(a, b)).toBe(true);
    });

    test('should compare objects with identical nested references', () => {
      const shared = { s: 1 };
      const a = { left: shared, right: shared };
      const b = { left: { s: 1 }, right: { s: 1 } };

      expect(isEqual(a, b)).toBe(true);
    });
  });
});

describe('isEqual on Sets of objects', () => {
  test('should compare members deeply', () => {
    expect(isEqual(new Set([{ a: 1 }, [1, 2]]), new Set([[1, 2], { a: 1 }]))).toBe(true);
    expect(isEqual(new Set([{ a: 1 }]), new Set([{ a: 2 }]))).toBe(false);
    expect(isEqual(new Set([{ a: 1 }, { a: 1 }]), new Set([{ a: 1 }, { b: 1 }]))).toBe(false);
  });

  test('should still use SameValueZero for primitives', () => {
    expect(isEqual(new Set([NaN, 1]), new Set([1, NaN]))).toBe(true);
    expect(isEqual(new Set(['1']), new Set([1]))).toBe(false);
  });

  test('should handle circular members', () => {
    const a: any = { name: 'x' };
    a.self = a;
    const b: any = { name: 'x' };
    b.self = b;
    expect(isEqual(new Set([a]), new Set([b]))).toBe(true);
  });
});

describe('isEqual on Maps with object keys', () => {
  test('should compare keys deeply', () => {
    expect(isEqual(new Map([[{ a: 1 }, 1]]), new Map([[{ a: 1 }, 1]]))).toBe(true);
    expect(isEqual(new Map([[{ a: 1 }, 1]]), new Map([[{ a: 1 }, 2]]))).toBe(false);
    expect(isEqual(new Map([[{ a: 1 }, 1]]), new Map([[{ a: 2 }, 1]]))).toBe(false);
  });

  test('should match each entry at most once', () => {
    expect(
      isEqual(
        new Map([
          [{ a: 1 }, 1],
          [{ a: 1 }, 1],
        ]),
        new Map([
          [{ a: 1 }, 1],
          [{ b: 1 }, 1],
        ])
      )
    ).toBe(false);
  });
});

describe('isEqual cycle handling (second review)', () => {
  test('should terminate when one value is compared against two different cyclic partners', () => {
    const n1: any = { v: 1 };
    n1.next = n1;
    n1.prev = n1;
    const m1: any = { v: 1 };
    const m2: any = { v: 1 };
    m1.next = m2;
    m1.prev = m2;
    m2.next = m1;
    m2.prev = m1;
    expect(isEqual(n1, m1)).toBe(true);

    const m3: any = { v: 2 };
    m1.prev = m3;
    m3.next = m1;
    m3.prev = m1;
    expect(isEqual(n1, m1)).toBe(false);
  });

  test('should compare a self-loop against an unrolled two-node cycle', () => {
    const a: any = {};
    a.p = a;
    a.q = a;
    const b: any = {};
    const b2: any = {};
    b.p = b2;
    b.q = b;
    b2.p = b2;
    b2.q = b2;
    expect(isEqual(a, b)).toBe(true);
  });

  test('should handle cycles through Maps and Sets', () => {
    const a: any = new Map();
    a.set('self', a);
    const b: any = new Map();
    b.set('self', b);
    expect(isEqual(a, b)).toBe(true);

    const s1: any = new Set();
    s1.add(s1);
    const s2: any = new Set();
    s2.add(s2);
    expect(isEqual(s1, s2)).toBe(true);
  });
});

describe('isEqual multiset matching (second review)', () => {
  test('should not let a reference-equal key with a different value block a deep match', () => {
    const k = {};
    const k2 = {};
    expect(
      isEqual(
        new Map([
          [k, 1],
          [k2, 2],
        ]),
        new Map([
          [k, 2],
          [k2, 1],
        ])
      )
    ).toBe(true);
    expect(
      isEqual(
        new Map([
          [k, 1],
          [k2, 2],
        ]),
        new Map([
          [k, 2],
          [k2, 3],
        ])
      )
    ).toBe(false);
  });

  test('should compare large Sets and Maps of objects in reasonable time', () => {
    const size = 5000;
    const left = new Set(Array.from({ length: size }, (_, i) => ({ id: i, tags: ['a'] })));
    const right = new Set(
      Array.from({ length: size }, (_, i) => ({ id: size - 1 - i, tags: ['a'] }))
    );
    const started = Date.now();
    expect(isEqual(left, right)).toBe(true);

    const leftMap = new Map(Array.from({ length: size }, (_, i) => [{ id: i }, i]));
    const rightMap = new Map(
      Array.from({ length: size }, (_, i) => [{ id: size - 1 - i }, size - 1 - i])
    );
    expect(isEqual(leftMap, rightMap)).toBe(true);
    expect(Date.now() - started).toBeLessThan(3000);
  });

  test('should still detect a single differing member in large Sets', () => {
    const left = new Set(Array.from({ length: 1000 }, (_, i) => ({ id: i })));
    const right = new Set(Array.from({ length: 1000 }, (_, i) => ({ id: i === 500 ? -1 : i })));
    expect(isEqual(left, right)).toBe(false);
  });
});

describe('isEqual consumed members (second review)', () => {
  test('should not reuse a member consumed by a deep match for a later reference match', () => {
    const c = { a: 1 };
    const x = { a: 1 };
    const y = { a: 2 };
    expect(isEqual(new Set([x, c]), new Set([c, y]))).toBe(false);
    expect(isEqual(new Set([x, c]), new Set([c, { a: 1 }]))).toBe(true);
    expect(
      isEqual(
        new Map([
          [x, 1],
          [c, 1],
        ]),
        new Map([
          [c, 1],
          [y, 1],
        ])
      )
    ).toBe(false);
  });
});
