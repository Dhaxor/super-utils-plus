import { map, flatMap, flatMapDeep } from '../map';

describe('map', () => {
  test('should map values using a function', () => {
    const array = [1, 2, 3];
    const mappedArray = map(array, n => n * 2);

    expect(mappedArray).toEqual([2, 4, 6]);
  });

  test('should map values using a property path', () => {
    const users = [
      { user: 'barney', age: 36 },
      { user: 'fred', age: 40 },
    ];

    const mappedArray = map(users, 'user');

    expect(mappedArray).toEqual(['barney', 'fred']);
  });

  test('should provide index and array to iteratee', () => {
    const array = [1, 2, 3];
    const indices: number[] = [];
    const arrays: number[][] = [];

    map(array, (value, index, collection) => {
      indices.push(index);
      arrays.push(collection);
      return value;
    });

    expect(indices).toEqual([0, 1, 2]);
    expect(arrays).toEqual([array, array, array]);
  });

  test('should handle empty arrays', () => {
    expect(map([], n => n * 2)).toEqual([]);
  });

  test('should handle null and undefined', () => {
    expect(map(null as any, (n: number) => n * 2)).toEqual([]);
    expect(map(undefined as any, (n: number) => n * 2)).toEqual([]);
  });
});

describe('flatMap', () => {
  test('should map and flatten results one level deep', () => {
    const array = [1, 2];
    const mappedArray = flatMap(array, n => [n, n]);

    expect(mappedArray).toEqual([1, 1, 2, 2]);
  });

  test('should handle nested arrays one level deep', () => {
    const array = [1, 2];
    const mappedArray = flatMap(array, n => [[n, n]]);

    expect(mappedArray).toEqual([
      [1, 1],
      [2, 2],
    ]);
  });

  test('should handle arrays with different depths', () => {
    const array = [1, 2, 3];
    const mappedArray = flatMap(array, (n: number): number | number[] => (n === 2 ? [n, n] : [n]));

    expect(mappedArray).toEqual([1, 2, 2, 3]);
  });

  test('should handle empty arrays', () => {
    expect(flatMap([], n => [n, n])).toEqual([]);
  });

  test('should handle null and undefined', () => {
    expect(flatMap(null as any, n => [n, n])).toEqual([]);
    expect(flatMap(undefined as any, n => [n, n])).toEqual([]);
  });
});

describe('flatMapDeep', () => {
  test('should map and recursively flatten results', () => {
    const array = [1, 2];
    const mappedArray = flatMapDeep(array, n => [[[n, n]]]);

    expect(mappedArray).toEqual([1, 1, 2, 2]);
  });

  test('should handle nested arrays of any depth', () => {
    const array = [1, 2, 3];
    const mappedArray = flatMapDeep(array, n => [[[[n]]], [n]]);

    expect(mappedArray).toEqual([1, 1, 2, 2, 3, 3]);
  });

  test('should handle empty arrays', () => {
    expect(flatMapDeep([], n => [[[n, n]]])).toEqual([]);
  });

  test('should handle null and undefined', () => {
    expect(flatMapDeep(null as any, n => [[[n, n]]])).toEqual([]);
    expect(flatMapDeep(undefined as any, n => [[[n, n]]])).toEqual([]);
  });
});
