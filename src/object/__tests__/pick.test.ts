import { pick, pickBy } from '../pick.js';

describe('pick', () => {
  test('should pick the given properties', () => {
    const object = { a: 1, b: 2, c: 3 };
    expect(pick(object, ['a', 'c'])).toEqual({ a: 1, c: 3 });
  });

  test('should ignore keys that are not present', () => {
    expect(pick({ a: 1, b: 2 }, ['a', 'z'])).toEqual({ a: 1 });
    expect(pick({ a: 1 }, ['x', 'y'])).toEqual({});
  });

  test('should return an empty object when no paths are given', () => {
    expect(pick({ a: 1, b: 2 }, [])).toEqual({});
  });

  test('should only pick own properties', () => {
    function Foo(this: any) {
      this.a = 1;
    }
    Foo.prototype.b = 2;

    const result = pick(new (Foo as any)(), ['a', 'b']);
    expect(result).toEqual({ a: 1 });
    expect('b' in result).toBe(false);
  });

  test('should pick properties with falsy values', () => {
    const object = { a: 0, b: undefined, c: null, d: '', e: false };
    const result = pick(object, ['a', 'b', 'c', 'd', 'e']);

    expect(result).toStrictEqual({ a: 0, b: undefined, c: null, d: '', e: false });
    expect(Object.keys(result)).toEqual(['a', 'b', 'c', 'd', 'e']);
  });

  test('should copy values by reference', () => {
    const nested = { x: 1 };
    const result = pick({ a: nested, b: 2 }, ['a']);

    expect(result.a).toBe(nested);
  });

  test('should not mutate the input object', () => {
    const object = { a: 1, b: 2 };
    pick(object, ['a']);
    expect(object).toEqual({ a: 1, b: 2 });
  });

  test('should return an empty object for null and undefined', () => {
    expect(pick(null as any, ['a'])).toEqual({});
    expect(pick(undefined as any, ['a'])).toEqual({});
  });
});

describe('pickBy', () => {
  test('should pick properties the predicate returns truthy for', () => {
    const object = { a: 1, b: 2, c: 3 };
    expect(pickBy(object, value => value < 3)).toEqual({ a: 1, b: 2 });
  });

  test('should invoke the predicate with (value, key)', () => {
    const object = { a: 1, b: 2 };
    const predicate = jest.fn((value: number, key: string) => key === 'b' && value === 2);

    expect(pickBy(object, predicate)).toEqual({ b: 2 });
    expect(predicate).toHaveBeenCalledTimes(2);
    expect(predicate).toHaveBeenNthCalledWith(1, 1, 'a');
    expect(predicate).toHaveBeenNthCalledWith(2, 2, 'b');
  });

  test('should keep every property when the predicate is always truthy', () => {
    const object = { a: 1, b: 2 };
    const result = pickBy(object, () => true);

    expect(result).toEqual(object);
    expect(result).not.toBe(object);
  });

  test('should return an empty object when the predicate is always falsy', () => {
    expect(pickBy({ a: 1, b: 2 }, () => false)).toEqual({});
  });

  test('should skip inherited properties', () => {
    function Foo(this: any) {
      this.a = 1;
    }
    Foo.prototype.b = 2;

    const result = pickBy(new (Foo as any)(), () => true);
    expect(result).toEqual({ a: 1 });
    expect('b' in result).toBe(false);
  });

  test('should not mutate the input object', () => {
    const object = { a: 1, b: 2 };
    pickBy(object, value => value === 1);
    expect(object).toEqual({ a: 1, b: 2 });
  });

  test('should return an empty object for null and undefined', () => {
    expect(pickBy(null as any, () => true)).toEqual({});
    expect(pickBy(undefined as any, () => true)).toEqual({});
  });
});
