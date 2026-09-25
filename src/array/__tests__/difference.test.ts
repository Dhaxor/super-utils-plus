import { difference, differenceDeep, differenceBy } from '../difference.js';

describe('difference', () => {
  test('should return values not included in the other array', () => {
    expect(difference([2, 1], [2, 3])).toEqual([1]);
  });

  test('should exclude values from multiple arrays', () => {
    expect(difference([1, 2, 3, 4, 5], [1], [3], [5, 6])).toEqual([2, 4]);
  });

  test('should return a copy of the array when no values are given', () => {
    const array = [1, 2, 3];
    const result = difference(array);
    expect(result).toEqual([1, 2, 3]);
    expect(result).not.toBe(array);
  });

  test('should preserve duplicates and order of the inspected array', () => {
    expect(difference([3, 1, 1, 2, 3], [2])).toEqual([3, 1, 1, 3]);
  });

  test('should use SameValueZero for comparisons', () => {
    expect(difference([NaN, 1, 0], [NaN])).toEqual([1, 0]);
    expect(difference([0, 1], [-0])).toEqual([1]);
  });

  test('should compare objects by reference', () => {
    const a = { x: 1 };
    expect(difference([a, { x: 1 }], [a])).toEqual([{ x: 1 }]);
    expect(difference([a], [{ x: 1 }])).toEqual([a]);
  });

  test('should not mutate the input arrays', () => {
    const array = [1, 2, 3];
    const values = [2];
    difference(array, values);
    expect(array).toEqual([1, 2, 3]);
    expect(values).toEqual([2]);
  });

  test('should handle empty arrays', () => {
    expect(difference([], [1, 2])).toEqual([]);
    expect(difference([1, 2], [])).toEqual([1, 2]);
  });

  test('should handle null and undefined', () => {
    expect(difference(null as any, [1])).toEqual([]);
    expect(difference(undefined as any, [1])).toEqual([]);
  });
});

describe('differenceDeep', () => {
  test('should exclude deeply equal values', () => {
    expect(differenceDeep([{ x: 2 }, { x: 1 }], [{ x: 1 }])).toEqual([{ x: 2 }]);
  });

  test('should compare nested structures', () => {
    expect(
      differenceDeep([{ a: { b: [1, 2] } }, { a: { b: [1, 3] } }], [{ a: { b: [1, 2] } }])
    ).toEqual([{ a: { b: [1, 3] } }]);
    expect(differenceDeep([[1, 2], [3]], [[1, 2]])).toEqual([[3]]);
  });

  test('should exclude values from multiple arrays', () => {
    expect(differenceDeep([{ x: 1 }, { x: 2 }, { x: 3 }], [{ x: 1 }], [{ x: 3 }])).toEqual([
      { x: 2 },
    ]);
  });

  test('should work with primitives and NaN', () => {
    expect(differenceDeep([1, 2, NaN, 'a'], [2, NaN])).toEqual([1, 'a']);
  });

  test('should preserve duplicates of the inspected array', () => {
    expect(differenceDeep([{ x: 1 }, { x: 1 }, { x: 2 }], [{ x: 2 }])).toEqual([
      { x: 1 },
      { x: 1 },
    ]);
  });

  test('should return a copy of the array when no values are given', () => {
    const array = [{ x: 1 }];
    const result = differenceDeep(array);
    expect(result).toEqual([{ x: 1 }]);
    expect(result).not.toBe(array);
  });

  test('should handle empty arrays', () => {
    expect(differenceDeep([], [{ x: 1 }])).toEqual([]);
    expect(differenceDeep([{ x: 1 }], [])).toEqual([{ x: 1 }]);
  });

  test('should handle null and undefined', () => {
    expect(differenceDeep(null as any, [{ x: 1 }])).toEqual([]);
    expect(differenceDeep(undefined as any, [{ x: 1 }])).toEqual([]);
  });
});

describe('differenceBy', () => {
  test('should use a function iteratee to derive comparison keys', () => {
    expect(differenceBy([2.1, 1.2], Math.floor, [2.3, 3.4])).toEqual([1.2]);
  });

  test('should use a property name iteratee', () => {
    expect(differenceBy([{ x: 2 }, { x: 1 }], 'x', [{ x: 1 }])).toEqual([{ x: 2 }]);
  });

  test('should exclude values from multiple arrays', () => {
    expect(differenceBy([1.1, 2.2, 3.3, 4.4], Math.floor, [1.5], [3.9])).toEqual([2.2, 4.4]);
  });

  test('should preserve duplicates and order of the inspected array', () => {
    expect(differenceBy([3.1, 1.1, 1.9, 2.5], Math.floor, [2])).toEqual([3.1, 1.1, 1.9]);
  });

  test('should compare keys with SameValueZero', () => {
    expect(differenceBy([{ x: NaN }, { x: 1 }], 'x', [{ x: NaN }])).toEqual([{ x: 1 }]);
  });

  test('should treat nil elements and missing properties as an undefined key', () => {
    expect(differenceBy([null, { x: 1 }, { x: 2 }] as any[], 'x', [undefined])).toEqual([
      { x: 1 },
      { x: 2 },
    ]);
    expect(differenceBy([{ x: 1 }, {}] as any[], 'x', [{ y: 2 }])).toEqual([{ x: 1 }]);
  });

  test('should pass only the element to a function iteratee', () => {
    const iteratee = jest.fn((value: number) => Math.floor(value));
    differenceBy([1.5], iteratee, [2.5]);
    expect(iteratee).toHaveBeenCalledTimes(2);
    expect(iteratee).toHaveBeenNthCalledWith(1, 2.5);
    expect(iteratee).toHaveBeenNthCalledWith(2, 1.5);
  });

  test('should return a copy of the array when no values are given', () => {
    const array = [1.5, 2.5];
    const result = differenceBy(array, Math.floor);
    expect(result).toEqual([1.5, 2.5]);
    expect(result).not.toBe(array);
  });

  test('should handle empty arrays', () => {
    expect(differenceBy([], Math.floor, [1])).toEqual([]);
    expect(differenceBy([1.5], Math.floor, [])).toEqual([1.5]);
  });

  test('should handle null and undefined', () => {
    expect(differenceBy(null as any, Math.floor, [1])).toEqual([]);
    expect(differenceBy(undefined as any, 'x', [{ x: 1 }])).toEqual([]);
  });
});
