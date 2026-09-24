/**
 * Regression tests: helpers that accept user-controlled paths or objects must
 * never write through the prototype chain.
 */
import { groupBy } from '../array/groupBy.js';
import { zipObject, zipObjectDeep } from '../array/zip.js';
import { deepClone } from '../object/deepClone.js';
import { defaults, defaultsDeep } from '../object/default.js';
import { fromPairs } from '../object/fromPairs.js';
import { invert, invertBy } from '../object/invert.js';
import { mapKeys, mapValues } from '../object/mapValues.js';
import { merge } from '../object/merge.js';
import { omit, omitBy } from '../object/omit.js';
import { pick, pickBy } from '../object/pick.js';
import { set } from '../object/set.js';

const protoPayload = () => JSON.parse('{"__proto__": {"polluted": true}}');
const constructorPayload = () => JSON.parse('{"constructor": {"prototype": {"polluted": true}}}');

afterEach(() => {
  // Make sure no test leaked a property onto Object.prototype
  expect(({} as any).polluted).toBeUndefined();
  expect(Object.prototype).not.toHaveProperty('polluted');
});

describe('set', () => {
  test.each([
    '__proto__.polluted',
    'constructor.prototype.polluted',
    'a.__proto__.polluted',
    ['__proto__', 'polluted'],
    ['a', 'constructor', 'prototype', 'polluted'],
  ])('should ignore the path %j', path => {
    const target: Record<string, any> = { a: {} };
    expect(set(target, path as any, true)).toBe(target);
    expect(target).toEqual({ a: {} });
    expect(({} as any).polluted).toBeUndefined();
  });
});

describe('merge', () => {
  test('should ignore __proto__ keys in sources', () => {
    const result = merge({}, protoPayload());
    expect(({} as any).polluted).toBeUndefined();
    expect(Object.keys(result)).toEqual([]);
  });

  test('should ignore constructor.prototype keys in sources', () => {
    merge({}, constructorPayload());
    expect(({} as any).polluted).toBeUndefined();
  });

  test('should ignore unsafe keys in nested sources', () => {
    merge({ a: {} }, { a: protoPayload() } as any);
    expect(({} as any).polluted).toBeUndefined();
  });
});

describe('defaults / defaultsDeep', () => {
  test('defaults should ignore __proto__ keys', () => {
    const result = defaults({}, protoPayload());
    expect(({} as any).polluted).toBeUndefined();
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
  });

  test('defaultsDeep should ignore __proto__ keys', () => {
    defaultsDeep({}, protoPayload());
    defaultsDeep({ a: {} }, { a: protoPayload() } as any);
    expect(({} as any).polluted).toBeUndefined();
  });

  test('defaultsDeep should ignore constructor.prototype keys', () => {
    defaultsDeep({}, constructorPayload());
    expect(({} as any).polluted).toBeUndefined();
  });
});

describe('zipObjectDeep', () => {
  test('should ignore unsafe paths', () => {
    const result = zipObjectDeep(
      ['__proto__.polluted', 'constructor.prototype.polluted', 'ok'],
      [true, true, 1]
    );
    expect(result).toEqual({ ok: 1 });
    expect(({} as any).polluted).toBeUndefined();
  });
});

describe('functions that turn data into object keys', () => {
  const ownProto = (object: object) => Object.prototype.hasOwnProperty.call(object, '__proto__');

  test('groupBy should store a __proto__ group as an own property', () => {
    const result = groupBy(['__proto__', 'a', '__proto__'], value => value);
    expect(ownProto(result)).toBe(true);
    expect(result['__proto__']).toEqual(['__proto__', '__proto__']);
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
  });

  test('invert and invertBy should store a __proto__ key as an own property', () => {
    expect(ownProto(invert({ a: '__proto__' }))).toBe(true);
    expect(invertBy({ a: '__proto__', b: '__proto__' })['__proto__']).toEqual(['a', 'b']);
  });

  test('fromPairs, zipObject, and mapKeys should store a __proto__ key as an own property', () => {
    expect(ownProto(fromPairs([['__proto__', 1]]))).toBe(true);
    expect(ownProto(zipObject(['__proto__'], [1]))).toBe(true);
    expect(ownProto(mapKeys({ a: 1 }, () => '__proto__'))).toBe(true);
  });

  test('mapValues, pick, omit, pickBy, and omitBy should preserve an own __proto__ key', () => {
    const source = JSON.parse('{"__proto__": {"x": 1}, "a": 2}');
    expect(ownProto(mapValues(source, value => value))).toBe(true);
    expect(ownProto(pick(source, ['__proto__']))).toBe(true);
    expect(ownProto(omit(source, ['a']))).toBe(true);
    expect(ownProto(pickBy(source, () => true))).toBe(true);
    expect(ownProto(omitBy(source, () => false))).toBe(true);
    expect(({} as any).x).toBeUndefined();
  });
});

describe('object-typed path segments', () => {
  test('set should not be bypassed by array or String-object segments', () => {
    const target: Record<string, any> = {};
    set(target, JSON.parse('[["__proto__"], "polluted"]'), true);
    set(target, [new String('__proto__'), 'polluted'] as any, true);
    set(target, [['constructor'], ['prototype'], 'polluted'] as any, true);
    expect(({} as any).polluted).toBeUndefined();
    expect(Object.keys(target)).toEqual([]);
  });
});

describe('nested __proto__ data keys stay own properties', () => {
  const nested = () => JSON.parse('{"a": {"__proto__": {"isAdmin": true}}}');
  const ownProto = (object: object) => Object.prototype.hasOwnProperty.call(object, '__proto__');

  test('deepClone should copy an own __proto__ key as an own key', () => {
    const clone = deepClone(nested());
    expect(ownProto(clone.a)).toBe(true);
    expect(Object.getPrototypeOf(clone.a)).toBe(Object.prototype);
    expect(clone.a.isAdmin).toBeUndefined();
  });

  test('merge should not turn a nested __proto__ key into the prototype of the result', () => {
    const result: any = merge({}, nested());
    expect(result.a.isAdmin).toBeUndefined();
    expect(Object.getPrototypeOf(result.a)).toBe(Object.prototype);
  });

  test('defaultsDeep should not turn a nested __proto__ key into a prototype', () => {
    const result: any = defaultsDeep(JSON.parse('{"x": {"__proto__": {"isAdmin": true}}}'), {
      b: 1,
    });
    expect(result.x.isAdmin).toBeUndefined();
    expect(result.isAdmin).toBeUndefined();
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
  });
});
