import { snakeCase } from '../snakeCase.js';

describe('snakeCase', () => {
  test('should convert space separated words', () => {
    expect(snakeCase('Foo Bar')).toBe('foo_bar');
    expect(snakeCase('hello world')).toBe('hello_world');
  });

  test('should convert camel cased words', () => {
    expect(snakeCase('fooBar')).toBe('foo_bar');
    expect(snakeCase('fooBarBaz')).toBe('foo_bar_baz');
  });

  test('should convert screaming kebab case', () => {
    expect(snakeCase('--FOO-BAR--')).toBe('foo_bar');
  });

  test('should lower-case acronyms', () => {
    expect(snakeCase('XMLHttpRequest')).toBe('xml_http_request');
  });

  test('should treat digits as separate words', () => {
    expect(snakeCase('HTML5Parser')).toBe('html_5_parser');
    expect(snakeCase('foo2bar')).toBe('foo_2_bar');
  });

  test('should lower-case a single word', () => {
    expect(snakeCase('Foo')).toBe('foo');
    expect(snakeCase('FOO')).toBe('foo');
  });

  test('should leave an already snake cased string unchanged', () => {
    expect(snakeCase('foo_bar')).toBe('foo_bar');
  });

  test('should return an empty string for an empty string', () => {
    expect(snakeCase('')).toBe('');
  });

  test('should return an empty string when there are no words', () => {
    expect(snakeCase('___')).toBe('');
  });
});
