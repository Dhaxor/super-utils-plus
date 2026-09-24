import { set } from '../set.js';

describe('set', () => {
  test('should set values using string and array paths (JSDoc example)', () => {
    const object: any = { a: [{ b: { c: 3 } }] };

    set(object, 'a[0].b.c', 4);
    expect(object).toEqual({ a: [{ b: { c: 4 } }] });

    set(object, ['x', '0', 'y', 'z'], 5);
    expect(object).toEqual({ a: [{ b: { c: 4 } }], x: [{ y: { z: 5 } }] });
    expect(Array.isArray(object.x)).toBe(true);
  });

  test('should create arrays for numeric next segments', () => {
    const fromString: any = set({}, 'a[0].b', 1);
    expect(fromString).toEqual({ a: [{ b: 1 }] });
    expect(Array.isArray(fromString.a)).toBe(true);

    const fromStringSegments: any = set({}, ['x', '0', 'y'], 5);
    expect(fromStringSegments).toEqual({ x: [{ y: 5 }] });
    expect(Array.isArray(fromStringSegments.x)).toBe(true);

    const fromNumberSegments: any = set({}, ['x', 0, 'y'], 5);
    expect(fromNumberSegments).toEqual({ x: [{ y: 5 }] });
    expect(Array.isArray(fromNumberSegments.x)).toBe(true);
  });

  test('should create objects for non-numeric next segments', () => {
    const result: any = set({}, 'a.b.c', 1);

    expect(result).toEqual({ a: { b: { c: 1 } } });
    expect(Array.isArray(result.a)).toBe(false);
    expect(Array.isArray(result.a.b)).toBe(false);
  });

  test('should replace a primitive in the middle of the path at the correct parent', () => {
    const object: any = { a: { b: 1 } };
    set(object, 'a.b.c', 2);

    expect(object).toEqual({ a: { b: { c: 2 } } });
    expect(Object.keys(object)).toEqual(['a']);
    expect('b' in object).toBe(false);
  });

  test('should replace null intermediate values', () => {
    expect(set({ a: null } as any, 'a.b', 1)).toEqual({ a: { b: 1 } });
  });

  test('should preserve sibling properties along the path', () => {
    const object: any = { a: { b: 1, c: { d: 2 } }, e: 3 };
    set(object, 'a.c.f', 4);

    expect(object).toEqual({ a: { b: 1, c: { d: 2, f: 4 } }, e: 3 });
  });

  test('should overwrite existing array indices', () => {
    expect(set({ a: [1, 2, 3] }, 'a[1]', 9)).toEqual({ a: [1, 9, 3] });
    expect(set({ a: [1, 2, 3] }, 'a.1', 9)).toEqual({ a: [1, 9, 3] });
    expect(set({ a: [1, 2, 3] }, ['a', 1], 9)).toEqual({ a: [1, 9, 3] });
  });

  test('should overwrite an existing top-level value', () => {
    expect(set({ a: 1 }, 'a', 2)).toEqual({ a: 2 });
  });

  test('should set an undefined value', () => {
    const result = set({ a: 1 } as Record<string, any>, 'b', undefined);
    expect('b' in result).toBe(true);
    expect(result.b).toBeUndefined();
  });

  test('should support single-key paths', () => {
    expect(set({}, 5, 'five')).toEqual({ 5: 'five' });

    const symbol = Symbol('key');
    const result: any = set({}, symbol, 'value');
    expect(result[symbol]).toBe('value');
  });

  test('should support quoted bracket segments', () => {
    expect(set({}, 'a["b.c"]', 1)).toEqual({ a: { 'b.c': 1 } });
    expect(set({}, "a['x']", 2)).toEqual({ a: { x: 2 } });
  });

  test('should return the same object reference', () => {
    const object = { a: 1 };
    expect(set(object, 'b', 2)).toBe(object);
  });

  test('should return a nil object as-is', () => {
    expect(set(null as any, 'a', 1)).toBeNull();
    expect(set(undefined as any, 'a', 1)).toBeUndefined();
  });

  test('should be a no-op for an empty array path', () => {
    const object = { a: 1 };

    expect(set(object, [], 2)).toBe(object);
    expect(object).toEqual({ a: 1 });
  });

  test('should ignore paths containing __proto__', () => {
    const object: any = {};

    expect(set(object, '__proto__.polluted', true)).toBe(object);
    set(object, ['__proto__', 'polluted'], true);
    set(object, 'a.__proto__.polluted', true);

    expect(({} as any).polluted).toBeUndefined();
    expect(object.polluted).toBeUndefined();
    expect(object).toEqual({});
    expect(Object.keys(object)).toEqual([]);
  });

  test('should ignore paths containing constructor or prototype', () => {
    const object: any = {};

    set(object, 'constructor.prototype.polluted', true);
    set(object, ['constructor', 'prototype', 'polluted'], true);
    set(object, 'prototype.polluted', true);
    set(object, 'constructor', 'overwritten');

    expect(({} as any).polluted).toBeUndefined();
    expect(object.polluted).toBeUndefined();
    expect(Object.keys(object)).toEqual([]);
    expect(object.constructor).toBe(Object);
  });
});

describe('set with non-index numeric segments', () => {
  test('should create objects, not arrays, for negative or fractional numbers', () => {
    expect(set({}, ['a', -1], 1)).toEqual({ a: { '-1': 1 } });
    expect(set({}, 'a[-1]', 1)).toEqual({ a: { '-1': 1 } });
    expect(set({}, ['a', 1.5], 1)).toEqual({ a: { '1.5': 1 } });
    expect(set({}, 'a[01]', 1)).toEqual({ a: { '01': 1 } });
  });

  test('should set the empty-string key for an empty string path', () => {
    expect(set({}, '', 1)).toEqual({ '': 1 });
  });
});
