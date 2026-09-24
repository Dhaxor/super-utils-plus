/**
 * Clamps a number within the inclusive lower and upper bounds.
 *
 * @param value - The number to clamp
 * @param lower - The lower bound
 * @param upper - The upper bound
 * @returns The clamped number
 *
 * @example
 * ```ts
 * clamp(-10, -5, 5);
 * // => -5
 *
 * clamp(10, -5, 5);
 * // => 5
 *
 * clamp(3, -5, 5);
 * // => 3
 * ```
 */
export function clamp(value: number, lower: number, upper: number): number {
  const min = Math.min(lower, upper);
  const max = Math.max(lower, upper);

  if (Number.isNaN(value)) {
    return Number.NaN;
  }

  return Math.min(Math.max(value, min), max);
}
