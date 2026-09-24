import { zip, unzip, zipObject, zipObjectDeep, zipWith, unzipWith } from '../zip';

describe('zip', () => {
  test('should zip arrays together', () => {
    expect(zip(['a', 'b'] as any[], [1, 2] as any[], [true, false] as any[])).toEqual([
      ['a', 1, true],
      ['b', 2, false],
    ]);
  });

  test('should handle arrays of different lengths', () => {
    expect(zip(['a', 'b', 'c'] as any[], [1, 2] as any[])).toEqual([
      ['a', 1],
      ['b', 2],
      ['c', undefined],
    ]);
  });

  test('should handle empty arrays', () => {
    expect(zip([])).toEqual([]);
    expect(zip(['a', 'b'], [])).toEqual([
      ['a', undefined],
      ['b', undefined],
    ]);
  });
});

describe('unzip', () => {
  test('should unzip an array of grouped elements', () => {
    const zipped = [
      ['a', 1, true],
      ['b', 2, false],
    ];
    expect(unzip(zipped)).toEqual([
      ['a', 'b'],
      [1, 2],
      [true, false],
    ]);
  });

  test('should handle empty arrays', () => {
    expect(unzip([])).toEqual([]);
  });
});

describe('zipObject', () => {
  test('should create an object from property and value arrays', () => {
    expect(zipObject(['a', 'b'], [1, 2])).toEqual({ a: 1, b: 2 });
  });

  test('should handle arrays of different lengths', () => {
    expect(zipObject(['a', 'b', 'c'], [1, 2])).toEqual({ a: 1, b: 2, c: undefined });
    expect(zipObject(['a', 'b'], [1, 2, 3])).toEqual({ a: 1, b: 2 });
  });

  test('should handle empty arrays', () => {
    expect(zipObject([], [])).toEqual({});
  });
});

describe('zipObjectDeep', () => {
  test('should create an object with nested properties', () => {
    expect(zipObjectDeep(['a.b[0].c', 'a.b[1].d'], [1, 2])).toEqual({
      a: { b: [{ c: 1 }, { d: 2 }] },
    });
  });

  test('should handle complex paths', () => {
    expect(zipObjectDeep(['a.b.c', 'a.d[0].e'], [1, 2])).toEqual({
      a: { b: { c: 1 }, d: [{ e: 2 }] },
    });
  });

  test('should handle empty arrays', () => {
    expect(zipObjectDeep([], [])).toEqual({});
  });
});

describe('zipWith', () => {
  test('should zip arrays applying the specified function', () => {
    expect(zipWith([1, 2], [10, 20], [100, 200], (a, b, c) => a + b + c)).toEqual([111, 222]);
  });

  test('should handle arrays of different lengths', () => {
    expect(zipWith([1, 2, 3], [10, 20], (a, b) => a + b)).toEqual([11, 22, NaN]);
  });

  test('should handle empty arrays', () => {
    expect(zipWith([], () => undefined)).toEqual([]);
    expect(zipWith<number, undefined>([1, 2], [], () => undefined)).toEqual([]);
  });
});

describe('unzipWith', () => {
  test('should unzip an array applying the specified function', () => {
    const zipped = [
      [1, 10, 100],
      [2, 20, 200],
    ];
    expect(unzipWith(zipped, (...values) => values.reduce((sum, n) => sum + n, 0))).toEqual([
      3, 30, 300,
    ]);
  });

  test('should handle empty arrays', () => {
    expect(
      unzipWith([], (...values: number[]) => values.reduce((sum: number, n: number) => sum + n, 0))
    ).toEqual([]);
  });
});
