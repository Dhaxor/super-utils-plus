import { clamp } from '../../index';

describe('clamp', () => {
  test('should return the value when it is within bounds', () => {
    expect(clamp(3, 1, 5)).toBe(3);
    expect(clamp(1, 1, 5)).toBe(1);
    expect(clamp(5, 1, 5)).toBe(5);
  });

  test('should clamp values below and above the bounds', () => {
    expect(clamp(-10, -5, 5)).toBe(-5);
    expect(clamp(10, -5, 5)).toBe(5);
  });

  test('should support reversed bounds', () => {
    expect(clamp(7, 10, 0)).toBe(7);
    expect(clamp(-2, 10, 0)).toBe(0);
    expect(clamp(12, 10, 0)).toBe(10);
  });

  test('should preserve NaN inputs', () => {
    expect(Number.isNaN(clamp(Number.NaN, 0, 10))).toBe(true);
  });
});