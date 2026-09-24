import { curry, curryRight } from '../curry.js';

function abc(a: unknown, b: unknown, c: unknown) {
  return [a, b, c];
}

describe('curry', () => {
  test('should curry a function one argument at a time', () => {
    const curried = curry(abc);

    expect(curried(1)(2)(3)).toEqual([1, 2, 3]);
  });

  test('should accept multiple arguments per call', () => {
    const curried = curry(abc);

    expect(curried(1, 2)(3)).toEqual([1, 2, 3]);
    expect(curried(1)(2, 3)).toEqual([1, 2, 3]);
  });

  test('should invoke immediately when all arguments are provided at once', () => {
    const curried = curry(abc);

    expect(curried(1, 2, 3)).toEqual([1, 2, 3]);
  });

  test('should return a function while arguments are still missing', () => {
    const curried = curry(abc);

    expect(typeof curried()).toBe('function');
    expect(typeof curried(1)).toBe('function');
    expect(typeof curried(1, 2)).toBe('function');
    expect(curried()(1)(2)(3)).toEqual([1, 2, 3]);
  });

  test('should not invoke the original function until the arity is met', () => {
    const func = jest.fn(abc);
    const curried = curry(func);

    const withOne = curried(1);
    const withTwo = withOne(2);
    expect(func).not.toHaveBeenCalled();

    withTwo(3);
    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith(1, 2, 3);
  });

  test('should not share collected arguments between partial applications', () => {
    const curried = curry(abc);
    const withOne = curried(1);

    expect(withOne(2)(3)).toEqual([1, 2, 3]);
    expect(withOne(4)(5)).toEqual([1, 4, 5]);
    expect(withOne(2, 3)).toEqual([1, 2, 3]);
  });

  test('should pass extra arguments through to the function', () => {
    const rest = curry((...args: number[]) => args, 2);

    expect(rest(1, 2, 3)).toEqual([1, 2, 3]);
    expect(rest(1)(2, 3)).toEqual([1, 2, 3]);
  });

  test('should support an explicit arity', () => {
    const sum = (...args: number[]) => args.reduce((total, n) => total + n, 0);
    const curried = curry(sum, 3);

    expect(typeof curried(1)).toBe('function');
    expect(typeof curried(1, 2)).toBe('function');
    expect(curried(1)(2)(3)).toBe(6);
    expect(curried(1, 2)(3)).toBe(6);
    expect(curried(1, 2, 3)).toBe(6);
  });

  test('should allow an arity smaller than the function length', () => {
    const curried = curry(abc, 2);

    expect(curried(1)(2)).toEqual([1, 2, undefined]);
    expect(curried(1, 2)).toEqual([1, 2, undefined]);
  });

  test('should invoke immediately for an arity of zero', () => {
    expect(curry(() => 'done')()).toBe('done');
    expect(curry(abc, 0)()).toEqual([undefined, undefined, undefined]);
  });

  test('should preserve the this binding', () => {
    const object = {
      base: 10,
      add: curry(function (this: { base: number }, a: number, b: number) {
        return this.base + a + b;
      }),
    };

    expect(object.add(1)(2)).toBe(13);
    expect(object.add(1, 2)).toBe(13);

    const other = { base: 100, add: object.add };
    expect(other.add(1)(2)).toBe(103);
  });

  test('should preserve the this binding when invoked with call', () => {
    const curried = curry(function (this: { base: number }, a: number, b: number) {
      return this.base + a + b;
    });
    const context = { base: 5 };

    expect(curried.call(context, 1)(2)).toBe(8);
    expect(curried.call(context, 1, 2)).toBe(8);
  });
});

describe('curryRight', () => {
  test('should curry a function one argument at a time, prepending each argument', () => {
    const curried = curryRight(abc);

    expect(curried(3)(2)(1)).toEqual([1, 2, 3]);
  });

  test('should prepend the arguments of each call', () => {
    const curried = curryRight(abc);

    expect(curried(2, 3)(1)).toEqual([1, 2, 3]);
    expect(curried(3)(1, 2)).toEqual([1, 2, 3]);
  });

  test('should invoke immediately when all arguments are provided at once', () => {
    const curried = curryRight(abc);

    expect(curried(1, 2, 3)).toEqual([1, 2, 3]);
  });

  test('should return a function while arguments are still missing', () => {
    const curried = curryRight(abc);

    expect(typeof curried()).toBe('function');
    expect(typeof curried(3)).toBe('function');
    expect(typeof curried(2, 3)).toBe('function');
    expect(curried()(3)(2)(1)).toEqual([1, 2, 3]);
  });

  test('should not invoke the original function until the arity is met', () => {
    const func = jest.fn(abc);
    const curried = curryRight(func);

    const withOne = curried(3);
    const withTwo = withOne(2);
    expect(func).not.toHaveBeenCalled();

    withTwo(1);
    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith(1, 2, 3);
  });

  test('should not share collected arguments between partial applications', () => {
    const curried = curryRight(abc);
    const withOne = curried(3);

    expect(withOne(2)(1)).toEqual([1, 2, 3]);
    expect(withOne(5)(4)).toEqual([4, 5, 3]);
    expect(withOne(1, 2)).toEqual([1, 2, 3]);
  });

  test('should support an explicit arity', () => {
    const collect = (...args: string[]) => args;
    const curried = curryRight(collect, 3);

    expect(typeof curried('c')).toBe('function');
    expect(typeof curried('b', 'c')).toBe('function');
    expect(curried('c')('b')('a')).toEqual(['a', 'b', 'c']);
    expect(curried('b', 'c')('a')).toEqual(['a', 'b', 'c']);
    expect(curried('a', 'b', 'c')).toEqual(['a', 'b', 'c']);
  });

  test('should allow an arity smaller than the function length', () => {
    const curried = curryRight(abc, 2);

    expect(curried(2)(1)).toEqual([1, 2, undefined]);
    expect(curried(1, 2)).toEqual([1, 2, undefined]);
  });

  test('should preserve the this binding', () => {
    const object = {
      base: 10,
      subtract: curryRight(function (this: { base: number }, a: number, b: number) {
        return this.base + a - b;
      }),
    };

    expect(object.subtract(2)(1)).toBe(9);
    expect(object.subtract(1, 2)).toBe(9);

    const other = { base: 100, subtract: object.subtract };
    expect(other.subtract(2)(1)).toBe(99);
  });

  test('should preserve the this binding when invoked with call', () => {
    const curried = curryRight(function (this: { base: number }, a: number, b: number) {
      return this.base + a - b;
    });
    const context = { base: 5 };

    expect(curried.call(context, 2)(1)).toBe(4);
    expect(curried.call(context, 1, 2)).toBe(4);
  });
});
