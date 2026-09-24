import { take, takeRight, takeWhile, takeRightWhile } from '../take.js';

describe('take', () => {
  test('should take the first element by default', () => {
    expect(take([1, 2, 3])).toEqual([1]);
  });

  test('should take the first n elements', () => {
    expect(take([1, 2, 3], 2)).toEqual([1, 2]);
    expect(take([1, 2, 3], 3)).toEqual([1, 2, 3]);
  });

  test('should return the whole array when n exceeds the length', () => {
    expect(take([1, 2, 3], 5)).toEqual([1, 2, 3]);
  });

  test('should return an empty array when n is 0 or negative', () => {
    expect(take([1, 2, 3], 0)).toEqual([]);
    expect(take([1, 2, 3], -1)).toEqual([]);
  });

  test('should not mutate the input array', () => {
    const array = [1, 2, 3];
    const result = take(array, 2);
    expect(array).toEqual([1, 2, 3]);
    expect(result).not.toBe(array);
  });

  test('should handle edge cases', () => {
    expect(take([])).toEqual([]);
    expect(take([], 2)).toEqual([]);
    expect(take(null as any, 1)).toEqual([]);
    expect(take(undefined as any)).toEqual([]);
  });
});

describe('takeRight', () => {
  test('should take the last element by default', () => {
    expect(takeRight([1, 2, 3])).toEqual([3]);
  });

  test('should take the last n elements', () => {
    expect(takeRight([1, 2, 3], 2)).toEqual([2, 3]);
    expect(takeRight([1, 2, 3], 3)).toEqual([1, 2, 3]);
  });

  test('should return the whole array when n exceeds the length', () => {
    expect(takeRight([1, 2, 3], 5)).toEqual([1, 2, 3]);
  });

  test('should return an empty array when n is 0 or negative', () => {
    expect(takeRight([1, 2, 3], 0)).toEqual([]);
    expect(takeRight([1, 2, 3], -1)).toEqual([]);
  });

  test('should not mutate the input array', () => {
    const array = [1, 2, 3];
    const result = takeRight(array, 2);
    expect(array).toEqual([1, 2, 3]);
    expect(result).not.toBe(array);
  });

  test('should handle edge cases', () => {
    expect(takeRight([])).toEqual([]);
    expect(takeRight([], 2)).toEqual([]);
    expect(takeRight(null as any, 1)).toEqual([]);
    expect(takeRight(undefined as any)).toEqual([]);
  });
});

describe('takeWhile', () => {
  test('should take elements from the beginning while the predicate returns truthy', () => {
    expect(takeWhile([1, 2, 3, 4, 1], n => n < 3)).toEqual([1, 2]);
  });

  test('should handle objects', () => {
    const users = [
      { user: 'barney', active: false },
      { user: 'fred', active: false },
      { user: 'pebbles', active: true },
    ];
    expect(takeWhile(users, o => !o.active)).toEqual([users[0], users[1]]);
  });

  test('should return an empty array when the first element fails the predicate', () => {
    expect(takeWhile([3, 1, 2], n => n < 3)).toEqual([]);
  });

  test('should return the whole array when every element passes', () => {
    const array = [1, 2];
    const result = takeWhile(array, n => n < 3);
    expect(result).toEqual([1, 2]);
    expect(result).not.toBe(array);
  });

  test('should provide index and array to the predicate and stop at the first falsey result', () => {
    const array = [1, 2, 3, 4];
    const predicate = jest.fn((_value: number, index: number) => index < 2);
    expect(takeWhile(array, predicate)).toEqual([1, 2]);
    expect(predicate).toHaveBeenCalledTimes(3);
    expect(predicate).toHaveBeenNthCalledWith(1, 1, 0, array);
    expect(predicate).toHaveBeenNthCalledWith(2, 2, 1, array);
    expect(predicate).toHaveBeenNthCalledWith(3, 3, 2, array);
  });

  test('should not mutate the input array', () => {
    const array = [1, 2, 3];
    takeWhile(array, n => n < 2);
    expect(array).toEqual([1, 2, 3]);
  });

  test('should handle edge cases', () => {
    expect(takeWhile([], () => true)).toEqual([]);
    expect(takeWhile(null as any, () => true)).toEqual([]);
    expect(takeWhile(undefined as any, () => true)).toEqual([]);
  });
});

describe('takeRightWhile', () => {
  test('should take elements from the end while the predicate returns truthy', () => {
    expect(takeRightWhile([1, 2, 3, 4, 5], n => n > 3)).toEqual([4, 5]);
  });

  test('should handle objects', () => {
    const users = [
      { user: 'barney', active: true },
      { user: 'fred', active: false },
      { user: 'pebbles', active: false },
    ];
    expect(takeRightWhile(users, o => !o.active)).toEqual([users[1], users[2]]);
  });

  test('should return an empty array when the last element fails the predicate', () => {
    expect(takeRightWhile([4, 5, 1], n => n > 3)).toEqual([]);
  });

  test('should return the whole array when every element passes', () => {
    const array = [4, 5];
    const result = takeRightWhile(array, n => n > 3);
    expect(result).toEqual([4, 5]);
    expect(result).not.toBe(array);
  });

  test('should provide index and array to the predicate and stop at the first falsey result', () => {
    const array = [1, 2, 3, 4];
    const predicate = jest.fn((_value: number, index: number) => index > 1);
    expect(takeRightWhile(array, predicate)).toEqual([3, 4]);
    expect(predicate).toHaveBeenCalledTimes(3);
    expect(predicate).toHaveBeenNthCalledWith(1, 4, 3, array);
    expect(predicate).toHaveBeenNthCalledWith(2, 3, 2, array);
    expect(predicate).toHaveBeenNthCalledWith(3, 2, 1, array);
  });

  test('should not mutate the input array', () => {
    const array = [1, 2, 3];
    takeRightWhile(array, n => n > 2);
    expect(array).toEqual([1, 2, 3]);
  });

  test('should handle edge cases', () => {
    expect(takeRightWhile([], () => true)).toEqual([]);
    expect(takeRightWhile(null as any, () => true)).toEqual([]);
    expect(takeRightWhile(undefined as any, () => true)).toEqual([]);
  });
});
