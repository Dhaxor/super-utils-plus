import { randomInt } from '../utils/random';

/**
 * Creates an array of shuffled values using a version of the Fisher-Yates shuffle.
 *
 * @param array - The array to shuffle
 * @returns The shuffled array
 */
export function shuffle<T>(array: T[]): T[] {
  if (!array || !array.length) {
    return [];
  }

  const result = [...array];

  for (let index = result.length - 1; index > 0; index--) {
    const randomIndex = randomInt(0, index);
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }

  return result;
}

/**
 * Gets a random element from an array.
 *
 * @param array - The array to sample from
 * @returns The sampled element
 */
export function sample<T>(array: T[]): T | undefined {
  if (!array || !array.length) {
    return undefined;
  }

  return array[randomInt(0, array.length - 1)];
}

/**
 * Gets `n` unique random elements from an array.
 *
 * @param array - The array to sample from
 * @param n - The number of elements to sample
 * @returns The sampled elements
 */
export function sampleSize<T>(array: T[], n = 1): T[] {
  if (!array || !array.length || n <= 0) {
    return [];
  }

  const size = Math.min(Math.floor(n), array.length);
  return shuffle(array).slice(0, size);
}