import { pad, padEnd, padStart } from '../../index.js';

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

  test('should treat nil input as an empty string', () => {
    expect(pad(undefined as any, 3)).toBe('   ');
    expect(pad(null as any, 2, '*')).toBe('**');
    expect(padStart(null as any, 2)).toBe('  ');
    expect(padEnd(undefined as any, 2)).toBe('  ');
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

  test('should return the original string when it is already long enough', () => {
    expect(padStart('abcdef', 3)).toBe('abcdef');
    expect(padStart('abc')).toBe('abc');
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

  test('should return the original string when it is already long enough', () => {
    expect(padEnd('abcdef', 3)).toBe('abcdef');
    expect(padEnd('abc')).toBe('abc');
  });
});
