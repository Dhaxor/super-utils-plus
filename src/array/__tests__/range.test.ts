import { range, rangeRight } from '../../index.js';

describe('range', () => {
  test('should create a range from 0 when only end is provided', () => {
    expect(range(4)).toEqual([0, 1, 2, 3]);
    expect(range(-4)).toEqual([0, -1, -2, -3]);
  });

  test('should create a range between start and end', () => {
    expect(range(1, 5)).toEqual([1, 2, 3, 4]);
    expect(range(5, 1, -1)).toEqual([5, 4, 3, 2]);
  });

  test('should support custom steps and impossible directions', () => {
    expect(range(0, 20, 5)).toEqual([0, 5, 10, 15]);
    expect(range(1, 5, -1)).toEqual([]);
  });

  test('should support a step of 0 without looping forever', () => {
    expect(range(1, 4, 0)).toEqual([1, 1, 1]);
  });
});

describe('rangeRight', () => {
  test('should create the same range in reverse order', () => {
    expect(rangeRight(4)).toEqual([3, 2, 1, 0]);
    expect(rangeRight(1, 5)).toEqual([4, 3, 2, 1]);
    expect(rangeRight(0, 20, 5)).toEqual([15, 10, 5, 0]);
  });
});
