import { slice } from '../slice.js';

describe('slice', () => {
  const array = [1, 2, 3, 4];

  test('should slice from start up to, but not including, end', () => {
    expect(slice(array, 1, 3)).toEqual([2, 3]);
  });

  test('should slice to the end when end is omitted', () => {
    expect(slice(array, 2)).toEqual([3, 4]);
    expect(slice(array, 0)).toEqual([1, 2, 3, 4]);
  });

  test('should return a shallow copy when no positions are given', () => {
    const result = slice(array);
    expect(result).toEqual([1, 2, 3, 4]);
    expect(result).not.toBe(array);
  });

  test('should support a negative start', () => {
    expect(slice(array, -2)).toEqual([3, 4]);
    expect(slice(array, -10)).toEqual([1, 2, 3, 4]);
  });

  test('should support a negative end', () => {
    expect(slice(array, 0, -1)).toEqual([1, 2, 3]);
    expect(slice(array, 1, -1)).toEqual([2, 3]);
    expect(slice(array, -3, -1)).toEqual([2, 3]);
  });

  test('should return an empty array when start is not before end', () => {
    expect(slice(array, 3, 1)).toEqual([]);
    expect(slice(array, 2, 2)).toEqual([]);
    expect(slice(array, 10)).toEqual([]);
    expect(slice(array, -1, -3)).toEqual([]);
  });

  test('should clamp end to the array length', () => {
    expect(slice(array, 2, 100)).toEqual([3, 4]);
  });

  test('should not mutate the input array', () => {
    slice(array, 1, 3);
    expect(array).toEqual([1, 2, 3, 4]);
  });

  test('should copy object references', () => {
    const obj = { a: 1 };
    expect(slice([obj])[0]).toBe(obj);
  });

  test('should handle empty input', () => {
    expect(slice([])).toEqual([]);
    expect(slice([], 0, 1)).toEqual([]);
  });

  test('should handle null and undefined', () => {
    expect(slice(null as any, 0, 1)).toEqual([]);
    expect(slice(undefined as any)).toEqual([]);
  });
});
