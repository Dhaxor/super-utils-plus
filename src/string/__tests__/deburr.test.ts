import { deburr } from '../deburr.js';

describe('deburr', () => {
  test('should remove combining diacritical marks', () => {
    expect(deburr('d\u00e9j\u00e0 vu')).toBe('deja vu');
    expect(deburr('\u00c0\u00c1\u00c2\u00c3\u00c4\u00c5')).toBe('AAAAAA');
    expect(deburr('cr\u00e8me br\u00fbl\u00e9e')).toBe('creme brulee');
  });

  test('should replace Latin letters without a base-letter decomposition', () => {
    expect(deburr('Stra\u00dfe')).toBe('Strasse');
    expect(deburr('\u00c6\u00e6\u00d8\u00f8\u0141\u0142\u0152\u0153')).toBe('AeaeOoLlOeoe');
    expect(deburr('\u00d0\u00f0\u00de\u00fe\u0110\u0111')).toBe('DdThthDd');
  });

  test('should leave plain ASCII and empty input alone', () => {
    expect(deburr('hello world')).toBe('hello world');
    expect(deburr('')).toBe('');
    expect(deburr(null as any)).toBe('');
  });
});

describe('deburr coverage (second review)', () => {
  test('should replace every Latin Extended-A letter without a decomposition', () => {
    expect(deburr('\u0138\u013f\u0140\u0149\u014a\u014b')).toBe("kLl'nNn");
  });

  test('should remove combining marks outside the basic diacritics block', () => {
    expect(deburr('a\u20d0b')).toBe('ab');
  });
});
