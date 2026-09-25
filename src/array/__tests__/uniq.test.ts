import { uniq, uniqDeep, uniqBy } from '../uniq.js';

describe('uniq', () => {
  test('should remove duplicate values', () => {
    expect(uniq([2, 1, 2])).toEqual([2, 1]);
  });

  test('should keep the first occurrence and preserve order', () => {
    expect(uniq([3, 1, 3, 2, 1, 3])).toEqual([3, 1, 2]);
  });

  test('should treat NaN values as equal', () => {
    expect(uniq([NaN, NaN])).toEqual([NaN]);
    expect(uniq([1, NaN, 2, NaN])).toEqual([1, NaN, 2]);
  });

  test('should treat 0 and -0 as equal', () => {
    expect(uniq([0, -0])).toEqual([0]);
  });

  test('should not coerce types', () => {
    expect(uniq([1, '1', true, 'true'])).toEqual([1, '1', true, 'true']);
  });

  test('should compare objects by reference', () => {
    const a = { x: 1 };
    expect(uniq([a, a, { x: 1 }])).toEqual([a, { x: 1 }]);
  });

  test('should preserve falsy values', () => {
    expect(uniq([null, undefined, null, 0, '', false, undefined])).toEqual([
      null,
      undefined,
      0,
      '',
      false,
    ]);
  });

  test('should return a copy of an already unique array', () => {
    const array = [1, 2, 3];
    const result = uniq(array);
    expect(result).toEqual([1, 2, 3]);
    expect(result).not.toBe(array);
    expect(array).toEqual([1, 2, 3]);
  });

  test('should handle edge cases', () => {
    expect(uniq([])).toEqual([]);
    expect(uniq(null as any)).toEqual([]);
    expect(uniq(undefined as any)).toEqual([]);
  });
});

describe('uniqDeep', () => {
  test('should remove deeply equal duplicates', () => {
    expect(uniqDeep([{ x: 1 }, { x: 2 }, { x: 1 }])).toEqual([{ x: 1 }, { x: 2 }]);
  });

  test('should keep the first occurrence', () => {
    const a = { x: 1 };
    const b = { x: 1 };
    const result = uniqDeep([a, b]);
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(a);
  });

  test('should compare nested structures', () => {
    expect(
      uniqDeep([
        [1, [2]],
        [1, [2]],
        [1, [3]],
      ])
    ).toEqual([
      [1, [2]],
      [1, [3]],
    ]);
    expect(uniqDeep([{ a: { b: 1 } }, { a: { b: 1 } }, { a: { b: 2 } }])).toEqual([
      { a: { b: 1 } },
      { a: { b: 2 } },
    ]);
  });

  test('should distinguish objects with different keys', () => {
    expect(uniqDeep([{ x: 1 }, { x: 1, y: 2 }, { y: 2 }])).toEqual([
      { x: 1 },
      { x: 1, y: 2 },
      { y: 2 },
    ]);
  });

  test('should work with primitives and NaN', () => {
    expect(uniqDeep([1, '1', NaN, NaN, 1])).toEqual([1, '1', NaN]);
  });

  test('should not mutate the input array', () => {
    const array = [{ x: 1 }, { x: 1 }];
    uniqDeep(array);
    expect(array).toEqual([{ x: 1 }, { x: 1 }]);
  });

  test('should handle edge cases', () => {
    expect(uniqDeep([])).toEqual([]);
    expect(uniqDeep(null as any)).toEqual([]);
    expect(uniqDeep(undefined as any)).toEqual([]);
  });
});

describe('uniqBy', () => {
  test('should use a function iteratee to derive comparison keys', () => {
    expect(uniqBy([2.1, 1.2, 2.3], Math.floor)).toEqual([2.1, 1.2]);
  });

  test('should use a property name iteratee', () => {
    expect(uniqBy([{ x: 1 }, { x: 2 }, { x: 1 }], 'x')).toEqual([{ x: 1 }, { x: 2 }]);
  });

  test('should keep the first occurrence of each key', () => {
    const users = [
      { id: 1, name: 'a' },
      { id: 2, name: 'b' },
      { id: 1, name: 'c' },
    ];
    const result = uniqBy(users, 'id');
    expect(result).toEqual([users[0], users[1]]);
    expect(result[0]).toBe(users[0]);
  });

  test('should compare keys with SameValueZero', () => {
    expect(uniqBy([{ x: NaN }, { x: NaN }, { x: 0 }, { x: -0 }], 'x')).toEqual([
      { x: NaN },
      { x: 0 },
    ]);
  });

  test('should treat nil elements and missing properties as an undefined key', () => {
    expect(uniqBy([null, undefined, {}, { x: 1 }] as any[], 'x')).toEqual([null, { x: 1 }]);
  });

  test('should pass only the element to a function iteratee', () => {
    const iteratee = jest.fn((value: number) => value % 2);
    expect(uniqBy([1, 2, 3, 4], iteratee)).toEqual([1, 2]);
    expect(iteratee).toHaveBeenCalledTimes(4);
    expect(iteratee).toHaveBeenNthCalledWith(1, 1);
    expect(iteratee).toHaveBeenNthCalledWith(4, 4);
  });

  test('should not mutate the input array', () => {
    const array = [1.1, 1.2];
    uniqBy(array, Math.floor);
    expect(array).toEqual([1.1, 1.2]);
  });

  test('should handle edge cases', () => {
    expect(uniqBy([], Math.floor)).toEqual([]);
    expect(uniqBy(null as any, 'x')).toEqual([]);
    expect(uniqBy(undefined as any, Math.floor)).toEqual([]);
  });
});
