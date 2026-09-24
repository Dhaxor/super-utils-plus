/**
 * Checks if a number is between start and up to, but not including, end.
 * If end is not specified, start is set to 0 and end to the original start.
 *
 * @param number - The number to check
 * @param start - The start of the range or the end when used as a single argument
 * @param end - The end of the range
 * @returns True if the number is in range, else false
 */
export function inRange(number: number, start: number, end?: number): boolean {
  let rangeStart = start;
  let rangeEnd = end;

  if (rangeEnd === undefined) {
    rangeEnd = rangeStart;
    rangeStart = 0;
  }

  const lower = Math.min(rangeStart, rangeEnd);
  const upper = Math.max(rangeStart, rangeEnd);

  return number >= lower && number < upper;
}
