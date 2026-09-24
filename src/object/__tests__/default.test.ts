import { defaults, defaultsDeep } from '../../index.js';

describe('defaults', () => {
  test('should assign source values for undefined properties only', () => {
    expect(defaults({ a: 1, b: undefined } as any, { b: 2, c: 3 } as any)).toEqual({
      a: 1,
      b: 2,
      c: 3,
    });
  });

  test('should not overwrite defined values', () => {
    expect(defaults({ a: null as any, b: 2 } as any, { a: 1, b: 3, c: 4 } as any)).toEqual({
      a: null,
      b: 2,
      c: 4,
    });
  });
});

describe('defaultsDeep', () => {
  test('should recursively assign nested defaults', () => {
    expect(
      defaultsDeep({ a: { b: 2 }, d: undefined as any } as any, { a: { b: 1, c: 3 }, d: 4 } as any)
    ).toEqual({ a: { b: 2, c: 3 }, d: 4 });
  });
});
