import { has, hasIn, hasPath, hasInPath } from '../has.js';

describe('has', () => {
  test('should check if object has a direct property', () => {
    const obj = { a: 1, b: 2 };
    expect(has(obj, 'a')).toBe(true);
    expect(has(obj, 'c')).toBe(false);
  });

  test('should not check for inherited properties', () => {
    function Foo(this: any) {
      this.a = 1;
    }
    Foo.prototype.b = 2;

    const foo = new (Foo as any)();
    expect(has(foo, 'a')).toBe(true);
    expect(has(foo, 'b')).toBe(false);
  });

  test('should handle non-object values', () => {
    expect(has(null as any, 'a')).toBe(false);
    expect(has(undefined as any, 'a')).toBe(false);
    expect(has(42 as any, 'a')).toBe(false);
    expect(has('abc' as any, 'a')).toBe(false);
  });
});

describe('hasIn', () => {
  test('should check if object has a direct property', () => {
    const obj = { a: 1, b: 2 };
    expect(hasIn(obj, 'a')).toBe(true);
    expect(hasIn(obj, 'c')).toBe(false);
  });

  test('should check for inherited properties', () => {
    function Foo(this: any) {
      this.a = 1;
    }
    Foo.prototype.b = 2;

    const foo = new (Foo as any)();
    expect(hasIn(foo, 'a')).toBe(true);
    expect(hasIn(foo, 'b')).toBe(true);
    expect(hasIn(foo, 'c')).toBe(false);
  });

  test('should handle non-object values', () => {
    expect(hasIn(null as any, 'a')).toBe(false);
    expect(hasIn(undefined as any, 'a')).toBe(false);
    expect(hasIn(42 as any, 'a')).toBe(false);
    expect(hasIn('abc' as any, 'a')).toBe(false);
  });
});

describe('hasPath', () => {
  test('should check if path exists using dot notation', () => {
    const obj = { a: { b: { c: 3 } } };
    expect(hasPath(obj, 'a.b.c')).toBe(true);
    expect(hasPath(obj, 'a.b.d')).toBe(false);
    expect(hasPath(obj, 'a.d.c')).toBe(false);
  });

  test('should check if path exists using array notation', () => {
    const obj = { a: { b: { c: 3 } } };
    expect(hasPath(obj, ['a', 'b', 'c'])).toBe(true);
    expect(hasPath(obj, ['a', 'b', 'd'])).toBe(false);
    expect(hasPath(obj, ['a', 'd', 'c'])).toBe(false);
  });

  test('should handle non-object values', () => {
    expect(hasPath(null as any, 'a.b.c')).toBe(false);
    expect(hasPath(undefined as any, 'a.b.c')).toBe(false);
    expect(hasPath(42 as any, 'a.b.c')).toBe(false);
    expect(hasPath('abc' as any, 'a.b.c')).toBe(false);
  });
});

describe('hasInPath', () => {
  test('should check if path exists including inherited properties', () => {
    function Foo(this: any) {
      this.a = { b: 2 };
    }
    Foo.prototype.c = { d: 3 };

    const foo = new (Foo as any)();
    expect(hasInPath(foo, 'a.b')).toBe(true);
    expect(hasInPath(foo, 'c.d')).toBe(true);
    expect(hasInPath(foo, 'a.x')).toBe(false);
    expect(hasInPath(foo, 'c.x')).toBe(false);
  });

  test('should check if path exists using array notation', () => {
    function Foo(this: any) {
      this.a = { b: 2 };
    }
    Foo.prototype.c = { d: 3 };

    const foo = new (Foo as any)();
    expect(hasInPath(foo, ['a', 'b'])).toBe(true);
    expect(hasInPath(foo, ['c', 'd'])).toBe(true);
    expect(hasInPath(foo, ['a', 'x'])).toBe(false);
    expect(hasInPath(foo, ['c', 'x'])).toBe(false);
  });

  test('should handle non-object values', () => {
    expect(hasInPath(null as any, 'a.b')).toBe(false);
    expect(hasInPath(undefined as any, 'a.b')).toBe(false);
    expect(hasInPath(42 as any, 'a.b')).toBe(false);
    expect(hasInPath('abc' as any, 'a.b')).toBe(false);
  });
});
