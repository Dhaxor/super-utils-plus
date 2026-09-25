import { reduce, reduceRight } from '../reduce.js';

describe('reduce', () => {
  test('should reduce a collection to a single value', () => {
    expect(reduce([1, 2], (sum, n) => sum + n, 0)).toBe(3);
  });

  test('should iterate from left to right', () => {
    const order: number[] = [];
    const result = reduce(
      [1, 2, 3],
      (acc, n) => {
        order.push(n);
        return acc + String(n);
      },
      ''
    );
    expect(order).toEqual([1, 2, 3]);
    expect(result).toBe('123');
  });

  test('should provide accumulator, value, index and collection to the iteratee', () => {
    const array = ['a', 'b', 'c'];
    const iteratee = jest.fn((acc: string[], value: string) => [...acc, value]);
    const result = reduce(array, iteratee, [] as string[]);
    expect(result).toEqual(['a', 'b', 'c']);
    expect(iteratee).toHaveBeenCalledTimes(3);
    expect(iteratee).toHaveBeenNthCalledWith(1, [], 'a', 0, array);
    expect(iteratee).toHaveBeenNthCalledWith(2, ['a'], 'b', 1, array);
    expect(iteratee).toHaveBeenNthCalledWith(3, ['a', 'b'], 'c', 2, array);
  });

  test('should pass the previous result as the accumulator', () => {
    const array = [
      [0, 1],
      [2, 3],
      [4, 5],
    ];
    expect(reduce(array, (flat, other) => flat.concat(other), [] as number[])).toEqual([
      0, 1, 2, 3, 4, 5,
    ]);
  });

  test('should support object accumulators', () => {
    const result = reduce(
      ['a', 'b', 'a'],
      (acc, key) => {
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
    expect(result).toEqual({ a: 2, b: 1 });
  });

  test('should support an undefined accumulator', () => {
    expect(
      reduce<number, number | undefined>(
        [1, 5, 3],
        (max, n) => (max === undefined || n > max ? n : max),
        undefined
      )
    ).toBe(5);
  });

  test('should return the accumulator for an empty collection without calling the iteratee', () => {
    const iteratee = jest.fn();
    const accumulator = { untouched: true };
    expect(reduce([], iteratee, accumulator)).toBe(accumulator);
    expect(reduce([], (sum: number, n: number) => sum + n, 0)).toBe(0);
    expect(iteratee).not.toHaveBeenCalled();
  });

  test('should return the accumulator for null and undefined', () => {
    expect(reduce(null as any, (sum: number, n: number) => sum + n, 10)).toBe(10);
    expect(reduce(undefined as any, (acc: string, n: number) => acc + n, 'acc')).toBe('acc');
  });

  test('should not mutate the input array', () => {
    const array = [1, 2, 3];
    reduce(array, (sum, n) => sum + n, 0);
    expect(array).toEqual([1, 2, 3]);
  });
});

describe('reduceRight', () => {
  test('should iterate from right to left', () => {
    const array = [
      [0, 1],
      [2, 3],
      [4, 5],
    ];
    expect(
      reduceRight(array, (flattened, other) => flattened.concat(other), [] as number[])
    ).toEqual([4, 5, 2, 3, 0, 1]);
  });

  test('should provide accumulator, value, index and collection in reverse order', () => {
    const array = ['a', 'b', 'c'];
    const iteratee = jest.fn((acc: string, value: string) => acc + value);
    const result = reduceRight(array, iteratee, '');
    expect(result).toBe('cba');
    expect(iteratee).toHaveBeenCalledTimes(3);
    expect(iteratee).toHaveBeenNthCalledWith(1, '', 'c', 2, array);
    expect(iteratee).toHaveBeenNthCalledWith(2, 'c', 'b', 1, array);
    expect(iteratee).toHaveBeenNthCalledWith(3, 'cb', 'a', 0, array);
  });

  test('should produce the same result as reduce for commutative operations', () => {
    expect(reduceRight([1, 2, 3, 4], (sum, n) => sum + n, 0)).toBe(10);
    expect(reduce([1, 2, 3, 4], (sum, n) => sum + n, 0)).toBe(10);
  });

  test('should support object accumulators', () => {
    const result = reduceRight(
      ['a', 'b', 'c'],
      (acc, key, index) => {
        acc[key] = index;
        return acc;
      },
      {} as Record<string, number>
    );
    expect(result).toEqual({ a: 0, b: 1, c: 2 });
  });

  test('should return the accumulator for an empty collection without calling the iteratee', () => {
    const iteratee = jest.fn();
    const accumulator = { untouched: true };
    expect(reduceRight([], iteratee, accumulator)).toBe(accumulator);
    expect(reduceRight([], (sum: number, n: number) => sum + n, 0)).toBe(0);
    expect(iteratee).not.toHaveBeenCalled();
  });

  test('should return the accumulator for null and undefined', () => {
    expect(reduceRight(null as any, (sum: number, n: number) => sum + n, 10)).toBe(10);
    expect(reduceRight(undefined as any, (acc: string, n: number) => acc + n, 'acc')).toBe('acc');
  });

  test('should not mutate the input array', () => {
    const array = [1, 2, 3];
    reduceRight(array, (sum, n) => sum + n, 0);
    expect(array).toEqual([1, 2, 3]);
  });
});
