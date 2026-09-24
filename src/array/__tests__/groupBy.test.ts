import { groupBy } from '../groupBy.js';

describe('groupBy', () => {
  test('should group using a function iteratee', () => {
    expect(groupBy([6.1, 4.2, 6.3], Math.floor)).toEqual({ '4': [4.2], '6': [6.1, 6.3] });
  });

  test('should group using a property name iteratee', () => {
    expect(groupBy(['one', 'two', 'three'], 'length')).toEqual({
      '3': ['one', 'two'],
      '5': ['three'],
    });
  });

  test('should group objects by a property', () => {
    const users = [
      { user: 'barney', active: true },
      { user: 'fred', active: false },
      { user: 'pebbles', active: true },
    ];
    expect(groupBy(users, 'active')).toEqual({
      true: [users[0], users[2]],
      false: [users[1]],
    });
  });

  test('should preserve the original order within each group', () => {
    expect(groupBy([1, 2, 3, 4, 5, 6], n => (n % 2 === 0 ? 'even' : 'odd'))).toEqual({
      odd: [1, 3, 5],
      even: [2, 4, 6],
    });
  });

  test('should stringify keys', () => {
    expect(groupBy([1, 2, 3], n => n > 1)).toEqual({ true: [2, 3], false: [1] });
    expect(groupBy([{ x: undefined }, { x: null }, { x: 1 }], 'x')).toEqual({
      undefined: [{ x: undefined }],
      null: [{ x: null }],
      '1': [{ x: 1 }],
    });
  });

  test('should group nil elements under "undefined" for a property iteratee', () => {
    expect(groupBy([null, undefined, { x: 1 }] as any[], 'x')).toEqual({
      undefined: [null, undefined],
      '1': [{ x: 1 }],
    });
  });

  test('should pass only the element to a function iteratee', () => {
    const iteratee = jest.fn((value: string) => value.length);
    groupBy(['a', 'bb'], iteratee);
    expect(iteratee).toHaveBeenCalledTimes(2);
    expect(iteratee).toHaveBeenNthCalledWith(1, 'a');
    expect(iteratee).toHaveBeenNthCalledWith(2, 'bb');
  });

  test('should handle keys that collide with Object.prototype members', () => {
    const result = groupBy(['constructor', 'hasOwnProperty', 'toString', 'a', 'toString'], v => v);
    expect(Object.keys(result).sort()).toEqual(['a', 'constructor', 'hasOwnProperty', 'toString']);
    expect(result).toHaveProperty('constructor', ['constructor']);
    expect(result).toHaveProperty('hasOwnProperty', ['hasOwnProperty']);
    expect(result).toHaveProperty('toString', ['toString', 'toString']);
    expect(result.a).toEqual(['a']);
  });

  test('should group every element under a "__proto__" key', () => {
    const items = [
      { key: '__proto__', id: 1 },
      { key: 'a', id: 2 },
      { key: '__proto__', id: 3 },
    ];
    const result = groupBy(items, 'key');
    expect(result['__proto__']).toEqual([items[0], items[2]]);
    expect(result.a).toEqual([items[1]]);
  });

  test('should store a "__proto__" key as an own property without changing the prototype', () => {
    const result = groupBy(['__proto__', 'a'], value => value);
    expect(Object.prototype.hasOwnProperty.call(result, '__proto__')).toBe(true);
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    expect(Object.keys(result).sort()).toEqual(['__proto__', 'a']);
  });

  test('should not mutate the input array', () => {
    const array = [1, 2, 3];
    groupBy(array, n => n % 2);
    expect(array).toEqual([1, 2, 3]);
  });

  test('should return an empty object for empty input', () => {
    expect(groupBy([], Math.floor)).toEqual({});
  });

  test('should handle null and undefined', () => {
    expect(groupBy(null as any, 'length')).toEqual({});
    expect(groupBy(undefined as any, Math.floor)).toEqual({});
  });
});
