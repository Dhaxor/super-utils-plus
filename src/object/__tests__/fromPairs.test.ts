import { fromPairs } from '../../index.js';

describe('fromPairs', () => {
  test('should create an object from key-value pairs', () => {
    expect(
      fromPairs([
        ['a', 1],
        ['b', 2],
      ])
    ).toEqual({ a: 1, b: 2 });
  });

  test('should return an empty object for empty input', () => {
    expect(fromPairs([])).toEqual({});
    expect(fromPairs(null as any)).toEqual({});
  });
});
