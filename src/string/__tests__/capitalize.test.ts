import { capitalize, capitalizeFirst, titleCase } from '../capitalize.js';

describe('capitalize', () => {
  test('should upper-case the first character and lower-case the rest', () => {
    expect(capitalize('FRED')).toBe('Fred');
    expect(capitalize('fred')).toBe('Fred');
    expect(capitalize('fRED bARNEY')).toBe('Fred barney');
  });

  test('should handle a single character', () => {
    expect(capitalize('a')).toBe('A');
    expect(capitalize('A')).toBe('A');
  });

  test('should leave a leading non-letter unchanged', () => {
    expect(capitalize('1abc')).toBe('1abc');
    expect(capitalize(' abc')).toBe(' abc');
  });

  test('should return an empty string for an empty string', () => {
    expect(capitalize('')).toBe('');
  });
});

describe('capitalizeFirst', () => {
  test('should upper-case the first character only', () => {
    expect(capitalizeFirst('fred')).toBe('Fred');
    expect(capitalizeFirst('fred Barney')).toBe('Fred Barney');
  });

  test('should leave the rest of the string unchanged', () => {
    expect(capitalizeFirst('FRED')).toBe('FRED');
    expect(capitalizeFirst('fRED')).toBe('FRED');
  });

  test('should handle a single character', () => {
    expect(capitalizeFirst('a')).toBe('A');
  });

  test('should leave a leading non-letter unchanged', () => {
    expect(capitalizeFirst('1abc')).toBe('1abc');
  });

  test('should return an empty string for an empty string', () => {
    expect(capitalizeFirst('')).toBe('');
  });
});

describe('titleCase', () => {
  test('should upper-case the first letter of each word', () => {
    expect(titleCase('fred, barney, and pebbles')).toBe('Fred, Barney, And Pebbles');
    expect(titleCase('hello world')).toBe('Hello World');
  });

  test('should keep contractions as a single word', () => {
    expect(titleCase("don't")).toBe("Don't");
    expect(titleCase("don't stop me now")).toBe("Don't Stop Me Now");
    expect(titleCase('don’t')).toBe('Don’t');
  });

  test('should leave digits untouched', () => {
    expect(titleCase('version 2 beta')).toBe('Version 2 Beta');
    expect(titleCase('3rd place')).toBe('3rd Place');
    expect(titleCase('abc123')).toBe('Abc123');
  });

  test('should leave punctuation, spacing and the rest of each word unchanged', () => {
    expect(titleCase('hello-world')).toBe('Hello-World');
    expect(titleCase('  two  spaces  ')).toBe('  Two  Spaces  ');
    expect(titleCase('fooBar bAZ')).toBe('FooBar BAZ');
  });

  test('should leave an already title cased string unchanged', () => {
    expect(titleCase('Fred, Barney, And Pebbles')).toBe('Fred, Barney, And Pebbles');
  });

  test('should return an empty string for an empty string', () => {
    expect(titleCase('')).toBe('');
  });
});
