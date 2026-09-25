import {
  assignOwnKey,
  hasUnsafeKey,
  isIndexSegment,
  isUnsafeKey,
  parsePath,
  toPath,
} from '../path.js';

describe('parsePath', () => {
  test('should split dot notation', () => {
    expect(parsePath('a.b.c')).toEqual(['a', 'b', 'c']);
  });

  test('should convert numeric bracket segments to numbers', () => {
    expect(parsePath('a[0].b.c')).toEqual(['a', 0, 'b', 'c']);
    expect(parsePath('[1][2]')).toEqual([1, 2]);
  });

  test('should keep non-numeric bracket segments as strings', () => {
    expect(parsePath('a[b].c')).toEqual(['a', 'b', 'c']);
  });

  test('should strip matching quotes from bracket segments', () => {
    expect(parsePath('a["b.c"].d')).toEqual(['a', 'b.c', 'd']);
    expect(parsePath("a['x y']")).toEqual(['a', 'x y']);
    expect(parsePath('a["0"]')).toEqual(['a', '0']);
  });

  test('should keep dots inside brackets', () => {
    expect(parsePath('a[b.c]')).toEqual(['a', 'b.c']);
  });

  test('should keep empty segments like Lodash toPath', () => {
    expect(parsePath('')).toEqual(['']);
    expect(parsePath('a..b')).toEqual(['a', '', 'b']);
    expect(parsePath('.a')).toEqual(['', 'a']);
    expect(parsePath('a.')).toEqual(['a', '']);
    expect(parsePath('a..')).toEqual(['a', '', '']);
    expect(parsePath('.')).toEqual(['', '']);
  });

  test('should not add empty segments around brackets', () => {
    expect(parsePath('a[0].b')).toEqual(['a', 0, 'b']);
    expect(parsePath('a.[0]')).toEqual(['a', 0]);
    expect(parsePath('a[0][1]')).toEqual(['a', 0, 1]);
    expect(parsePath('a[]')).toEqual(['a', '']);
    expect(parsePath('a[0')).toEqual(['a', 0]);
  });

  test('should only convert canonical integer bracket segments to numbers', () => {
    expect(parsePath('a[01]')).toEqual(['a', '01']);
    expect(parsePath('a[-1]')).toEqual(['a', '-1']);
    expect(parsePath('a[1.5]')).toEqual(['a', '1.5']);
  });

  test('should not treat dot-separated digits as indexes', () => {
    expect(parsePath('a.0.b')).toEqual(['a', '0', 'b']);
  });
});

describe('toPath', () => {
  test('should parse strings', () => {
    expect(toPath('a[0].b')).toEqual(['a', 0, 'b']);
  });

  test('should copy array paths, keeping numbers and symbols', () => {
    const symbol = Symbol('s');
    const path = ['a', 0, symbol];
    expect(toPath(path)).toEqual(['a', 0, symbol]);
    expect(toPath(path)).not.toBe(path);
  });

  test('should stringify object-typed array elements so the unsafe-key guard sees them', () => {
    expect(toPath([['__proto__'], 'x'] as any)).toEqual(['__proto__', 'x']);
    expect(toPath([new String('constructor')] as any)).toEqual(['constructor']);
    expect(hasUnsafeKey(toPath([['__proto__'], 'x'] as any))).toBe(true);
  });

  test('should wrap single keys', () => {
    const symbol = Symbol('s');
    expect(toPath(3)).toEqual([3]);
    expect(toPath(symbol)).toEqual([symbol]);
  });
});

describe('isUnsafeKey / hasUnsafeKey', () => {
  test('should flag prototype-chain keys', () => {
    expect(isUnsafeKey('__proto__')).toBe(true);
    expect(isUnsafeKey('constructor')).toBe(true);
    expect(isUnsafeKey('prototype')).toBe(true);
  });

  test('should allow ordinary keys', () => {
    expect(isUnsafeKey('proto')).toBe(false);
    expect(isUnsafeKey(0)).toBe(false);
    expect(isUnsafeKey(Symbol('x'))).toBe(false);
  });

  test('should detect unsafe keys anywhere in a path', () => {
    expect(hasUnsafeKey(['a', '__proto__', 'b'])).toBe(true);
    expect(hasUnsafeKey(['a', 'b'])).toBe(false);
    expect(hasUnsafeKey([])).toBe(false);
  });
});

describe('isIndexSegment', () => {
  test('should recognise numbers and digit strings', () => {
    expect(isIndexSegment(0)).toBe(true);
    expect(isIndexSegment('12')).toBe(true);
  });

  test('should reject other segments', () => {
    expect(isIndexSegment('a')).toBe(false);
    expect(isIndexSegment('1a')).toBe(false);
    expect(isIndexSegment('')).toBe(false);
    expect(isIndexSegment('01')).toBe(false);
    expect(isIndexSegment('-1')).toBe(false);
    expect(isIndexSegment(-1)).toBe(false);
    expect(isIndexSegment(1.5)).toBe(false);
    expect(isIndexSegment(NaN)).toBe(false);
    expect(isIndexSegment(Symbol('x'))).toBe(false);
  });
});

describe('assignOwnKey', () => {
  test('should assign ordinary keys directly', () => {
    const object: Record<string, unknown> = {};
    assignOwnKey(object, 'a', 1);
    assignOwnKey(object, 0, 'zero');
    expect(object).toEqual({ a: 1, 0: 'zero' });
  });

  test('should create an own enumerable __proto__ property instead of changing the prototype', () => {
    const object: Record<string, unknown> = {};
    assignOwnKey(object, '__proto__', [1]);
    expect(Object.prototype.hasOwnProperty.call(object, '__proto__')).toBe(true);
    expect(Object.getPrototypeOf(object)).toBe(Object.prototype);
    expect(Object.keys(object)).toEqual(['__proto__']);
    expect(({} as any).length).toBeUndefined();
  });

  test('should overwrite an existing own __proto__ property', () => {
    const object: Record<string, unknown> = {};
    assignOwnKey(object, '__proto__', 1);
    assignOwnKey(object, '__proto__', 2);
    expect(Object.getOwnPropertyDescriptor(object, '__proto__')?.value).toBe(2);
  });
});

describe('parsePath quoted segments (second review)', () => {
  test('should keep "]" and "." inside quoted segments', () => {
    expect(parsePath('a["b]c"]')).toEqual(['a', 'b]c']);
    expect(parsePath("a['b.c'].d")).toEqual(['a', 'b.c', 'd']);
  });

  test('should resolve backslash escapes inside quoted segments', () => {
    expect(parsePath('a["b\\"c"]')).toEqual(['a', 'b"c']);
    expect(parsePath("a['it\\'s']")).toEqual(['a', "it's"]);
    expect(parsePath('a["x\\\\y"]')).toEqual(['a', 'x\\y']);
  });

  test('should fall back to raw bracket parsing for malformed quotes', () => {
    expect(parsePath('a["b]')).toEqual(['a', '"b']);
    expect(parsePath('a["b"c]')).toEqual(['a', '"b"c']);
  });
});

describe('isIndexSegment upper bound', () => {
  test('should reject numbers above the maximum array index', () => {
    expect(isIndexSegment(4294967294)).toBe(true);
    expect(isIndexSegment(4294967295)).toBe(false);
    expect(isIndexSegment(1e21)).toBe(false);
    expect(isIndexSegment('4294967295')).toBe(false);
  });
});
