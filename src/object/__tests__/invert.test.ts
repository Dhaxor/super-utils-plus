import { invert, invertBy } from '../../index.js';

describe('invert', () => {
  test('should invert object keys and values', () => {
    expect(invert({ a: 1, b: 2 })).toEqual({ '1': 'a', '2': 'b' });
  });

  test('should let later keys overwrite earlier duplicate values', () => {
    expect(invert({ a: 1, b: 1, c: 2 })).toEqual({ '1': 'b', '2': 'c' });
  });
});

describe('invertBy', () => {
  test('should group keys by transformed values', () => {
    expect(invertBy({ a: 1, b: 2, c: 1 })).toEqual({ '1': ['a', 'c'], '2': ['b'] });
  });

  test('should support a custom iteratee', () => {
    expect(invertBy({ a: 1, b: 2, c: 3 }, value => String(value % 2))).toEqual({
      '0': ['b'],
      '1': ['a', 'c'],
    });
  });
});
