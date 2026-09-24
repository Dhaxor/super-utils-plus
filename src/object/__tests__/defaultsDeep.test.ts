import { defaults, defaultsDeep } from '../default.js';

const snapshot = <T>(value: T): T => JSON.parse(JSON.stringify(value));

describe('defaultsDeep', () => {
  test('should assign nested defaults (JSDoc example)', () => {
    const object: Record<string, any> = { a: { b: 2 } };
    expect(defaultsDeep(object, { a: { b: 1, c: 3 } })).toEqual({ a: { b: 2, c: 3 } });
  });

  test('should assign defaults at multiple nesting levels', () => {
    const object: Record<string, any> = { a: { b: { c: 1 } }, x: 1 };
    const source = { a: { b: { c: 2, d: 3 }, e: 4 }, x: 9, y: 5 };

    expect(defaultsDeep(object, source)).toEqual({
      a: { b: { c: 1, d: 3 }, e: 4 },
      x: 1,
      y: 5,
    });
  });

  test('should not mutate the input object or its nested objects', () => {
    const inner = { b: 2 };
    const object: Record<string, any> = { a: inner, list: [1] };
    const before = snapshot(object);
    const innerBefore = snapshot(inner);

    const result = defaultsDeep(object, { a: { c: 3 }, d: 4, list: [1, 2] });

    expect(object).toEqual(before);
    expect(inner).toEqual(innerBefore);
    expect(object.a).toBe(inner);
    expect(result).not.toBe(object);
    expect(result.a).not.toBe(inner);
    expect(result).toEqual({ a: { b: 2, c: 3 }, list: [1], d: 4 });
  });

  test('should not mutate the source objects', () => {
    const source = { a: { b: 1 }, c: [1] };
    const before = snapshot(source);

    defaultsDeep({ a: { d: 2 } } as Record<string, any>, source);

    expect(source).toEqual(before);
  });

  test('should clone values copied from sources', () => {
    const source = { a: { b: [1, { c: 2 }] }, d: new Date(2020, 0, 1) };
    const result = defaultsDeep({} as Record<string, any>, source);

    expect(result).toEqual(source);
    expect(result.a).not.toBe(source.a);
    expect(result.a.b).not.toBe(source.a.b);
    expect(result.a.b[1]).not.toBe(source.a.b[1]);
    expect(result.d).not.toBe(source.d);

    result.a.b[1].c = 99;
    result.a.b.push(3);
    result.a.extra = true;

    expect(source.a).toEqual({ b: [1, { c: 2 }] });
  });

  test('should keep null values in the target, like defaults and Lodash', () => {
    const object: Record<string, any> = { a: null, b: { c: null } };

    expect(defaultsDeep(object, { a: 1, b: { c: 2 } })).toEqual({ a: null, b: { c: null } });
  });

  test('should treat undefined values in the target as missing', () => {
    const object: Record<string, any> = { a: undefined, b: { c: undefined } };

    expect(defaultsDeep(object, { a: 1, b: { c: 2 } })).toEqual({ a: 1, b: { c: 2 } });
  });

  test('should keep falsy but defined target values', () => {
    const object: Record<string, any> = { a: 0, b: '', c: false };

    expect(defaultsDeep(object, { a: 1, b: 'x', c: true })).toEqual({ a: 0, b: '', c: false });
  });

  test('should keep existing values when only one side is an object', () => {
    expect(defaultsDeep({ a: 1 } as Record<string, any>, { a: { b: 2 } })).toEqual({ a: 1 });
    expect(defaultsDeep({ a: { b: 1 } } as Record<string, any>, { a: 5 })).toEqual({
      a: { b: 1 },
    });
  });

  test('should not recurse into arrays', () => {
    expect(defaultsDeep({ a: [1] } as Record<string, any>, { a: [1, 2, 3] })).toEqual({
      a: [1],
    });
  });

  test('should apply multiple sources from left to right, first value wins', () => {
    const result = defaultsDeep(
      {} as Record<string, any>,
      { a: 1, n: { x: 1 } },
      { a: 2, b: 2, n: { x: 2, y: 2 } },
      { b: 3, c: 3, n: { z: 3 } }
    );

    expect(result).toEqual({ a: 1, b: 2, c: 3, n: { x: 1, y: 2, z: 3 } });
  });

  test('should include inherited source properties like defaults', () => {
    function Foo(this: any) {
      this.a = 1;
    }
    Foo.prototype.b = 2;

    expect(defaultsDeep({} as Record<string, any>, new (Foo as any)())).toEqual({ a: 1, b: 2 });
  });

  test('should ignore non-object sources', () => {
    expect(
      defaultsDeep({ a: 1 } as Record<string, any>, null as any, undefined as any, 5 as any)
    ).toEqual({ a: 1 });
  });

  test('should return non-object input as-is', () => {
    expect(defaultsDeep(null as any, { a: 1 })).toBeNull();
    expect(defaultsDeep(undefined as any, { a: 1 })).toBeUndefined();
    expect(defaultsDeep(42 as any, { a: 1 })).toBe(42);
  });

  test('should ignore __proto__ keys in sources', () => {
    const result: any = defaultsDeep({}, JSON.parse('{"__proto__": {"polluted": true}}'));

    expect(({} as any).polluted).toBeUndefined();
    expect(result.polluted).toBeUndefined();
    expect(Object.keys(result)).toEqual([]);
  });

  test('should ignore constructor.prototype keys in sources', () => {
    const result: any = defaultsDeep(
      {},
      JSON.parse('{"constructor": {"prototype": {"polluted": true}}}')
    );

    expect(({} as any).polluted).toBeUndefined();
    expect(result.polluted).toBeUndefined();
    expect(Object.keys(result)).toEqual([]);
  });

  test('should ignore unsafe keys in nested sources', () => {
    const result: any = defaultsDeep(
      { a: {} } as Record<string, any>,
      JSON.parse('{"a": {"__proto__": {"polluted": true}, "safe": 1}}')
    );

    expect(({} as any).polluted).toBeUndefined();
    expect(result.a).toEqual({ safe: 1 });
    expect(Object.keys(result.a)).toEqual(['safe']);
  });
});

describe('defaults', () => {
  test('should assign defaults from left to right (JSDoc example)', () => {
    expect(defaults({ a: 1 } as Record<string, any>, { b: 2 }, { a: 3 })).toEqual({
      a: 1,
      b: 2,
    });
  });

  test('should not mutate the input object', () => {
    const object: Record<string, any> = { a: 1 };
    const result = defaults(object, { b: 2 });

    expect(result).not.toBe(object);
    expect(object).toEqual({ a: 1 });
  });

  test('should include inherited source properties', () => {
    function Foo(this: any) {
      this.a = 1;
    }
    Foo.prototype.b = 2;

    expect(defaults({} as Record<string, any>, new (Foo as any)())).toEqual({ a: 1, b: 2 });
  });

  test('should ignore non-object sources', () => {
    expect(defaults({ a: 1 } as Record<string, any>, null as any, 5 as any)).toEqual({ a: 1 });
  });

  test('should return non-object input as-is', () => {
    expect(defaults(null as any, { a: 1 })).toBeNull();
    expect(defaults(42 as any, { a: 1 })).toBe(42);
  });

  test('should ignore __proto__ keys in sources', () => {
    const result: any = defaults({}, JSON.parse('{"__proto__": {"polluted": true}}'));

    expect(({} as any).polluted).toBeUndefined();
    expect(result.polluted).toBeUndefined();
    expect(Object.keys(result)).toEqual([]);
  });
});
