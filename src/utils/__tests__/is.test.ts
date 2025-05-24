import { 
  isNil,
  isNumber,
  isEqual
} from '../is';

describe('Type checking functions', () => {
  describe('isNil', () => {
    test('should identify null and undefined as nil', () => {
      expect(isNil(null)).toBe(true);
      expect(isNil(undefined)).toBe(true);
    });

    test('should identify non-nil values', () => {
      expect(isNil(0)).toBe(false);
      expect(isNil('')).toBe(false);
      expect(isNil(false)).toBe(false);
      expect(isNil(NaN)).toBe(false);
    });
  });

  describe('isNumber', () => {
    test('should identify numbers', () => {
      expect(isNumber(1)).toBe(true);
      expect(isNumber(0)).toBe(true);
      expect(isNumber(-1)).toBe(true);
      expect(isNumber(1.5)).toBe(true);
    });

    test('should reject non-numbers', () => {
      expect(isNumber('1')).toBe(false);
      expect(isNumber([])).toBe(false);
      expect(isNumber({})).toBe(false);
      expect(isNumber(null)).toBe(false);
      expect(isNumber(undefined)).toBe(false);
    });

    test('should reject NaN unlike Lodash', () => {
      expect(isNumber(NaN)).toBe(false);
    });
  });

  describe('isEqual', () => {
    test('should compare primitive values', () => {
      expect(isEqual(1, 1)).toBe(true);
      expect(isEqual('a', 'a')).toBe(true);
      expect(isEqual(true, true)).toBe(true);
      expect(isEqual(null, null)).toBe(true);
      expect(isEqual(undefined, undefined)).toBe(true);
      expect(isEqual(1, 2)).toBe(false);
      expect(isEqual('a', 'b')).toBe(false);
      expect(isEqual(true, false)).toBe(false);
      expect(isEqual(null, undefined)).toBe(false);
    });

    test('should handle NaN properly', () => {
      expect(isEqual(NaN, NaN)).toBe(true);
    });

    test('should compare arrays', () => {
      expect(isEqual([1, 2, 3], [1, 2, 3])).toBe(true);
      expect(isEqual([1, 2, 3], [1, 2, 4])).toBe(false);
      expect(isEqual([1, 2, 3], [1, 2])).toBe(false);
    });

    test('should compare objects', () => {
      expect(isEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
      expect(isEqual({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(false);
      expect(isEqual({ a: 1, b: 2 }, { a: 1 })).toBe(false);
    });

    test('should compare nested structures', () => {
      expect(isEqual(
        { a: 1, b: { c: 2, d: [3, 4] } },
        { a: 1, b: { c: 2, d: [3, 4] } }
      )).toBe(true);
      expect(isEqual(
        { a: 1, b: { c: 2, d: [3, 4] } },
        { a: 1, b: { c: 2, d: [3, 5] } }
      )).toBe(false);
    });

    test('should compare dates', () => {
      const date1 = new Date('2022-01-01');
      const date2 = new Date('2022-01-01');
      const date3 = new Date('2022-01-02');
      expect(isEqual(date1, date2)).toBe(true);
      expect(isEqual(date1, date3)).toBe(false);
    });

    test('should compare regexps', () => {
      expect(isEqual(/abc/g, /abc/g)).toBe(true);
      expect(isEqual(/abc/g, /abc/i)).toBe(false);
      expect(isEqual(/abc/g, /def/g)).toBe(false);
    });
  });
});