import { pad, padEnd, padStart } from '../../index';

describe('pad', () => {
  test('should pad both sides with spaces by default', () => {
    expect(pad('abc', 8)).toBe('  abc   ');
  });

  test('should pad both sides with custom characters', () => {
    expect(pad('abc', 8, '_-')).toBe('_-abc_-_');
  });

  test('should return the original string when no padding is needed', () => {
    expect(pad('abcdef', 3)).toBe('abcdef');
  });
});

describe('padStart', () => {
  test('should pad the start of a string', () => {
    expect(padStart('abc', 6)).toBe('   abc');
    expect(padStart('abc', 6, '_-')).toBe('_-_abc');
  });

  test('should return the original string for empty padding chars', () => {
    expect(padStart('abc', 6, '')).toBe('abc');
  });
});

describe('padEnd', () => {
  test('should pad the end of a string', () => {
    expect(padEnd('abc', 6)).toBe('abc   ');
    expect(padEnd('abc', 6, '_-')).toBe('abc_-_');
  });

  test('should return the original string for empty padding chars', () => {
    expect(padEnd('abc', 6, '')).toBe('abc');
  });
});