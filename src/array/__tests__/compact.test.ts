import { compact, compactNil } from '../compact.js';

describe('compact', () => {
  test('should remove all falsy values', () => {
    expect(compact([0, 1, false, 2, '', 3, null, undefined, NaN])).toEqual([1, 2, 3]);
  });

  test('should keep truthy values of any type', () => {
    const obj = { a: 1 };
    const arr: unknown[] = [];
    expect(compact([obj, arr, 'a', 1, true, -1])).toEqual([obj, arr, 'a', 1, true, -1]);
  });

  test('should treat -0 as falsy', () => {
    expect(compact([-0, 1])).toEqual([1]);
  });

  test('should return an empty array when every value is falsy', () => {
    expect(compact([0, false, '', null, undefined, NaN])).toEqual([]);
  });

  test('should not mutate the input array', () => {
    const array = [0, 1, null, 2];
    const result = compact(array);
    expect(array).toEqual([0, 1, null, 2]);
    expect(result).not.toBe(array);
  });

  test('should handle edge cases', () => {
    expect(compact([])).toEqual([]);
    expect(compact(null as any)).toEqual([]);
    expect(compact(undefined as any)).toEqual([]);
  });
});

describe('compactNil', () => {
  test('should remove only null and undefined values', () => {
    expect(compactNil([0, 1, false, 2, '', 3, null, undefined, NaN])).toEqual([
      0,
      1,
      false,
      2,
      '',
      3,
      NaN,
    ]);
  });

  test('should keep truthy values of any type', () => {
    const obj = { a: 1 };
    const arr: unknown[] = [];
    expect(compactNil([obj, arr, 'a', 1, true])).toEqual([obj, arr, 'a', 1, true]);
  });

  test('should return an empty array when every value is nil', () => {
    expect(compactNil([null, undefined, null, undefined])).toEqual([]);
  });

  test('should not mutate the input array', () => {
    const array = [0, null, 1, undefined];
    const result = compactNil(array);
    expect(array).toEqual([0, null, 1, undefined]);
    expect(result).not.toBe(array);
  });

  test('should handle edge cases', () => {
    expect(compactNil([])).toEqual([]);
    expect(compactNil(null as any)).toEqual([]);
    expect(compactNil(undefined as any)).toEqual([]);
  });
});
