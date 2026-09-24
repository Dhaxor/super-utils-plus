import { head, first, last, tail, initial } from '../head.js';

describe('head', () => {
  test('should return the first element', () => {
    expect(head([1, 2, 3])).toBe(1);
    expect(head(['a'])).toBe('a');
  });

  test('should return falsy first elements as-is', () => {
    expect(head([0, 1])).toBe(0);
    expect(head([null, 1])).toBeNull();
    expect(head([undefined, 1])).toBeUndefined();
    expect(head([''])).toBe('');
    expect(head([false])).toBe(false);
  });

  test('should return the same reference for object elements', () => {
    const obj = { a: 1 };
    expect(head([obj, {}])).toBe(obj);
  });

  test('should return undefined for empty input', () => {
    expect(head([])).toBeUndefined();
  });

  test('should return undefined for null and undefined', () => {
    expect(head(null as any)).toBeUndefined();
    expect(head(undefined as any)).toBeUndefined();
  });
});

describe('first', () => {
  test('should be an alias of head', () => {
    expect(first).toBe(head);
  });

  test('should return the first element', () => {
    expect(first([1, 2, 3])).toBe(1);
  });

  test('should return undefined for empty, null and undefined input', () => {
    expect(first([])).toBeUndefined();
    expect(first(null as any)).toBeUndefined();
    expect(first(undefined as any)).toBeUndefined();
  });
});

describe('last', () => {
  test('should return the last element', () => {
    expect(last([1, 2, 3])).toBe(3);
    expect(last(['a'])).toBe('a');
  });

  test('should return falsy last elements as-is', () => {
    expect(last([1, 0])).toBe(0);
    expect(last([1, null])).toBeNull();
    expect(last([1, undefined])).toBeUndefined();
    expect(last([''])).toBe('');
  });

  test('should return the same reference for object elements', () => {
    const obj = { a: 1 };
    expect(last([{}, obj])).toBe(obj);
  });

  test('should return undefined for empty input', () => {
    expect(last([])).toBeUndefined();
  });

  test('should return undefined for null and undefined', () => {
    expect(last(null as any)).toBeUndefined();
    expect(last(undefined as any)).toBeUndefined();
  });
});

describe('tail', () => {
  test('should return all but the first element', () => {
    expect(tail([1, 2, 3])).toEqual([2, 3]);
  });

  test('should return an empty array for a single-element array', () => {
    expect(tail([1])).toEqual([]);
  });

  test('should not mutate the input array', () => {
    const array = [1, 2, 3];
    const result = tail(array);
    expect(array).toEqual([1, 2, 3]);
    expect(result).not.toBe(array);
  });

  test('should return an empty array for empty input', () => {
    expect(tail([])).toEqual([]);
  });

  test('should return an empty array for null and undefined', () => {
    expect(tail(null as any)).toEqual([]);
    expect(tail(undefined as any)).toEqual([]);
  });
});

describe('initial', () => {
  test('should return all but the last element', () => {
    expect(initial([1, 2, 3])).toEqual([1, 2]);
  });

  test('should return an empty array for a single-element array', () => {
    expect(initial([1])).toEqual([]);
  });

  test('should not mutate the input array', () => {
    const array = [1, 2, 3];
    const result = initial(array);
    expect(array).toEqual([1, 2, 3]);
    expect(result).not.toBe(array);
  });

  test('should return an empty array for empty input', () => {
    expect(initial([])).toEqual([]);
  });

  test('should return an empty array for null and undefined', () => {
    expect(initial(null as any)).toEqual([]);
    expect(initial(undefined as any)).toEqual([]);
  });
});
