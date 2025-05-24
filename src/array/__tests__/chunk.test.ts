import { chunk } from '../chunk';

describe('chunk', () => {
  test('should create chunks of the specified size', () => {
    expect(chunk([1, 2, 3, 4], 2)).toEqual([[1, 2], [3, 4]]);
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  test('should handle edge cases', () => {
    expect(chunk([], 2)).toEqual([]);
    expect(chunk([1, 2, 3], 0)).toEqual([[1], [2], [3]]);
    expect(chunk([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
    expect(chunk([1, 2, 3], 5)).toEqual([[1, 2, 3]]);
  });

  test('should use a default size of 1', () => {
    expect(chunk([1, 2, 3])).toEqual([[1], [2], [3]]);
  });
});