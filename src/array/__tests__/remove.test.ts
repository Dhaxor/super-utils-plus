import { remove } from '../remove.js';

describe('remove', () => {
  test('should remove matching elements and return them', () => {
    const array = [1, 2, 3, 4];
    const evens = remove(array, n => n % 2 === 0);
    expect(evens).toEqual([2, 4]);
    expect(array).toEqual([1, 3]);
  });

  test('should mutate the input array in place', () => {
    const array = [1, 2, 3, 4];
    const reference = array;
    remove(array, n => n > 2);
    expect(reference).toBe(array);
    expect(array).toEqual([1, 2]);
    expect(array.length).toBe(2);
  });

  test('should return a new array rather than the input', () => {
    const array = [1, 2, 3];
    const removed = remove(array, () => true);
    expect(removed).not.toBe(array);
  });

  test('should return removed elements in their original order', () => {
    const array = ['a', 'b', 'c', 'd', 'e'];
    expect(remove(array, v => ['e', 'a', 'c'].includes(v))).toEqual(['a', 'c', 'e']);
    expect(array).toEqual(['b', 'd']);
  });

  test('should provide the original index and the array to the predicate', () => {
    const array = [10, 20, 30, 40];
    const seen: [number, number][] = [];
    const removed = remove(array, (value, index, arr) => {
      seen.push([value, index]);
      expect(arr).toBe(array);
      return index % 2 === 0;
    });
    expect(removed).toEqual([10, 30]);
    expect(array).toEqual([20, 40]);
    expect(seen.sort((a, b) => a[1] - b[1])).toEqual([
      [10, 0],
      [20, 1],
      [30, 2],
      [40, 3],
    ]);
  });

  test('should invoke the predicate once per element', () => {
    const predicate = jest.fn(() => false);
    remove([1, 2, 3], predicate);
    expect(predicate).toHaveBeenCalledTimes(3);
  });

  test('should return an empty array and leave the input untouched when nothing matches', () => {
    const array = [1, 2, 3];
    expect(remove(array, () => false)).toEqual([]);
    expect(array).toEqual([1, 2, 3]);
  });

  test('should remove every element when all match', () => {
    const array = [1, 2, 3];
    expect(remove(array, () => true)).toEqual([1, 2, 3]);
    expect(array).toEqual([]);
  });

  test('should remove all occurrences of duplicate values', () => {
    const array = [1, 2, 1, 3, 1];
    expect(remove(array, n => n === 1)).toEqual([1, 1, 1]);
    expect(array).toEqual([2, 3]);
  });

  test('should remove falsy values when the predicate matches them', () => {
    const array = [0, 1, null, 2, undefined];
    expect(remove(array, v => !v)).toEqual([0, null, undefined]);
    expect(array).toEqual([1, 2]);
  });

  test('should return the same references for removed objects', () => {
    const a = { keep: false };
    const b = { keep: true };
    const array = [a, b];
    const removed = remove(array, o => !o.keep);
    expect(removed[0]).toBe(a);
    expect(array[0]).toBe(b);
  });

  test('should handle edge cases', () => {
    expect(remove([], () => true)).toEqual([]);
    expect(remove(null as any, () => true)).toEqual([]);
    expect(remove(undefined as any, () => true)).toEqual([]);
  });
});
