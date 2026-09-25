import { PropertyName } from '../utils/types.js';
import { assignOwnKey } from '../internal/path.js';

/**
 * Creates an object from key-value pairs.
 *
 * @param pairs - The key-value pairs
 * @returns The composed object
 */
export function fromPairs<T = any>(pairs: Array<[PropertyName, T]>): Record<string, T> {
  if (!pairs || !pairs.length) {
    return {};
  }

  const result: Record<string, T> = {};

  for (const [key, value] of pairs) {
    assignOwnKey(result, String(key), value);
  }

  return result;
}
