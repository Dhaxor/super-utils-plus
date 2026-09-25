import { truncate } from '../truncate.js';

describe('truncate', () => {
  test('should truncate to 30 characters with "..." by default', () => {
    expect(truncate('hi-diddly-ho there, neighborino')).toBe('hi-diddly-ho there, neighbo...');
    expect(truncate('a'.repeat(31))).toBe('a'.repeat(27) + '...');
  });

  test('should use a custom length and omission', () => {
    expect(
      truncate('hi-diddly-ho there, neighborino', {
        length: 24,
        omission: ' [...]',
      })
    ).toBe('hi-diddly-ho there [...]');
    expect(truncate('hello world', { length: 8, omission: '~' })).toBe('hello w~');
  });

  test('should cut at the last string separator before the limit', () => {
    expect(
      truncate('hi-diddly-ho there, neighborino', {
        length: 24,
        omission: ' [...]',
        separator: ' ',
      })
    ).toBe('hi-diddly-ho [...]');
    expect(truncate('hi there friend', { length: 9, omission: '..', separator: ' ' })).toBe('hi..');
  });

  test('should cut at the last RegExp separator before the limit', () => {
    expect(
      truncate('hi-diddly-ho there, neighborino', {
        length: 24,
        omission: ' [...]',
        separator: /,? +/,
      })
    ).toBe('hi-diddly-ho there [...]');
    expect(
      truncate('hi-diddly-ho there, neighborino', {
        length: 22,
        omission: ' [...]',
        separator: /,? +/,
      })
    ).toBe('hi-diddly-ho [...]');
  });

  test('should accept a global RegExp separator and leave it reusable', () => {
    const separator = /,? +/g;
    const options = { length: 22, omission: ' [...]', separator };

    expect(truncate('hi-diddly-ho there, neighborino', options)).toBe('hi-diddly-ho [...]');
    expect(truncate('hi-diddly-ho there, neighborino', options)).toBe('hi-diddly-ho [...]');
    expect(separator.lastIndex).toBe(0);
  });

  test('should not remove more when the cut already lands on a separator', () => {
    expect(truncate('hi there friend', { length: 10, omission: '..', separator: ' ' })).toBe(
      'hi there..'
    );
    expect(
      truncate('hi-diddly-ho there, neighborino', {
        length: 24,
        omission: ' [...]',
        separator: /,? +/,
      })
    ).toBe('hi-diddly-ho there [...]');
    expect(
      truncate('hi-diddly-ho there, neighborino', {
        length: 24,
        omission: ' [...]',
        separator: /,? +/g,
      })
    ).toBe('hi-diddly-ho there [...]');
  });

  test('should keep the plain cut when the separator does not occur before the limit', () => {
    expect(truncate('abcdefghij', { length: 6, separator: ' ' })).toBe('abc...');
    expect(truncate('abcdefghij', { length: 6, separator: /\s/ })).toBe('abc...');
  });

  test('should handle zero-length RegExp separator matches', () => {
    expect(truncate('fooBarBazQux', { length: 9, omission: '..', separator: /(?=[A-Z])/ })).toBe(
      'fooBar..'
    );
  });

  test('should return the string unchanged when it is not longer than length', () => {
    expect(truncate('a'.repeat(30))).toBe('a'.repeat(30));
    expect(truncate('hi', { length: 5 })).toBe('hi');
    expect(truncate('hello', { length: 5 })).toBe('hello');
    expect(truncate('hi there', { length: 8, separator: ' ' })).toBe('hi there');
  });

  test('should return only the omission when it is not shorter than length', () => {
    expect(truncate('abcdef', { length: 3 })).toBe('...');
    expect(truncate('abcdef', { length: 2, omission: '...' })).toBe('...');
  });

  test('should return an empty string for an empty string', () => {
    expect(truncate('')).toBe('');
    expect(truncate('', { length: 5 })).toBe('');
  });
});
