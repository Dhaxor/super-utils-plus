import { kebabCase } from '../kebabCase.js';
import { camelCase } from '../camelCase.js';
import { snakeCase } from '../snakeCase.js';

describe('kebabCase', () => {
  test('should convert space separated words', () => {
    expect(kebabCase('Foo Bar')).toBe('foo-bar');
    expect(kebabCase('hello world')).toBe('hello-world');
  });

  test('should convert camel cased words', () => {
    expect(kebabCase('fooBar')).toBe('foo-bar');
    expect(kebabCase('fooBarBaz')).toBe('foo-bar-baz');
  });

  test('should convert screaming snake case', () => {
    expect(kebabCase('__FOO_BAR__')).toBe('foo-bar');
  });

  test('should lower-case acronyms', () => {
    expect(kebabCase('XMLHttpRequest')).toBe('xml-http-request');
  });

  test('should treat digits as separate words', () => {
    expect(kebabCase('HTML5Parser')).toBe('html-5-parser');
    expect(kebabCase('foo2bar')).toBe('foo-2-bar');
  });

  test('should lower-case a single word', () => {
    expect(kebabCase('Foo')).toBe('foo');
    expect(kebabCase('FOO')).toBe('foo');
  });

  test('should leave an already kebab cased string unchanged', () => {
    expect(kebabCase('foo-bar')).toBe('foo-bar');
  });

  test('should return an empty string for an empty string', () => {
    expect(kebabCase('')).toBe('');
  });

  test('should return an empty string when there are no words', () => {
    expect(kebabCase('---')).toBe('');
  });
});

describe('case converters with apostrophes, ordinals, and accents', () => {
  test('should drop apostrophes so contractions stay one word', () => {
    expect(kebabCase("don't stop")).toBe('dont-stop');
    expect(snakeCase("it's 1st")).toBe('its_1st');
    expect(camelCase('don\u2019t stop')).toBe('dontStop');
  });

  test('should keep ordinals together', () => {
    expect(kebabCase('1st place')).toBe('1st-place');
  });

  test('should deburr accented letters', () => {
    expect(kebabCase('Cr\u00e8me Br\u00fbl\u00e9e')).toBe('creme-brulee');
    expect(snakeCase('Stra\u00dfe')).toBe('strasse');
    expect(camelCase('\u00c6sir \u00d8st')).toBe('aesirOst');
  });
});
