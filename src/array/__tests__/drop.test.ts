import { drop, dropRight, dropWhile, dropRightWhile } from '../drop';

describe('drop', () => {
  test('should drop first element by default', () => {
    expect(drop([1, 2, 3])).toEqual([2, 3]);
  });

  test('should drop the first n elements', () => {
    expect(drop([1, 2, 3], 2)).toEqual([3]);
    expect(drop([1, 2, 3], 5)).toEqual([]);
    expect(drop([1, 2, 3], 0)).toEqual([1, 2, 3]);
  });

  test('should handle edge cases', () => {
    expect(drop([], 1)).toEqual([]);
    expect(drop(null as any, 1)).toEqual([]);
  });
});

describe('dropRight', () => {
  test('should drop last element by default', () => {
    expect(dropRight([1, 2, 3])).toEqual([1, 2]);
  });

  test('should drop the last n elements', () => {
    expect(dropRight([1, 2, 3], 2)).toEqual([1]);
    expect(dropRight([1, 2, 3], 5)).toEqual([]);
    expect(dropRight([1, 2, 3], 0)).toEqual([1, 2, 3]);
  });

  test('should handle edge cases', () => {
    expect(dropRight([], 1)).toEqual([]);
    expect(dropRight(null as any, 1)).toEqual([]);
  });
});

describe('dropWhile', () => {
  test('should drop elements from the beginning until predicate returns falsey', () => {
    const array = [1, 2, 3, 4, 5];
    expect(dropWhile(array, n => n < 3)).toEqual([3, 4, 5]);
  });

  test('should handle objects', () => {
    const users = [
      { user: 'barney', active: false },
      { user: 'fred', active: false },
      { user: 'pebbles', active: true },
    ];
    expect(dropWhile(users, o => !o.active)).toEqual([{ user: 'pebbles', active: true }]);
  });

  test('should handle edge cases', () => {
    expect(dropWhile([], n => n < 3)).toEqual([]);
    expect(dropWhile(null as any, (n: number) => n < 3)).toEqual([]);
  });
});

describe('dropRightWhile', () => {
  test('should drop elements from the end until predicate returns falsey', () => {
    const array = [1, 2, 3, 4, 5];
    expect(dropRightWhile(array, n => n > 3)).toEqual([1, 2, 3]);
  });

  test('should handle objects', () => {
    const users = [
      { user: 'barney', active: true },
      { user: 'fred', active: false },
      { user: 'pebbles', active: false },
    ];
    expect(dropRightWhile(users, o => !o.active)).toEqual([{ user: 'barney', active: true }]);
  });

  test('should handle edge cases', () => {
    expect(dropRightWhile([], (n: number) => n > 3)).toEqual([]);
    expect(dropRightWhile(null as any, (n: number) => n > 3)).toEqual([]);
  });
});
