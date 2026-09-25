import { omit, omitBy } from '../omit.js';

describe('omit', () => {
  test('should omit the given properties', () => {
    const object = { a: 1, b: 2, c: 3 };
    expect(omit(object, ['a', 'c'])).toEqual({ b: 2 });
  });

  test('should ignore keys that are not present', () => {
    expect(omit({ a: 1, b: 2 }, ['x', 'y'])).toEqual({ a: 1, b: 2 });
  });

  test('should return a shallow copy when no paths are given', () => {
    const object = { a: 1, b: { c: 2 } };
    const result = omit(object, []);

    expect(result).toEqual(object);
    expect(result).not.toBe(object);
    expect(result.b).toBe(object.b);
  });

  test('should return an empty object when every key is omitted', () => {
    expect(omit({ a: 1, b: 2 }, ['a', 'b'])).toEqual({});
  });

  test('should coerce numeric paths to strings', () => {
    expect(omit({ 1: 'one', 2: 'two' }, [1])).toEqual({ 2: 'two' });
  });

  test('should only include own properties', () => {
    function Foo(this: any) {
      this.a = 1;
      this.b = 2;
    }
    Foo.prototype.c = 3;

    const result = omit(new (Foo as any)(), ['a']);
    expect(result).toEqual({ b: 2 });
    expect('c' in result).toBe(false);
  });

  test('should not mutate the input object', () => {
    const object = { a: 1, b: 2 };
    omit(object, ['a']);
    expect(object).toEqual({ a: 1, b: 2 });
  });

  test('should return an empty object for null and undefined', () => {
    expect(omit(null as any, ['a'])).toEqual({});
    expect(omit(undefined as any, ['a'])).toEqual({});
  });
});

describe('omitBy', () => {
  test('should omit properties the predicate returns truthy for', () => {
    const object = { a: 1, b: 2, c: 3 };
    expect(omitBy(object, value => value >= 2)).toEqual({ a: 1 });
  });

  test('should invoke the predicate with (value, key)', () => {
    const object = { a: 1, b: 2 };
    const predicate = jest.fn((value: number, key: string) => key === 'b' && value === 2);

    expect(omitBy(object, predicate)).toEqual({ a: 1 });
    expect(predicate).toHaveBeenCalledTimes(2);
    expect(predicate).toHaveBeenNthCalledWith(1, 1, 'a');
    expect(predicate).toHaveBeenNthCalledWith(2, 2, 'b');
  });

  test('should keep every property when the predicate is always falsy', () => {
    const object = { a: 1, b: 2 };
    const result = omitBy(object, () => false);

    expect(result).toEqual(object);
    expect(result).not.toBe(object);
  });

  test('should return an empty object when the predicate is always truthy', () => {
    expect(omitBy({ a: 1, b: 2 }, () => true)).toEqual({});
  });

  test('should skip inherited properties', () => {
    function Foo(this: any) {
      this.a = 1;
    }
    Foo.prototype.b = 2;

    const result = omitBy(new (Foo as any)(), () => false);
    expect(result).toEqual({ a: 1 });
    expect('b' in result).toBe(false);
  });

  test('should not mutate the input object', () => {
    const object = { a: 1, b: 2 };
    omitBy(object, value => value === 1);
    expect(object).toEqual({ a: 1, b: 2 });
  });

  test('should return an empty object for null and undefined', () => {
    expect(omitBy(null as any, () => false)).toEqual({});
    expect(omitBy(undefined as any, () => false)).toEqual({});
  });
});
