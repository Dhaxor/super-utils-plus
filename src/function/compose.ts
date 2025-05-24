import { AnyFunction } from '../utils/types';

/**
 * Composes functions from right to left.
 * 
 * @param funcs - The functions to compose
 * @returns A function that composes the functions
 * 
 * @example
 * ```ts
 * const add1 = (x: number) => x + 1;
 * const multiply2 = (x: number) => x * 2;
 * const subtract3 = (x: number) => x - 3;
 * 
 * const composed = compose(subtract3, multiply2, add1);
 * composed(5);
 * // => ((5 + 1) * 2) - 3 = 9
 * ```
 */
export function compose<T>(...funcs: AnyFunction[]): (arg: T) => any {
  if (funcs.length === 0) {
    return <T>(arg: T) => arg;
  }
  
  if (funcs.length === 1) {
    return funcs[0];
  }
  
  return funcs.reduce((a, b) => (...args: any[]) => a(b(...args)));
}

/**
 * Composes functions from left to right.
 * 
 * @param funcs - The functions to compose
 * @returns A function that composes the functions
 * 
 * @example
 * ```ts
 * const add1 = (x: number) => x + 1;
 * const multiply2 = (x: number) => x * 2;
 * const subtract3 = (x: number) => x - 3;
 * 
 * const piped = pipe(add1, multiply2, subtract3);
 * piped(5);
 * // => ((5 + 1) * 2) - 3 = 9
 * ```
 */
export function pipe<T>(...funcs: AnyFunction[]): (arg: T) => any {
  if (funcs.length === 0) {
    return <T>(arg: T) => arg;
  }
  
  if (funcs.length === 1) {
    return funcs[0];
  }
  
  return funcs.reduce((a, b) => (...args: any[]) => b(a(...args)));
}