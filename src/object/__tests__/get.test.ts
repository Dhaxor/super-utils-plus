import { get } from '../get.js';

describe('get', () => {
  const object = { a: [{ b: { c: 3 } }] };

  test('should get a value using a string path with dots and brackets', () => {
    expect(get(object, 'a[0].b.c')).toBe(3);
    expect(get(object, 'a.0.b.c')).toBe(3);
    expect(get(object, 'a[0]')).toEqual({ b: { c: 3 } });
  });

  test('should get a value using an array path', () => {
    expect(get(object, ['a', '0', 'b', 'c'])).toBe(3);
    expect(get(object, ['a', 0, 'b', 'c'])).toBe(3);
  });

  test('should return the default value for a missing path', () => {
    expect(get(object, 'a.b.c', 'default')).toBe('default');
    expect(get(object, ['a', 'b', 'c'], 'default')).toBe('default');
  });

  test('should return undefined for a missing path without a default value', () => {
    expect(get(object, 'x.y.z')).toBeUndefined();
    expect(get(object, 'a[5].b')).toBeUndefined();
  });

  test('should support quoted bracket segments', () => {
    const nested = { a: { 'b.c': 1, x: 2, "it's": 3 } };
    expect(get(nested, 'a["b.c"]')).toBe(1);
    expect(get(nested, "a['x']")).toBe(2);
    expect(get(nested, 'a[x]')).toBe(2);
    expect(get(nested, 'a["it\'s"]')).toBe(3);
  });

  test('should support single-key paths', () => {
    expect(get({ a: 1 }, 'a')).toBe(1);
    expect(get([10, 20], 1)).toBe(20);
    expect(get({ 5: 'five' }, 5)).toBe('five');
    expect(get({ 5: 'five' }, '5')).toBe('five');

    const symbol = Symbol('key');
    const withSymbol = { [symbol]: 'symbol value' };
    expect(get(withSymbol, symbol)).toBe('symbol value');
    expect(get(withSymbol, [symbol])).toBe('symbol value');
  });

  test('should return the default value only when the resolved value is undefined', () => {
    expect(get({ a: undefined }, 'a', 'default')).toBe('default');
    expect(get({}, 'a', 'default')).toBe('default');
    expect(get({ a: null }, 'a', 'default')).toBeNull();
    expect(get({ a: 0 }, 'a', 'default')).toBe(0);
    expect(get({ a: '' }, 'a', 'default')).toBe('');
    expect(get({ a: false }, 'a', 'default')).toBe(false);
    expect(get({ a: NaN }, 'a', 'default')).toBeNaN();
  });

  test('should return the default value for a nil object', () => {
    expect(get(null, 'a', 'default')).toBe('default');
    expect(get(undefined, 'a', 'default')).toBe('default');
    expect(get(null, 'a')).toBeUndefined();
    expect(get(undefined, ['a', 'b'])).toBeUndefined();
  });

  test('should return the default value when an intermediate value is nil', () => {
    expect(get({ a: null }, 'a.b', 'default')).toBe('default');
    expect(get({ a: undefined }, 'a.b.c', 'default')).toBe('default');
    expect(get({ a: { b: null } }, 'a.b.c', 'default')).toBe('default');
    expect(get({ a: { b: null } }, 'a.b.c')).toBeUndefined();
  });

  test('should traverse through primitive values', () => {
    expect(get({ a: 'hello' }, 'a.length')).toBe(5);
    expect(get({ a: 'hello' }, 'a[1]')).toBe('e');
    expect(get({ a: 42 }, 'a.b', 'default')).toBe('default');
  });

  test('should return the object itself for an empty array path', () => {
    expect(get(object, [])).toBe(object);
  });

  test('should treat an empty string path as the empty-string key', () => {
    expect(get({ '': 1 }, '')).toBe(1);
    expect(get(object, '')).toBeUndefined();
    expect(get({ a: { '': 2 } }, 'a.')).toBe(2);
  });

  test('should read inherited properties', () => {
    class Foo {
      get b() {
        return 2;
      }
    }
    expect(get({ a: new Foo() }, 'a.b')).toBe(2);
    expect(get({ a: [1, 2, 3] }, 'a.length')).toBe(3);
  });
});

describe('get with escaped quoted paths (second review)', () => {
  test('should read keys containing quotes and brackets', () => {
    expect(get({ a: { 'b"c': 1 } }, 'a["b\\"c"]')).toBe(1);
    expect(get({ a: { 'b]c': 1 } }, 'a["b]c"]')).toBe(1);
  });
});
