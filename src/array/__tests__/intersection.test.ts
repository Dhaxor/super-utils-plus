import { intersection, intersectionDeep, intersectionBy } from '../intersection.js';

describe('intersection', () => {
  test('should return values included in all given arrays', () => {
    expect(intersection([2, 1], [2, 3])).toEqual([2]);
  });

  test('should work with more than two arrays', () => {
    expect(intersection([1, 2, 3, 4], [2, 3, 4, 5], [3, 4, 5, 6])).toEqual([3, 4]);
    expect(intersection([1, 2], [2, 3], [3, 4])).toEqual([]);
  });

  test('should order results by the first array', () => {
    expect(intersection([3, 2, 1], [1, 2, 3])).toEqual([3, 2, 1]);
  });

  test('should return unique values', () => {
    expect(intersection([1, 1, 2, 2], [1, 2, 2])).toEqual([1, 2]);
  });

  test('should dedupe a single array', () => {
    expect(intersection([1, 2, 2, 3, 1])).toEqual([1, 2, 3]);
  });

  test('should return an empty array when called with no arrays', () => {
    expect(intersection()).toEqual([]);
  });

  test('should use SameValueZero for comparisons', () => {
    expect(intersection([NaN, 1], [NaN, 2])).toEqual([NaN]);
    expect(intersection([0], [-0])).toEqual([0]);
  });

  test('should compare objects by reference', () => {
    const a = { x: 1 };
    expect(intersection([a, { x: 2 }], [a, { x: 2 }])).toEqual([a]);
    expect(intersection([{ x: 1 }], [{ x: 1 }])).toEqual([]);
  });

  test('should not mutate the input arrays', () => {
    const a = [1, 2, 2];
    const b = [2, 3];
    intersection(a, b);
    expect(a).toEqual([1, 2, 2]);
    expect(b).toEqual([2, 3]);
  });

  test('should return an empty array when any array is empty', () => {
    expect(intersection([], [1, 2])).toEqual([]);
    expect(intersection([1, 2], [])).toEqual([]);
    expect(intersection([])).toEqual([]);
  });
});

describe('intersectionDeep', () => {
  test('should return deeply equal values included in all arrays', () => {
    expect(intersectionDeep([{ x: 1 }, { x: 2 }], [{ x: 1 }, { x: 3 }])).toEqual([{ x: 1 }]);
  });

  test('should work with more than two arrays and nested structures', () => {
    expect(intersectionDeep([[1, [2]], [3]], [[1, [2]], [4]], [[5], [1, [2]]])).toEqual([[1, [2]]]);
    expect(intersectionDeep([{ a: { b: 1 } }], [{ a: { b: 1 } }], [{ a: { b: 2 } }])).toEqual([]);
  });

  test('should order results by the first array and dedupe', () => {
    expect(intersectionDeep([{ x: 2 }, { x: 1 }, { x: 2 }], [{ x: 1 }, { x: 2 }])).toEqual([
      { x: 2 },
      { x: 1 },
    ]);
  });

  test('should dedupe a single array', () => {
    expect(intersectionDeep([{ x: 1 }, { x: 1 }, { x: 2 }])).toEqual([{ x: 1 }, { x: 2 }]);
  });

  test('should return the elements of the first array', () => {
    const a = { x: 1 };
    const result = intersectionDeep([a], [{ x: 1 }]);
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(a);
  });

  test('should work with primitives and NaN', () => {
    expect(intersectionDeep([1, NaN, 'a', 2], [NaN, 'a', 3])).toEqual([NaN, 'a']);
  });

  test('should return an empty array when called with no arrays', () => {
    expect(intersectionDeep()).toEqual([]);
  });

  test('should return an empty array when any array is empty', () => {
    expect(intersectionDeep([], [{ x: 1 }])).toEqual([]);
    expect(intersectionDeep([{ x: 1 }], [])).toEqual([]);
    expect(intersectionDeep([])).toEqual([]);
  });
});

describe('intersectionBy', () => {
  test('should use a function iteratee to derive comparison keys', () => {
    expect(intersectionBy([2.1, 1.2], [2.3, 3.4], Math.floor)).toEqual([2.1]);
  });

  test('should use a property name iteratee', () => {
    expect(intersectionBy([{ x: 1 }], [{ x: 2 }, { x: 1 }], 'x')).toEqual([{ x: 1 }]);
  });

  test('should work with more than two arrays', () => {
    expect(intersectionBy([1.1, 2.2, 3.3], [2.5, 3.5], [3.9, 1.9], Math.floor)).toEqual([3.3]);
  });

  test('should order results by the first array and return its elements', () => {
    const a = { x: 2 };
    const b = { x: 1 };
    const result = intersectionBy([a, b], [{ x: 1 }, { x: 2 }], 'x');
    expect(result).toEqual([{ x: 2 }, { x: 1 }]);
    expect(result[0]).toBe(a);
    expect(result[1]).toBe(b);
  });

  test('should dedupe results by key', () => {
    expect(intersectionBy([2.1, 2.5, 1.2, 1.9], [2.3, 1.1], Math.floor)).toEqual([2.1, 1.2]);
  });

  test('should dedupe a single array', () => {
    expect(intersectionBy([{ x: 1 }, { x: 1 }, { x: 2 }], 'x')).toEqual([{ x: 1 }, { x: 2 }]);
  });

  test('should compare keys with SameValueZero', () => {
    expect(intersectionBy([{ x: NaN }, { x: 1 }], [{ x: NaN }], 'x')).toEqual([{ x: NaN }]);
    expect(intersectionBy([{ x: 0 }], [{ x: -0 }], 'x')).toEqual([{ x: 0 }]);
  });

  test('should pass only the element to a function iteratee', () => {
    const iteratee = jest.fn((value: number) => Math.floor(value));
    intersectionBy([1.5], [1.2], iteratee);
    expect(iteratee).toHaveBeenCalledTimes(2);
    expect(iteratee).toHaveBeenNthCalledWith(1, 1.2);
    expect(iteratee).toHaveBeenNthCalledWith(2, 1.5);
  });

  test('should return an empty array when only an iteratee is given', () => {
    expect(intersectionBy(Math.floor)).toEqual([]);
    expect((intersectionBy as any)()).toEqual([]);
  });

  test('should return an empty array when any array is empty', () => {
    expect(intersectionBy([], [1.1], Math.floor)).toEqual([]);
    expect(intersectionBy([1.1], [], Math.floor)).toEqual([]);
  });
});
