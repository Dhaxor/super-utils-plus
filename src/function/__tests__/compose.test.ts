import { compose, pipe } from '../compose.js';

const add1 = (x: number) => x + 1;
const multiply2 = (x: number) => x * 2;
const subtract3 = (x: number) => x - 3;
const add = (a: number, b: number) => a + b;

describe('compose', () => {
  test('should compose functions from right to left', () => {
    const composed = compose(subtract3, multiply2, add1);

    expect(composed(5)).toBe(9);
    expect(composed(0)).toBe(-1);
  });

  test('should invoke the rightmost function first', () => {
    const calls: string[] = [];
    const a = (x: number) => {
      calls.push('a');
      return x;
    };
    const b = (x: number) => {
      calls.push('b');
      return x;
    };
    const c = (x: number) => {
      calls.push('c');
      return x;
    };

    compose(a, b, c)(1);

    expect(calls).toEqual(['c', 'b', 'a']);
  });

  test('should pass the result of each function to the next', () => {
    const toUpper = (s: string) => s.toUpperCase();
    const describe = (n: number) => `value=${n}`;

    expect(compose(toUpper, describe, add1)(1)).toBe('VALUE=2');
  });

  test('should return the identity function when given no functions', () => {
    const identity = compose();
    const object = { a: 1 };

    expect(identity(5)).toBe(5);
    expect(identity('a')).toBe('a');
    expect(identity(object)).toBe(object);
    expect(identity(undefined)).toBeUndefined();
  });

  test('should return the function as-is when given a single function', () => {
    expect(compose(add1)).toBe(add1);
    expect(compose(add1)(1)).toBe(2);
  });

  test('should pass multiple arguments to the first function invoked', () => {
    const composed = compose(multiply2, add) as (...args: number[]) => number;

    expect(composed(2, 3)).toBe(10);
  });

  test('should work with two functions', () => {
    expect(compose(multiply2, add1)(4)).toBe(10);
  });
});

describe('pipe', () => {
  test('should compose functions from left to right', () => {
    const piped = pipe(add1, multiply2, subtract3);

    expect(piped(5)).toBe(9);
    expect(piped(0)).toBe(-1);
  });

  test('should invoke the leftmost function first', () => {
    const calls: string[] = [];
    const a = (x: number) => {
      calls.push('a');
      return x;
    };
    const b = (x: number) => {
      calls.push('b');
      return x;
    };
    const c = (x: number) => {
      calls.push('c');
      return x;
    };

    pipe(a, b, c)(1);

    expect(calls).toEqual(['a', 'b', 'c']);
  });

  test('should pass the result of each function to the next', () => {
    const toUpper = (s: string) => s.toUpperCase();
    const describe = (n: number) => `value=${n}`;

    expect(pipe(add1, describe, toUpper)(1)).toBe('VALUE=2');
  });

  test('should return the identity function when given no functions', () => {
    const identity = pipe();
    const object = { a: 1 };

    expect(identity(5)).toBe(5);
    expect(identity('a')).toBe('a');
    expect(identity(object)).toBe(object);
    expect(identity(undefined)).toBeUndefined();
  });

  test('should return the function as-is when given a single function', () => {
    expect(pipe(add1)).toBe(add1);
    expect(pipe(add1)(1)).toBe(2);
  });

  test('should pass multiple arguments to the first function invoked', () => {
    const piped = pipe(add, multiply2) as (...args: number[]) => number;

    expect(piped(2, 3)).toBe(10);
  });

  test('should be the reverse of compose', () => {
    expect(pipe(add1, multiply2, subtract3)(7)).toBe(compose(subtract3, multiply2, add1)(7));
  });
});
