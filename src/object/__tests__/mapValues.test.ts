import { mapValues, mapKeys } from '../mapValues.js';

describe('mapValues', () => {
  const users = {
    fred: { user: 'fred', age: 40 },
    pebbles: { user: 'pebbles', age: 1 },
  };

  test('should map values using a function iteratee', () => {
    expect(mapValues(users, o => o.age)).toEqual({ fred: 40, pebbles: 1 });
  });

  test('should support the property-name iteratee shorthand', () => {
    expect(mapValues(users, 'age')).toEqual({ fred: 40, pebbles: 1 });
    expect(mapValues(users, 'user')).toEqual({ fred: 'fred', pebbles: 'pebbles' });
  });

  test('should invoke the iteratee with (value, key, object)', () => {
    const object = { a: 1, b: 2 };
    const iteratee = jest.fn((value: number, key: string) => `${key}:${value}`);

    expect(mapValues(object, iteratee)).toEqual({ a: 'a:1', b: 'b:2' });
    expect(iteratee).toHaveBeenCalledTimes(2);
    expect(iteratee).toHaveBeenNthCalledWith(1, 1, 'a', object);
    expect(iteratee).toHaveBeenNthCalledWith(2, 2, 'b', object);
  });

  test('should map to undefined with the property shorthand when the value is not an object', () => {
    const object: Record<string, any> = { a: 1, b: 'x', c: null, d: { age: 3 } };
    const result = mapValues(object, 'age');

    expect(result).toStrictEqual({ a: undefined, b: undefined, c: undefined, d: 3 });
    expect(Object.keys(result)).toEqual(['a', 'b', 'c', 'd']);
  });

  test('should return undefined for a missing property with the shorthand', () => {
    expect(mapValues({ a: { x: 1 } }, 'missing')).toStrictEqual({ a: undefined });
  });

  test('should skip inherited properties', () => {
    function Foo(this: any) {
      this.a = 1;
    }
    Foo.prototype.b = 2;

    const result = mapValues(new (Foo as any)(), (value: number) => value * 10);
    expect(result).toEqual({ a: 10 });
    expect('b' in result).toBe(false);
  });

  test('should return a new object without mutating the input', () => {
    const object = { a: 1, b: 2 };
    const result = mapValues(object, value => value + 1);

    expect(result).not.toBe(object);
    expect(result).toEqual({ a: 2, b: 3 });
    expect(object).toEqual({ a: 1, b: 2 });
  });

  test('should return an empty object for an empty object', () => {
    expect(mapValues({}, value => value)).toEqual({});
  });

  test('should return an empty object for non-object input', () => {
    expect(mapValues(null as any, value => value)).toEqual({});
    expect(mapValues(undefined as any, value => value)).toEqual({});
    expect(mapValues(42 as any, value => value)).toEqual({});
    expect(mapValues('str' as any, value => value)).toEqual({});
  });
});

describe('mapKeys', () => {
  test('should map keys using the iteratee', () => {
    expect(mapKeys({ a: 1, b: 2 }, (value, key) => key + value)).toEqual({ a1: 1, b2: 2 });
  });

  test('should invoke the iteratee with (value, key, object)', () => {
    const object = { a: 1, b: 2 };
    const iteratee = jest.fn((value: number, key: string) => key.toUpperCase());

    expect(mapKeys(object, iteratee)).toEqual({ A: 1, B: 2 });
    expect(iteratee).toHaveBeenCalledTimes(2);
    expect(iteratee).toHaveBeenNthCalledWith(1, 1, 'a', object);
    expect(iteratee).toHaveBeenNthCalledWith(2, 2, 'b', object);
  });

  test('should keep the original values by reference', () => {
    const value = { nested: true };
    const result = mapKeys({ a: value }, () => 'b');

    expect(result.b).toBe(value);
  });

  test('should let later keys overwrite earlier ones on collision', () => {
    expect(mapKeys({ a: 1, b: 2 }, () => 'same')).toEqual({ same: 2 });
  });

  test('should skip inherited properties', () => {
    function Foo(this: any) {
      this.a = 1;
    }
    Foo.prototype.b = 2;

    const result = mapKeys(new (Foo as any)(), (_value: number, key: string) => `${key}!`);
    expect(result).toEqual({ 'a!': 1 });
    expect('b!' in result).toBe(false);
  });

  test('should return a new object without mutating the input', () => {
    const object = { a: 1 };
    const result = mapKeys(object, (_value, key) => `${key}${key}`);

    expect(result).not.toBe(object);
    expect(result).toEqual({ aa: 1 });
    expect(object).toEqual({ a: 1 });
  });

  test('should return an empty object for an empty object', () => {
    expect(mapKeys({}, (_value, key) => key)).toEqual({});
  });

  test('should return an empty object for non-object input', () => {
    expect(mapKeys(null as any, (_value, key) => key)).toEqual({});
    expect(mapKeys(undefined as any, (_value, key) => key)).toEqual({});
    expect(mapKeys(42 as any, (_value, key) => key)).toEqual({});
  });
});
