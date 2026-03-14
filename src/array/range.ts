/**
 * Creates an array of numbers progressing from start up to, but not including, end.
 * If end is not specified, it starts from 0.
 *
 * @param start - The start of the range or the end when used as a single argument
 * @param end - The end of the range
 * @param step - The increment or decrement value
 * @returns The range of numbers
 *
 * @example
 * ```ts
 * range(4);
 * // => [0, 1, 2, 3]
 *
 * range(1, 5);
 * // => [1, 2, 3, 4]
 *
 * range(0, 20, 5);
 * // => [0, 5, 10, 15]
 * ```
 */
export function range(start: number, end?: number, step?: number): number[] {
  const args = normalizeRangeArgs(start, end, step);
  return createRange(args.start, args.end, args.step);
}

/**
 * This method is like `range` except that it populates values in descending order.
 *
 * @param start - The start of the range or the end when used as a single argument
 * @param end - The end of the range
 * @param step - The increment or decrement value
 * @returns The range of numbers in reverse order
 */
export function rangeRight(start: number, end?: number, step?: number): number[] {
  const args = normalizeRangeArgs(start, end, step);
  return createRange(args.start, args.end, args.step, true);
}

function normalizeRangeArgs(start: number, end?: number, step?: number) {
  let normalizedStart = start;
  let normalizedEnd = end;

  if (normalizedEnd === undefined) {
    normalizedEnd = normalizedStart;
    normalizedStart = 0;
  }

  const normalizedStep = step ?? (normalizedStart < normalizedEnd ? 1 : -1);

  return {
    start: normalizedStart,
    end: normalizedEnd,
    step: normalizedStep,
  };
}

function createRange(start: number, end: number, step: number, fromRight = false): number[] {
  const length = step === 0
    ? Math.max(Math.ceil(Math.abs(end - start)), 0)
    : Math.max(Math.ceil((end - start) / step), 0);

  const result = new Array<number>(length);

  for (let index = 0; index < length; index++) {
    const value = start + index * step;
    result[fromRight ? length - index - 1 : index] = value;
  }

  return result;
}