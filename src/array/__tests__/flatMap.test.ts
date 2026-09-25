import { map, flatMap, flatMapDeep, flatMapDepth } from '../map.js';

describe('map with a property-name iteratee', () => {
  test('should read a property from each object', () => {
    expect(map([{ user: 'barney' }, { user: 'fred' }], 'user')).toEqual(['barney', 'fred']);
  });

  test('should read properties of array elements', () => {
    expect(map([[1, 2], [3]], 'length')).toEqual([2, 1]);
  });

  test('should read properties of string elements', () => {
    expect(map(['ab', 'c', ''], 'length')).toEqual([2, 1, 0]);
  });

  test('should return undefined for null and undefined elements', () => {
    expect(map([null], 'x')).toEqual([undefined]);
    expect(map([undefined, null, { x: 1 }] as any[], 'x')).toEqual([undefined, undefined, 1]);
  });

  test('should return undefined for missing properties', () => {
    expect(map([{ a: 1 }, {}] as any[], 'b')).toEqual([undefined, undefined]);
  });

  test('should not mutate the input array', () => {
    const array = [{ x: 1 }];
    map(array, 'x');
    expect(array).toEqual([{ x: 1 }]);
  });
});

describe('flatMap', () => {
  test('should map and flatten one level', () => {
    expect(flatMap([1, 2], n => [n, n])).toEqual([1, 1, 2, 2]);
  });

  test('should flatten only one level', () => {
    expect(flatMap([1, 2], n => [[n, n]])).toEqual([
      [1, 1],
      [2, 2],
    ]);
  });

  test('should keep non-array results as single elements', () => {
    expect(flatMap([1, 2, 3], n => n * 2)).toEqual([2, 4, 6]);
  });

  test('should drop empty array results', () => {
    expect(flatMap([1, 2, 3, 4], n => (n % 2 === 0 ? [n] : []))).toEqual([2, 4]);
  });

  test('should support a property-name iteratee', () => {
    expect(flatMap([{ tags: ['a', 'b'] }, { tags: ['c'] }], 'tags')).toEqual(['a', 'b', 'c']);
    expect(flatMap([{ tags: ['a', ['b']] }], 'tags')).toEqual(['a', ['b']]);
    expect(flatMap([null, { tags: ['a'] }] as any[], 'tags')).toEqual([undefined, 'a']);
  });

  test('should provide index and collection to the iteratee', () => {
    const array = ['a', 'b'];
    const calls: [string, number, string[]][] = [];
    flatMap(array, (value, index, collection) => {
      calls.push([value, index, collection]);
      return [value];
    });
    expect(calls).toEqual([
      ['a', 0, array],
      ['b', 1, array],
    ]);
  });

  test('should handle edge cases', () => {
    expect(flatMap([], n => [n])).toEqual([]);
    expect(flatMap(null as any, (n: number) => [n])).toEqual([]);
    expect(flatMap(undefined as any, (n: number) => [n])).toEqual([]);
  });
});

describe('flatMapDeep', () => {
  test('should map and recursively flatten', () => {
    expect(flatMapDeep([1, 2], n => [[[n, n]]])).toEqual([1, 1, 2, 2]);
  });

  test('should flatten results of mixed depth', () => {
    expect(flatMapDeep([1, 2], n => [n, [n, [n]]])).toEqual([1, 1, 1, 2, 2, 2]);
  });

  test('should keep non-array results as single elements', () => {
    expect(flatMapDeep([1, 2], n => n)).toEqual([1, 2]);
  });

  test('should drop empty array results', () => {
    expect(flatMapDeep([1, 2, 3], n => (n === 2 ? [[]] : [[n]]))).toEqual([1, 3]);
  });

  test('should support a property-name iteratee', () => {
    expect(flatMapDeep([{ v: [[1], [[2]]] }, { v: 3 }] as any[], 'v')).toEqual([1, 2, 3]);
  });

  test('should provide index and collection to the iteratee', () => {
    const array = ['a', 'b'];
    const calls: [string, number, string[]][] = [];
    flatMapDeep(array, (value, index, collection) => {
      calls.push([value, index, collection]);
      return [[value]];
    });
    expect(calls).toEqual([
      ['a', 0, array],
      ['b', 1, array],
    ]);
  });

  test('should handle edge cases', () => {
    expect(flatMapDeep([], n => [[n]])).toEqual([]);
    expect(flatMapDeep(null as any, (n: number) => [[n]])).toEqual([]);
    expect(flatMapDeep(undefined as any, (n: number) => [[n]])).toEqual([]);
  });
});

describe('flatMapDepth', () => {
  const duplicate = (n: number) => [[[n, n]]];

  test('should flatten one level by default', () => {
    expect(flatMapDepth([1, 2], duplicate)).toEqual([[[1, 1]], [[2, 2]]]);
  });

  test('should flatten up to the given depth', () => {
    expect(flatMapDepth([1, 2], duplicate, 2)).toEqual([
      [1, 1],
      [2, 2],
    ]);
    expect(flatMapDepth([1, 2], duplicate, 3)).toEqual([1, 1, 2, 2]);
  });

  test('should stop flattening once the results are flat', () => {
    expect(flatMapDepth([1, 2], duplicate, 10)).toEqual([1, 1, 2, 2]);
  });

  test('should return the mapped results unchanged for a depth of 0 or less', () => {
    expect(flatMapDepth([1, 2], duplicate, 0)).toEqual([[[[1, 1]]], [[[2, 2]]]]);
    expect(flatMapDepth([1, 2], duplicate, -1)).toEqual([[[[1, 1]]], [[[2, 2]]]]);
  });

  test('should keep non-array results as single elements', () => {
    expect(flatMapDepth([1, 2], n => n, 2)).toEqual([1, 2]);
    expect(flatMapDepth([1, 2], n => (n === 1 ? [n, [n]] : n), 1)).toEqual([1, [1], 2]);
  });

  test('should only flatten as deep as requested for mixed-depth results', () => {
    expect(flatMapDepth([1, 2], n => [n, [n, [n]]], 1)).toEqual([1, [1, [1]], 2, [2, [2]]]);
    expect(flatMapDepth([1, 2], n => [n, [n, [n]]], 2)).toEqual([1, 1, [1], 2, 2, [2]]);
  });

  test('should support a property-name iteratee', () => {
    const items = [{ v: [[1, 2]] }, { v: [[3]] }];
    expect(flatMapDepth(items, 'v')).toEqual([[1, 2], [3]]);
    expect(flatMapDepth(items, 'v', 2)).toEqual([1, 2, 3]);
  });

  test('should provide index and collection to the iteratee', () => {
    const array = ['a', 'b'];
    const calls: [string, number, string[]][] = [];
    flatMapDepth(
      array,
      (value, index, collection) => {
        calls.push([value, index, collection]);
        return [value];
      },
      1
    );
    expect(calls).toEqual([
      ['a', 0, array],
      ['b', 1, array],
    ]);
  });

  test('should handle edge cases', () => {
    expect(flatMapDepth([], duplicate, 2)).toEqual([]);
    expect(flatMapDepth(null as any, duplicate, 2)).toEqual([]);
    expect(flatMapDepth(undefined as any, duplicate, 2)).toEqual([]);
  });
});
