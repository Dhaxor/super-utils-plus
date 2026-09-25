import { words } from '../words.js';

describe('words', () => {
  test('should split a string into words using the default pattern', () => {
    expect(words('fred, barney, & pebbles')).toEqual(['fred', 'barney', 'pebbles']);
    expect(words('hello world')).toEqual(['hello', 'world']);
  });

  test('should keep acronyms together', () => {
    expect(words('XMLHttpRequest')).toEqual(['XML', 'Http', 'Request']);
    expect(words('safe HTML')).toEqual(['safe', 'HTML']);
  });

  test('should split camel cased words', () => {
    expect(words('fooBar')).toEqual(['foo', 'Bar']);
    expect(words('fooBarBaz')).toEqual(['foo', 'Bar', 'Baz']);
  });

  test('should split screaming snake case', () => {
    expect(words('__FOO_BAR__')).toEqual(['FOO', 'BAR']);
  });

  test('should treat runs of digits as words', () => {
    expect(words('foo2bar')).toEqual(['foo', '2', 'bar']);
    expect(words('HTML5Parser')).toEqual(['HTML', '5', 'Parser']);
    expect(words('enable 6h format')).toEqual(['enable', '6', 'h', 'format']);
  });

  test('should treat a lone upper-case letter as a word', () => {
    expect(words('ABc')).toEqual(['A', 'Bc']);
  });

  test('should keep common contractions together', () => {
    expect(words("don't stop")).toEqual(["don't", 'stop']);
    expect(words("we're they've it's")).toEqual(["we're", "they've", "it's"]);
    expect(words('don’t')).toEqual(['don’t']);
  });

  test('should not treat an apostrophe followed by an unknown suffix as a contraction', () => {
    expect(words("rock'n'roll")).toEqual(['rock', 'n', 'roll']);
  });

  test('should keep runs of letters without case together', () => {
    expect(words('日本語 text')).toEqual(['日本語', 'text']);
  });

  test('should return an empty array for an empty string', () => {
    expect(words('')).toEqual([]);
  });

  test('should return an empty array when nothing matches', () => {
    expect(words('!!! ---')).toEqual([]);
  });

  test('should use a custom global RegExp pattern', () => {
    expect(words('fred, barney, & pebbles', /[^, ]+/g)).toEqual(['fred', 'barney', '&', 'pebbles']);
  });

  test('should use a custom non-global RegExp pattern and match all occurrences', () => {
    expect(words('fred, barney, & pebbles', /[^, ]+/)).toEqual(['fred', 'barney', '&', 'pebbles']);
    expect(words('Foo Bar', /[a-z]+/i)).toEqual(['Foo', 'Bar']);
  });

  test('should use a custom string pattern', () => {
    expect(words('fred, barney, & pebbles', '[^, ]+')).toEqual(['fred', 'barney', '&', 'pebbles']);
    expect(words('a1b2c3', '\\d')).toEqual(['1', '2', '3']);
  });

  test('should return an empty array when a custom pattern matches nothing', () => {
    expect(words('abc', /\d+/g)).toEqual([]);
    expect(words('abc', /\d+/)).toEqual([]);
    expect(words('abc', '\\d+')).toEqual([]);
  });
});

describe('words ordinals', () => {
  test('should keep ordinals as single words', () => {
    expect(words('1st place 22nd 11th 3RD 4th 10th')).toEqual([
      '1st',
      'place',
      '22nd',
      '11th',
      '3RD',
      '4th',
      '10th',
    ]);
  });

  test('should not treat digits followed by other letters as ordinals', () => {
    expect(words('1stuff')).toEqual(['1', 'stuff']);
  });
});

describe('words with decomposed and titlecase letters (second review)', () => {
  test('should keep combining marks attached to their base letters', () => {
    expect(words('d\u00e9j\u00e0 vu'.normalize('NFD'))).toEqual(['de\u0301ja\u0300', 'vu']);
    expect(words('De\u0301ja\u0300Vu')).toEqual(['De\u0301ja\u0300', 'Vu']);
  });

  test('should match titlecase letters', () => {
    expect(words('\u01c5\u01c8\u01cb')).toEqual(['\u01c5\u01c8\u01cb']);
  });
});
