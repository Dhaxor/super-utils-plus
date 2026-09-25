/**
 * Marks an argument position to be filled later. Shared by `partial` and `partialRight`.
 */
const PLACEHOLDER: unique symbol = Symbol('partial.placeholder');

/**
 * Creates a function that invokes `func` with `partials` prepended to the arguments
 * it receives. This method is like `bind` except it does not alter the `this` binding.
 *
 * @param func - The function to partially apply arguments to
 * @param partials - The arguments to be partially applied
 * @returns The new partially applied function
 *
 * @example
 * ```ts
 * function greet(greeting, name) {
 *   return greeting + ' ' + name;
 * }
 *
 * const sayHelloTo = partial(greet, 'hello');
 * sayHelloTo('fred');
 * // => 'hello fred'
 * ```
 */
export function partial<T extends (...args: any[]) => any>(
  func: T,
  ...partials: any[]
): (...args: any[]) => ReturnType<T> {
  return function (this: any, ...args: any[]): ReturnType<T> {
    // Create a copy of partials to avoid modifying the original array
    const argsWithPartials = [...partials];

    // Replace placeholder values with arguments; unfilled placeholders become undefined
    let argIndex = 0;
    for (let i = 0; i < argsWithPartials.length; i++) {
      if (argsWithPartials[i] === PLACEHOLDER) {
        argsWithPartials[i] = argIndex < args.length ? args[argIndex++] : undefined;
      }
    }

    // Add any remaining arguments
    while (argIndex < args.length) {
      argsWithPartials.push(args[argIndex++]);
    }

    return func.apply(this, argsWithPartials);
  };
}

// `partial.placeholder` and `partialRight.placeholder` are the same symbol
partial.placeholder = PLACEHOLDER;

/**
 * This method is like `partial` except that partially applied arguments
 * are appended to the arguments it receives.
 *
 * @param func - The function to partially apply arguments to
 * @param partials - The arguments to be partially applied
 * @returns The new partially applied function
 *
 * @example
 * ```ts
 * function greet(greeting, name) {
 *   return greeting + ' ' + name;
 * }
 *
 * const greetFred = partialRight(greet, 'fred');
 * greetFred('hi');
 * // => 'hi fred'
 * ```
 */
export function partialRight<T extends (...args: any[]) => any>(
  func: T,
  ...partials: any[]
): (...args: any[]) => ReturnType<T> {
  return function (this: any, ...args: any[]): ReturnType<T> {
    // Create a copy of partials to avoid modifying the original array
    const argsWithPartials = [...partials];

    // Replace placeholder values with arguments, from right to left; unfilled
    // placeholders become undefined
    let argIndex = args.length - 1;
    for (let i = argsWithPartials.length - 1; i >= 0; i--) {
      if (argsWithPartials[i] === PLACEHOLDER) {
        argsWithPartials[i] = argIndex >= 0 ? args[argIndex--] : undefined;
      }
    }

    // Add any remaining arguments at the beginning
    const combinedArgs = [];
    for (let i = 0; i <= argIndex; i++) {
      combinedArgs.push(args[i]);
    }

    return func.apply(this, [...combinedArgs, ...argsWithPartials]);
  };
}

partialRight.placeholder = PLACEHOLDER;
