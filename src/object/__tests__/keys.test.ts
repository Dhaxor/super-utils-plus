import { keys, keysIn, values, valuesIn, toPairs, toPairsIn, entries, entriesIn } from '../keys.js';

function Foo(this: any) {
  this.a = 1;
  this.b = 2;
}
Foo.prototype.c = 3;

const makeFoo = () => new (Foo as any)();

describe('keys', () => {
  test('should return own enumerable property names', () => {
    expect(keys({ a: 1, b: 2 })).toEqual(['a', 'b']);
  });

  test('should not include inherited properties', () => {
    expect(keys(makeFoo())).toEqual(['a', 'b']);
  });

  test('should not include non-enumerable properties', () => {
    const object = { a: 1 };
    Object.defineProperty(object, 'hidden', { value: 2, enumerable: false });
    expect(keys(object)).toEqual(['a']);
  });

  test('should return indices for arrays and strings', () => {
    expect(keys(['x', 'y'])).toEqual(['0', '1']);
    expect(keys('hi' as any)).toEqual(['0', '1']);
  });

  test('should return an empty array for empty objects', () => {
    expect(keys({})).toEqual([]);
  });

  test('should return an empty array for null and undefined', () => {
    expect(keys(null as any)).toEqual([]);
    expect(keys(undefined as any)).toEqual([]);
  });
});

describe('keysIn', () => {
  test('should return own and inherited enumerable property names', () => {
    expect(keysIn(makeFoo())).toEqual(['a', 'b', 'c']);
  });

  test('should behave like keys for plain objects', () => {
    expect(keysIn({ a: 1, b: 2 })).toEqual(['a', 'b']);
    expect(keysIn({})).toEqual([]);
  });

  test('should return indices for arrays', () => {
    expect(keysIn(['x', 'y'])).toEqual(['0', '1']);
  });

  test('should return an empty array for null and undefined', () => {
    expect(keysIn(null as any)).toEqual([]);
    expect(keysIn(undefined as any)).toEqual([]);
  });
});

describe('values', () => {
  test('should return own enumerable property values', () => {
    expect(values({ a: 1, b: 'two', c: [3] })).toEqual([1, 'two', [3]]);
  });

  test('should not include inherited property values', () => {
    expect(values(makeFoo())).toEqual([1, 2]);
  });

  test('should return characters for strings', () => {
    expect(values('hi' as any)).toEqual(['h', 'i']);
  });

  test('should return an empty array for null and undefined', () => {
    expect(values(null as any)).toEqual([]);
    expect(values(undefined as any)).toEqual([]);
  });
});

describe('valuesIn', () => {
  test('should return own and inherited enumerable property values', () => {
    expect(valuesIn(makeFoo())).toEqual([1, 2, 3]);
  });

  test('should behave like values for plain objects', () => {
    expect(valuesIn({ a: 1, b: 2 })).toEqual([1, 2]);
    expect(valuesIn({})).toEqual([]);
  });

  test('should return an empty array for null and undefined', () => {
    expect(valuesIn(null as any)).toEqual([]);
    expect(valuesIn(undefined as any)).toEqual([]);
  });
});

describe('toPairs', () => {
  test('should return own enumerable key-value pairs', () => {
    expect(toPairs({ a: 1, b: 2 })).toEqual([
      ['a', 1],
      ['b', 2],
    ]);
  });

  test('should not include inherited properties', () => {
    expect(toPairs(makeFoo())).toEqual([
      ['a', 1],
      ['b', 2],
    ]);
  });

  test('should return an empty array for empty objects', () => {
    expect(toPairs({})).toEqual([]);
  });

  test('should return an empty array for null and undefined', () => {
    expect(toPairs(null as any)).toEqual([]);
    expect(toPairs(undefined as any)).toEqual([]);
  });

  test('entries should be an alias for toPairs', () => {
    expect(entries).toBe(toPairs);
  });
});

describe('toPairsIn', () => {
  test('should return own and inherited enumerable key-value pairs', () => {
    expect(toPairsIn(makeFoo())).toEqual([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);
  });

  test('should behave like toPairs for plain objects', () => {
    expect(toPairsIn({ a: 1, b: 2 })).toEqual([
      ['a', 1],
      ['b', 2],
    ]);
    expect(toPairsIn({})).toEqual([]);
  });

  test('should return an empty array for null and undefined', () => {
    expect(toPairsIn(null as any)).toEqual([]);
    expect(toPairsIn(undefined as any)).toEqual([]);
  });

  test('entriesIn should be an alias for toPairsIn', () => {
    expect(entriesIn).toBe(toPairsIn);
  });
});
