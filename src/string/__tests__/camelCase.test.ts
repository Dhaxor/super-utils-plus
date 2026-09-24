import { camelCase } from '../camelCase.js';

describe('camelCase', () => {
  test('should convert space separated words', () => {
    expect(camelCase('Foo Bar')).toBe('fooBar');
    expect(camelCase('hello world')).toBe('helloWorld');
  });

  test('should convert dash separated words and ignore surrounding dashes', () => {
    expect(camelCase('--foo-bar--')).toBe('fooBar');
  });

  test('should convert screaming snake case', () => {
    expect(camelCase('__FOO_BAR__')).toBe('fooBar');
  });

  test('should lower-case acronyms', () => {
    expect(camelCase('XMLHttpRequest')).toBe('xmlHttpRequest');
  });

  test('should treat digits as separate words', () => {
    expect(camelCase('foo2bar')).toBe('foo2Bar');
    expect(camelCase('HTML5Parser')).toBe('html5Parser');
  });

  test('should lower-case a single word', () => {
    expect(camelCase('foo')).toBe('foo');
    expect(camelCase('FOO')).toBe('foo');
    expect(camelCase('Foo')).toBe('foo');
  });

  test('should leave an already camel cased string unchanged', () => {
    expect(camelCase('fooBarBaz')).toBe('fooBarBaz');
  });

  test('should return an empty string for an empty string', () => {
    expect(camelCase('')).toBe('');
  });

  test('should return an empty string when there are no words', () => {
    expect(camelCase('---')).toBe('');
  });
});
