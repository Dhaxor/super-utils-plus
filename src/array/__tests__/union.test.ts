import { union, unionDeep, unionBy } from '../union.js';

describe('union', () => {
  test('should return unique values from all arrays in order', () => {
    expect(union([2], [1, 2])).toEqual([2, 1]);
  });

  test('should work with more than two arrays', () => {
    expect(union([1, 2], [2, 3], [3, 4, 1])).toEqual([1, 2, 3, 4]);
  });

  test('should dedupe a single array', () => {
    expect(union([1, 1, 2, 1])).toEqual([1, 2]);
  });

  test('should keep the first occurrence of duplicates', () => {
    const a = { x: 1 };
    const b = { x: 1 };
    const result = union([a], [b, a]);
    expect(result).toHaveLength(2);
    expect(result[0]).toBe(a);
    expect(result[1]).toBe(b);
  });

  test('should use SameValueZero for comparisons', () => {
    expect(union([NaN], [NaN, 1])).toEqual([NaN, 1]);
    expect(union([0], [-0])).toEqual([0]);
  });

  test('should preserve falsy values', () => {
    expect(union<unknown>([0, ''], [null, undefined, false, 0])).toEqual([
      0,
      '',
      null,
      undefined,
      false,
    ]);
  });

  test('should not mutate the input arrays', () => {
    const a = [1, 2];
    const b = [2, 3];
    union(a, b);
    expect(a).toEqual([1, 2]);
    expect(b).toEqual([2, 3]);
  });

  test('should return an empty array when called with no arrays', () => {
    expect(union()).toEqual([]);
  });

  test('should handle empty arrays', () => {
    expect(union([], [])).toEqual([]);
    expect(union([], [1], [])).toEqual([1]);
  });
});

describe('unionDeep', () => {
  test('should return deeply unique values from all arrays', () => {
    expect(unionDeep([{ x: 1 }], [{ x: 1 }, { x: 2 }])).toEqual([{ x: 1 }, { x: 2 }]);
  });

  test('should work with nested structures and more than two arrays', () => {
    expect(unionDeep([[1, [2]]], [[1, [2]], [3]], [[3], [4]])).toEqual([[1, [2]], [3], [4]]);
    expect(unionDeep([{ a: { b: 1 } }], [{ a: { b: 1 } }, { a: { b: 2 } }])).toEqual([
      { a: { b: 1 } },
      { a: { b: 2 } },
    ]);
  });

  test('should keep the first occurrence', () => {
    const a = { x: 1 };
    const result = unionDeep([a], [{ x: 1 }]);
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(a);
  });

  test('should work with primitives and NaN', () => {
    expect(unionDeep([1, NaN, 'a'], [NaN, 2, 'a'])).toEqual([1, NaN, 'a', 2]);
  });

  test('should dedupe a single array', () => {
    expect(unionDeep([{ x: 1 }, { x: 2 }, { x: 1 }])).toEqual([{ x: 1 }, { x: 2 }]);
  });

  test('should return an empty array when called with no arrays', () => {
    expect(unionDeep()).toEqual([]);
  });

  test('should handle empty arrays', () => {
    expect(unionDeep([], [])).toEqual([]);
    expect(unionDeep([], [{ x: 1 }], [])).toEqual([{ x: 1 }]);
  });
});

describe('unionBy', () => {
  test('should use a function iteratee to derive comparison keys', () => {
    expect(unionBy([2.1], [1.2, 2.3], Math.floor)).toEqual([2.1, 1.2]);
  });

  test('should use a property name iteratee', () => {
    expect(unionBy([{ x: 1 }], [{ x: 2 }, { x: 1 }], 'x')).toEqual([{ x: 1 }, { x: 2 }]);
  });

  test('should work with more than two arrays', () => {
    expect(unionBy([1.1], [2.2, 1.5], [3.3, 2.9], Math.floor)).toEqual([1.1, 2.2, 3.3]);
  });

  test('should keep the first occurrence of each key', () => {
    const a = { x: 1, tag: 'first' };
    const b = { x: 1, tag: 'second' };
    const result = unionBy([a], [b], 'x');
    expect(result).toEqual([a]);
    expect(result[0]).toBe(a);
  });

  test('should dedupe a single array', () => {
    expect(unionBy([2.1, 2.5, 1.2], Math.floor)).toEqual([2.1, 1.2]);
  });

  test('should compare keys with SameValueZero', () => {
    expect(unionBy([{ x: NaN }], [{ x: NaN }, { x: 0 }], [{ x: -0 }], 'x')).toEqual([
      { x: NaN },
      { x: 0 },
    ]);
  });

  test('should pass only the element to a function iteratee', () => {
    const iteratee = jest.fn((value: number) => Math.floor(value));
    unionBy([1.5], [2.5], iteratee);
    expect(iteratee).toHaveBeenCalledTimes(2);
    expect(iteratee).toHaveBeenNthCalledWith(1, 1.5);
    expect(iteratee).toHaveBeenNthCalledWith(2, 2.5);
  });

  test('should return an empty array when only an iteratee is given', () => {
    expect(unionBy(Math.floor)).toEqual([]);
    expect((unionBy as any)()).toEqual([]);
  });

  test('should handle empty arrays', () => {
    expect(unionBy([], [], Math.floor)).toEqual([]);
    expect(unionBy([], [1.5], Math.floor)).toEqual([1.5]);
  });
});
