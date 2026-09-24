import { forEach, forEachRight, each, eachRight } from '../forEach';

describe('forEach', () => {
  test('should iterate over array elements', () => {
    const array = [1, 2, 3];
    const result: number[] = [];

    forEach(array, value => {
      result.push(value);
    });

    expect(result).toEqual([1, 2, 3]);
  });

  test('should provide index and array to iteratee', () => {
    const array = ['a', 'b', 'c'];
    const indices: number[] = [];
    const arrays: string[][] = [];

    forEach(array, (value, index, collection) => {
      indices.push(index);
      arrays.push(collection);
    });

    expect(indices).toEqual([0, 1, 2]);
    expect(arrays).toEqual([array, array, array]);
  });

  test('should exit early when iteratee returns false', () => {
    const array = [1, 2, 3, 4, 5];
    const result: number[] = [];

    forEach(array, value => {
      result.push(value);
      return value < 3;
    });

    expect(result).toEqual([1, 2, 3]);
  });

  test('should return the collection', () => {
    const array = [1, 2, 3];
    const result = forEach(array, _value => {});

    expect(result).toBe(array);
  });

  test('should handle empty arrays', () => {
    const array: number[] = [];
    const iteratee = jest.fn();

    forEach(array, iteratee);

    expect(iteratee).not.toHaveBeenCalled();
  });

  test('should handle null and undefined', () => {
    const iteratee = jest.fn();

    forEach(null as any, iteratee);
    forEach(undefined as any, iteratee);

    expect(iteratee).not.toHaveBeenCalled();
  });
});

describe('forEachRight', () => {
  test('should iterate over array elements from right to left', () => {
    const array = [1, 2, 3];
    const result: number[] = [];

    forEachRight(array, value => {
      result.push(value);
    });

    expect(result).toEqual([3, 2, 1]);
  });

  test('should provide index and array to iteratee', () => {
    const array = ['a', 'b', 'c'];
    const indices: number[] = [];
    const arrays: string[][] = [];

    forEachRight(array, (value, index, collection) => {
      indices.push(index);
      arrays.push(collection);
    });

    expect(indices).toEqual([2, 1, 0]);
    expect(arrays).toEqual([array, array, array]);
  });

  test('should exit early when iteratee returns false', () => {
    const array = [1, 2, 3, 4, 5];
    const result: number[] = [];

    forEachRight(array, value => {
      result.push(value);
      return value > 3;
    });

    expect(result).toEqual([5, 4, 3]);
  });

  test('should return the collection', () => {
    const array = [1, 2, 3];
    const result = forEachRight(array, _value => {});

    expect(result).toBe(array);
  });
});

describe('aliases', () => {
  test('each should be an alias for forEach', () => {
    expect(each).toBe(forEach);
  });

  test('eachRight should be an alias for forEachRight', () => {
    expect(eachRight).toBe(forEachRight);
  });
});
