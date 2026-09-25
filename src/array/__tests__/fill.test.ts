import { fill } from '../fill.js';

describe('fill', () => {
  test('should fill the entire array by default', () => {
    expect(fill([1, 2, 3], 'a')).toEqual(['a', 'a', 'a']);
  });

  test('should fill a sparse array created with Array(n)', () => {
    expect(fill(Array(3), 2)).toEqual([2, 2, 2]);
  });

  test('should fill from start up to, but not including, end', () => {
    expect(fill([4, 6, 8, 10], '*', 1, 3)).toEqual([4, '*', '*', 10]);
  });

  test('should fill to the end when end is omitted', () => {
    expect(fill([1, 2, 3, 4], 0, 2)).toEqual([1, 2, 0, 0]);
  });

  test('should support negative start and end', () => {
    expect(fill([1, 2, 3, 4], '*', -2)).toEqual([1, 2, '*', '*']);
    expect(fill([1, 2, 3, 4], '*', 1, -1)).toEqual([1, '*', '*', 4]);
  });

  test('should return an unchanged copy when the range is empty', () => {
    expect(fill([1, 2, 3], '*', 2, 1)).toEqual([1, 2, 3]);
    expect(fill([1, 2, 3], '*', 5)).toEqual([1, 2, 3]);
    expect(fill([1, 2, 3], '*', 0, 0)).toEqual([1, 2, 3]);
  });

  test('should clamp end to the array length', () => {
    expect(fill([1, 2, 3], '*', 1, 10)).toEqual([1, '*', '*']);
  });

  test('should not mutate the input array', () => {
    const array = [1, 2, 3];
    const result = fill(array, 'a');
    expect(array).toEqual([1, 2, 3]);
    expect(result).not.toBe(array);
  });

  test('should fill every slot with the same reference for object values', () => {
    const value = { a: 1 };
    const result = fill([1, 2], value);
    expect(result[0]).toBe(value);
    expect(result[1]).toBe(value);
  });

  test('should handle edge cases', () => {
    expect(fill([], 'a')).toEqual([]);
    expect(fill(null as any, 'a')).toEqual([]);
    expect(fill(undefined as any, 'a')).toEqual([]);
  });
});
