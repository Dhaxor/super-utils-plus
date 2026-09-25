import { flatten, flattenDeep } from '../flatten.js';

describe('flatten', () => {
  test('should flatten a single level deep', () => {
    expect(flatten([1, [2, [3, [4]], 5]])).toEqual([1, 2, [3, [4]], 5]);
  });

  test('should leave an already flat array unchanged', () => {
    expect(flatten([1, 2, 3])).toEqual([1, 2, 3]);
  });

  test('should drop empty nested arrays', () => {
    expect(flatten([[], [1], [], [2, 3]])).toEqual([1, 2, 3]);
  });

  test('should preserve falsy and object values', () => {
    const obj = { a: [1] };
    const array: unknown[] = [0, [null, undefined], '', [obj], false];
    expect(flatten(array)).toEqual([0, null, undefined, '', obj, false]);
  });

  test('should not mutate the input', () => {
    const inner = [2, 3];
    const array = [1, inner];
    const result = flatten(array);
    expect(array).toEqual([1, [2, 3]]);
    expect(inner).toEqual([2, 3]);
    expect(result).not.toBe(array);
  });

  test('should handle edge cases', () => {
    expect(flatten([])).toEqual([]);
    expect(flatten(null as any)).toEqual([]);
    expect(flatten(undefined as any)).toEqual([]);
  });
});

describe('flattenDeep', () => {
  test('should recursively flatten nested arrays', () => {
    expect(flattenDeep([1, [2, [3, [4]], 5]])).toEqual([1, 2, 3, 4, 5]);
  });

  test('should flatten arbitrarily deep nesting', () => {
    expect(flattenDeep([[[[[1]]]], [[2]], 3])).toEqual([1, 2, 3]);
  });

  test('should leave an already flat array unchanged', () => {
    expect(flattenDeep([1, 2, 3])).toEqual([1, 2, 3]);
  });

  test('should drop empty nested arrays', () => {
    expect(flattenDeep([[], [[]], [[[]], 1]])).toEqual([1]);
  });

  test('should preserve falsy and object values without flattening object contents', () => {
    const obj = { a: [1] };
    expect(flattenDeep([0, [null, [undefined]], '', [[obj]], false])).toEqual([
      0,
      null,
      undefined,
      '',
      obj,
      false,
    ]);
  });

  test('should not mutate the input', () => {
    const inner = [2, [3]];
    const array = [1, inner];
    const result = flattenDeep(array);
    expect(array).toEqual([1, [2, [3]]]);
    expect(inner).toEqual([2, [3]]);
    expect(result).not.toBe(array);
  });

  test('should handle edge cases', () => {
    expect(flattenDeep([])).toEqual([]);
    expect(flattenDeep(null as any)).toEqual([]);
    expect(flattenDeep(undefined as any)).toEqual([]);
  });
});
