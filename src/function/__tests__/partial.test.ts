import { partial, partialRight } from '../partial.js';

function greet(greeting: string, name: string) {
  return `${greeting} ${name}`;
}

function collect(...args: unknown[]) {
  return args;
}

describe('partial', () => {
  test('should prepend partially applied arguments', () => {
    const sayHelloTo = partial(greet, 'hello');

    expect(sayHelloTo('fred')).toBe('hello fred');
  });

  test('should work without partially applied arguments', () => {
    expect(partial(collect)(1, 2)).toEqual([1, 2]);
    expect(partial(collect)()).toEqual([]);
  });

  test('should apply all partials when called without arguments', () => {
    expect(partial(greet, 'hello', 'fred')()).toBe('hello fred');
  });

  test('should append extra arguments after the partials', () => {
    expect(partial(collect, 1, 2)(3, 4)).toEqual([1, 2, 3, 4]);
  });

  test('should fill placeholders in order', () => {
    const placeholder = partial.placeholder;

    expect(partial(greet, placeholder, 'fred')('hi')).toBe('hi fred');
    expect(partial(collect, placeholder, 'b', placeholder)('a', 'c')).toEqual(['a', 'b', 'c']);
    expect(partial(collect, placeholder, placeholder, 'c')('a', 'b')).toEqual(['a', 'b', 'c']);
    expect(partial(collect, 'a', placeholder)('b')).toEqual(['a', 'b']);
  });

  test('should append arguments left over after filling placeholders', () => {
    const placeholder = partial.placeholder;

    expect(partial(collect, placeholder, 'b')('a', 'c', 'd')).toEqual(['a', 'b', 'c', 'd']);
  });

  test('should not mutate the partials between calls', () => {
    const placeholder = partial.placeholder;
    const partials = [placeholder, 'b'];
    const applied = partial(collect, ...partials);

    expect(applied('a')).toEqual(['a', 'b']);
    expect(applied('x')).toEqual(['x', 'b']);
    expect(partials).toEqual([placeholder, 'b']);
  });

  test('should expose a symbol placeholder', () => {
    expect(typeof partial.placeholder).toBe('symbol');
  });

  test('should preserve the this binding', () => {
    const object = {
      greeting: 'hi',
      greet: partial(function (this: { greeting: string }, name: string, punctuation: string) {
        return `${this.greeting} ${name}${punctuation}`;
      }, 'fred'),
    };

    expect(object.greet('!')).toBe('hi fred!');

    const other = { greeting: 'hello', greet: object.greet };
    expect(other.greet('?')).toBe('hello fred?');
  });

  test('should preserve the this binding when invoked with call', () => {
    const applied = partial(function (this: unknown, ...args: unknown[]) {
      return [this, ...args];
    }, 1);
    const context = { name: 'context' };

    expect(applied.call(context, 2)).toEqual([context, 1, 2]);
  });
});

describe('partialRight', () => {
  test('should append partially applied arguments', () => {
    const greetFred = partialRight(greet, 'fred');

    expect(greetFred('hi')).toBe('hi fred');
  });

  test('should work without partially applied arguments', () => {
    expect(partialRight(collect)(1, 2)).toEqual([1, 2]);
    expect(partialRight(collect)()).toEqual([]);
  });

  test('should apply all partials when called without arguments', () => {
    expect(partialRight(greet, 'hello', 'fred')()).toBe('hello fred');
  });

  test('should prepend extra arguments before the partials', () => {
    expect(partialRight(collect, 'c')('a', 'b')).toEqual(['a', 'b', 'c']);
    expect(partialRight(collect, 'c', 'd')('a', 'b')).toEqual(['a', 'b', 'c', 'd']);
  });

  test('should fill placeholders from the right', () => {
    const placeholder = partialRight.placeholder;

    expect(partialRight(greet, 'hi', placeholder)('fred')).toBe('hi fred');
    expect(partialRight(collect, placeholder, 'b', placeholder)('a', 'c')).toEqual(['a', 'b', 'c']);
    expect(partialRight(collect, 'a', placeholder, placeholder)('b', 'c')).toEqual(['a', 'b', 'c']);
    expect(partialRight(collect, placeholder, 'b')('a')).toEqual(['a', 'b']);
  });

  test('should prepend arguments left over after filling placeholders', () => {
    const placeholder = partialRight.placeholder;

    expect(partialRight(collect, placeholder, 'c')('a', 'b')).toEqual(['a', 'b', 'c']);
    expect(partialRight(collect, 'x', placeholder)('a', 'b', 'c')).toEqual(['a', 'b', 'x', 'c']);
    expect(partialRight(collect, placeholder, 'b', placeholder)('a', 'c', 'd')).toEqual([
      'a',
      'c',
      'b',
      'd',
    ]);
  });

  test('should not mutate the partials between calls', () => {
    const placeholder = partialRight.placeholder;
    const partials = ['a', placeholder];
    const applied = partialRight(collect, ...partials);

    expect(applied('b')).toEqual(['a', 'b']);
    expect(applied('x')).toEqual(['a', 'x']);
    expect(partials).toEqual(['a', placeholder]);
  });

  test('should expose a symbol placeholder', () => {
    expect(typeof partialRight.placeholder).toBe('symbol');
  });

  test('should preserve the this binding', () => {
    const object = {
      greeting: 'hi',
      greet: partialRight(function (this: { greeting: string }, name: string, punctuation: string) {
        return `${this.greeting} ${name}${punctuation}`;
      }, '!'),
    };

    expect(object.greet('fred')).toBe('hi fred!');

    const other = { greeting: 'hello', greet: object.greet };
    expect(other.greet('barney')).toBe('hello barney!');
  });

  test('should preserve the this binding when invoked with call', () => {
    const applied = partialRight(function (this: unknown, ...args: unknown[]) {
      return [this, ...args];
    }, 2);
    const context = { name: 'context' };

    expect(applied.call(context, 1)).toEqual([context, 1, 2]);
  });
});

describe('partial placeholders (Lodash parity)', () => {
  const collect = (...args: unknown[]) => args;

  test('partial and partialRight should share one placeholder symbol', () => {
    expect(partial.placeholder).toBe(partialRight.placeholder);
  });

  test('partial should pass undefined for placeholders that are not filled', () => {
    const placeholder = partial.placeholder;
    expect(partial(collect, placeholder, 'b', placeholder)('a')).toEqual(['a', 'b', undefined]);
    expect(partial(collect, placeholder)()).toEqual([undefined]);
  });

  test('partialRight should pass undefined for placeholders that are not filled', () => {
    const placeholder = partialRight.placeholder;
    expect(partialRight(collect, placeholder, 'b', placeholder)('c')).toEqual([
      undefined,
      'b',
      'c',
    ]);
    expect(partialRight(collect, placeholder)()).toEqual([undefined]);
  });
});
