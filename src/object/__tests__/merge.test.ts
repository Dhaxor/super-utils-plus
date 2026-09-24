import { merge } from '../merge.js';

describe('merge', () => {
  test('should merge arrays by index (JSDoc example)', () => {
    const object: Record<string, any> = { a: [{ b: 2 }, { d: 4 }] };
    const other = { a: [{ c: 3 }, { e: 5 }] };

    expect(merge(object, other)).toEqual({
      a: [
        { b: 2, c: 3 },
        { d: 4, e: 5 },
      ],
    });
  });

  test('should recursively merge nested objects', () => {
    const object: Record<string, any> = { a: { b: 1, c: { d: 2 } }, x: 1 };
    const source = { a: { c: { e: 3 }, f: 4 }, y: 2 };

    expect(merge(object, source)).toEqual({
      a: { b: 1, c: { d: 2, e: 3 }, f: 4 },
      x: 1,
      y: 2,
    });
  });

  test('should reuse existing nested destination objects instead of replacing them', () => {
    const inner = { b: 1 };
    const object: Record<string, any> = { a: inner };

    merge(object, { a: { c: 2 } });

    expect(object.a).toBe(inner);
    expect(inner).toEqual({ b: 1, c: 2 });
  });

  test('should append extra source array items and keep extra destination items', () => {
    expect(merge({ a: [1, 2, 3] } as Record<string, any>, { a: [9] })).toEqual({
      a: [9, 2, 3],
    });
    expect(merge({ a: [1] } as Record<string, any>, { a: [1, 2, 3] })).toEqual({
      a: [1, 2, 3],
    });
  });

  test('should skip undefined array items in the source', () => {
    expect(merge({ a: [1, 2, 3] } as Record<string, any>, { a: [undefined, 9] })).toEqual({
      a: [1, 9, 3],
    });
  });

  test('should skip undefined source values', () => {
    expect(merge({ a: 1, b: 2 } as Record<string, any>, { a: undefined, b: 3 })).toEqual({
      a: 1,
      b: 3,
    });
  });

  test('should assign null source values', () => {
    expect(merge({ a: 1 } as Record<string, any>, { a: null })).toEqual({ a: null });
  });

  test('should override primitives and replace objects with primitives', () => {
    expect(merge({ a: 1, b: 'x' } as Record<string, any>, { a: 2, b: 'y' })).toEqual({
      a: 2,
      b: 'y',
    });
    expect(merge({ a: { b: 1 } } as Record<string, any>, { a: 5 })).toEqual({ a: 5 });
    expect(merge({ a: [1, 2] } as Record<string, any>, { a: 'str' })).toEqual({ a: 'str' });
  });

  test('should override non-plain object values such as Date by assignment', () => {
    const later = new Date(2000, 0, 2);
    const result = merge({ d: new Date(2000, 0, 1) } as Record<string, any>, { d: later });

    expect(result.d.getTime()).toBe(later.getTime());
  });

  test('should apply multiple sources from left to right', () => {
    const object: Record<string, any> = { a: 1 };

    expect(merge(object, { a: 2, b: 1 }, { b: 2, c: 3 }, { a: { deep: true } })).toEqual({
      a: { deep: true },
      b: 2,
      c: 3,
    });
  });

  test('should mutate and return the destination object', () => {
    const object: Record<string, any> = { a: 1 };
    const result = merge(object, { b: 2 });

    expect(result).toBe(object);
    expect(object).toEqual({ a: 1, b: 2 });
  });

  test('should return the destination object when no sources are provided', () => {
    const object = { a: 1 };
    expect(merge(object)).toBe(object);
    expect(object).toEqual({ a: 1 });
  });

  test('should deep clone object source values that replace a non-object', () => {
    const source = { a: { b: [1, { c: 2 }] } };
    const result = merge({ a: 1 } as Record<string, any>, source);

    expect(result).toEqual(source);
    expect(result.a).not.toBe(source.a);
    expect(result.a.b).not.toBe(source.a.b);
    expect(result.a.b[1]).not.toBe(source.a.b[1]);

    result.a.b[1].c = 99;
    result.a.b.push(3);
    result.a.d = 'new';

    expect(source).toEqual({ a: { b: [1, { c: 2 }] } });
  });

  test('should deep clone array source values that replace a non-array', () => {
    const source = { a: [{ b: 1 }] };
    const result = merge({ a: 'x' } as Record<string, any>, source);

    expect(result).toEqual(source);
    expect(result.a).not.toBe(source.a);
    expect(result.a[0]).not.toBe(source.a[0]);

    result.a[0].b = 2;
    expect(source.a[0].b).toBe(1);
  });

  test('should deep clone array items appended from the source', () => {
    const source: { a: any[] } = { a: [1, { x: 1 }] };
    const result = merge({ a: [1] } as Record<string, any>, source);

    expect(result.a).toEqual([1, { x: 1 }]);
    expect(result.a[1]).not.toBe(source.a[1]);

    result.a[1].x = 2;
    expect(source.a[1].x).toBe(1);
  });

  test('should not mutate the source objects', () => {
    const source = { a: { b: 1 }, c: [1] };
    merge({ a: { d: 2 }, c: [2, 3] } as Record<string, any>, source);

    expect(source).toEqual({ a: { b: 1 }, c: [1] });
  });

  test('should return a non-object destination untouched', () => {
    expect(merge(null as any, { a: 1 })).toBeNull();
    expect(merge(undefined as any, { a: 1 })).toBeUndefined();
    expect(merge(42 as any, { a: 1 })).toBe(42);
    expect(merge('str' as any, { a: 1 })).toBe('str');
  });

  test('should ignore non-object sources', () => {
    const object: Record<string, any> = { a: 1 };

    expect(merge(object, null as any, undefined as any, 5 as any, 'str' as any)).toEqual({
      a: 1,
    });
  });

  test('should not pollute Object.prototype through __proto__ keys', () => {
    const result: any = merge({}, JSON.parse('{"__proto__": {"polluted": true}}'));

    expect(({} as any).polluted).toBeUndefined();
    expect(result.polluted).toBeUndefined();
    expect(Object.keys(result)).toEqual([]);
  });

  test('should not pollute Object.prototype through constructor.prototype keys', () => {
    const result: any = merge({}, JSON.parse('{"constructor": {"prototype": {"polluted": true}}}'));

    expect(({} as any).polluted).toBeUndefined();
    expect(result.polluted).toBeUndefined();
    expect(Object.keys(result)).toEqual([]);
  });

  test('should ignore unsafe keys in nested sources', () => {
    const result: any = merge(
      { a: {} } as Record<string, any>,
      JSON.parse('{"a": {"__proto__": {"polluted": true}, "prototype": {"x": 1}, "safe": 1}}')
    );

    expect(({} as any).polluted).toBeUndefined();
    expect(result.a).toEqual({ safe: 1 });
    expect(Object.keys(result.a)).toEqual(['safe']);
  });
});

describe('merge into non-plain destinations (review regressions)', () => {
  class Foo {
    a = 1;
  }

  test('should merge a plain object source into a class instance destination', () => {
    const result = merge({ f: new Foo() }, { f: { b: 2 } } as any);
    expect(result.f).toBeInstanceOf(Foo);
    expect(result.f).toEqual(Object.assign(new Foo(), { b: 2 }));
  });

  test('should merge a plain object source into a Map destination', () => {
    const map = new Map();
    const result = merge({ m: map }, { m: { k: 1 } } as any);
    expect(result.m).toBe(map);
    expect((result.m as any).k).toBe(1);
  });

  test('should still replace an array destination with a plain object source', () => {
    expect(merge({ arr: [1] }, { arr: { x: 1 } } as any)).toEqual({ arr: { x: 1 } });
  });

  test('should assign a Date source over a Date destination', () => {
    const later = new Date(2000, 0, 2);
    expect(merge({ d: new Date(2000, 0, 1) }, { d: later }).d).toBe(later);
  });
});
