import { trim, trimStart, trimEnd } from '../trim.js';

describe('trim', () => {
  test('should remove leading and trailing whitespace by default', () => {
    expect(trim('  abc  ')).toBe('abc');
    expect(trim('\t\n abc \r\n')).toBe('abc');
  });

  test('should remove leading and trailing custom characters', () => {
    expect(trim('-_-abc-_-', '_-')).toBe('abc');
  });

  test('should treat regex-special characters literally', () => {
    expect(trim('[abc]', '[]')).toBe('abc');
    expect(trim('...a.b...', '.')).toBe('a.b');
    expect(trim('(abc)', '()')).toBe('abc');
    expect(trim('*abc*', '*')).toBe('abc');
  });

  test('should not interpret a dash as a character range', () => {
    expect(trim('a-z', 'a-z')).toBe('');
    expect(trim('b-b', 'a-z')).toBe('b-b');
  });

  test('should not remove whitespace when custom characters are given', () => {
    expect(trim('  abc  ', '-')).toBe('  abc  ');
  });

  test('should return the string unchanged when no characters match', () => {
    expect(trim('abc', '-')).toBe('abc');
    expect(trim('  abc  ', '')).toBe('  abc  ');
  });

  test('should return an empty string when the string consists only of trimmed characters', () => {
    expect(trim('   ')).toBe('');
    expect(trim('---', '-')).toBe('');
    expect(trim('-_-_', '_-')).toBe('');
  });

  test('should return an empty string for an empty string', () => {
    expect(trim('')).toBe('');
    expect(trim('', '-')).toBe('');
  });
});

describe('trimStart', () => {
  test('should remove leading whitespace by default', () => {
    expect(trimStart('  abc  ')).toBe('abc  ');
    expect(trimStart('\t\n abc')).toBe('abc');
  });

  test('should remove leading custom characters', () => {
    expect(trimStart('-_-abc-_-', '_-')).toBe('abc-_-');
  });

  test('should treat regex-special characters literally', () => {
    expect(trimStart('[abc]', '[]')).toBe('abc]');
    expect(trimStart('...a.b...', '.')).toBe('a.b...');
  });

  test('should not interpret a dash as a character range', () => {
    expect(trimStart('a-z', 'a-z')).toBe('');
    expect(trimStart('b-b', 'a-z')).toBe('b-b');
  });

  test('should return the string unchanged when no characters match', () => {
    expect(trimStart('abc  ', '-')).toBe('abc  ');
  });

  test('should return an empty string when the string consists only of trimmed characters', () => {
    expect(trimStart('   ')).toBe('');
    expect(trimStart('---', '-')).toBe('');
  });

  test('should return an empty string for an empty string', () => {
    expect(trimStart('')).toBe('');
    expect(trimStart('', '-')).toBe('');
  });
});

describe('trimEnd', () => {
  test('should remove trailing whitespace by default', () => {
    expect(trimEnd('  abc  ')).toBe('  abc');
    expect(trimEnd('abc \r\n')).toBe('abc');
  });

  test('should remove trailing custom characters', () => {
    expect(trimEnd('-_-abc-_-', '_-')).toBe('-_-abc');
  });

  test('should treat regex-special characters literally', () => {
    expect(trimEnd('[abc]', '[]')).toBe('[abc');
    expect(trimEnd('...a.b...', '.')).toBe('...a.b');
  });

  test('should not interpret a dash as a character range', () => {
    expect(trimEnd('a-z', 'a-z')).toBe('');
    expect(trimEnd('b-b', 'a-z')).toBe('b-b');
  });

  test('should return the string unchanged when no characters match', () => {
    expect(trimEnd('  abc', '-')).toBe('  abc');
  });

  test('should return an empty string when the string consists only of trimmed characters', () => {
    expect(trimEnd('   ')).toBe('');
    expect(trimEnd('---', '-')).toBe('');
  });

  test('should return an empty string for an empty string', () => {
    expect(trimEnd('')).toBe('');
    expect(trimEnd('', '-')).toBe('');
  });
});

describe('trim with nil chars', () => {
  test('should trim whitespace when chars is null or undefined', () => {
    expect(trim('  a  ', null as any)).toBe('a');
    expect(trimStart('  a  ', null as any)).toBe('a  ');
    expect(trimEnd('  a  ', undefined)).toBe('  a');
  });
});
