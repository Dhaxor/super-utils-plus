import { inRange } from '../../index';

describe('inRange', () => {
  test('should support a single end argument', () => {
    expect(inRange(3, 5)).toBe(true);
    expect(inRange(5, 5)).toBe(false);
  });

  test('should support explicit start and end arguments', () => {
    expect(inRange(3, 2, 4)).toBe(true);
    expect(inRange(4, 2, 4)).toBe(false);
  });

  test('should support reversed bounds', () => {
    expect(inRange(-3, -2, -6)).toBe(true);
    expect(inRange(-6, -2, -6)).toBe(true);
    expect(inRange(-2, -2, -6)).toBe(false);
  });
});