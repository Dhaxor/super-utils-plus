import { PropertyPath } from '../utils/types.js';

export type PathKey = string | number | symbol;

/**
 * Keys that path-based helpers must never traverse or write through, because
 * doing so would let untrusted input modify `Object.prototype` (prototype pollution).
 */
const UNSAFE_KEYS: ReadonlySet<PathKey> = new Set<PathKey>([
  '__proto__',
  'constructor',
  'prototype',
]);

/**
 * Checks whether a key would reach the shared prototype chain if written through.
 *
 * @internal
 */
export function isUnsafeKey(key: PathKey): boolean {
  return UNSAFE_KEYS.has(key);
}

/**
 * Checks whether any segment of a path is an unsafe key.
 *
 * @internal
 */
export function hasUnsafeKey(path: readonly PathKey[]): boolean {
  return path.some(isUnsafeKey);
}

/** Canonical non-negative integer strings: "0", "1", "42" (not "01" or "-1"). */
const INDEX = /^(?:0|[1-9]\d*)$/;

/** The largest valid array index (2^32 - 2). */
const MAX_ARRAY_INDEX = 4294967294;

/**
 * Parses a string path such as `a[0].b.c` or `a["b.c"].d` into its segments, following
 * Lodash's `toPath` rules: dots split segments (an empty segment is kept for a leading,
 * trailing, or doubled dot), brackets hold one segment, canonical integer bracket
 * segments become numbers, and quoted bracket segments (`["a.b"]`, `['x]y']`) keep
 * their text with backslash escapes resolved.
 *
 * @internal
 */
export function parsePath(path: string): Array<string | number> {
  if (path === '') {
    return [''];
  }

  const segments: Array<string | number> = [];
  let pending: string | null = null;
  let inBrackets = false;
  let afterBracket = false;
  let afterDot = false;

  for (let i = 0; i < path.length; i++) {
    const char = path[i];

    if (inBrackets) {
      if (char === ']') {
        segments.push(normalizeBracketSegment(pending ?? ''));
        pending = null;
        inBrackets = false;
        afterBracket = true;
      } else {
        pending = (pending ?? '') + char;
      }
      continue;
    }

    if (char === '[') {
      if (pending !== null) {
        segments.push(pending);
      }
      pending = null;
      afterDot = false;

      // Quoted segment: ["..."] or ['...'], which may contain "]" and backslash escapes
      const quoted = readQuotedSegment(path, i + 1);
      if (quoted !== null) {
        segments.push(quoted.segment);
        i = quoted.end;
        afterBracket = true;
        continue;
      }

      inBrackets = true;
      continue;
    }

    if (char === '.') {
      if (pending !== null) {
        segments.push(pending);
      } else if (!afterBracket) {
        segments.push('');
      }
      pending = null;
      afterBracket = false;
      afterDot = true;
      continue;
    }

    pending = (pending ?? '') + char;
    afterBracket = false;
    afterDot = false;
  }

  if (pending !== null) {
    segments.push(inBrackets ? normalizeBracketSegment(pending) : pending);
  } else if (afterDot) {
    segments.push('');
  }

  return segments;
}

/**
 * Reads a quoted bracket segment starting at `start` (the position after `[`).
 * Returns the unescaped text and the index of the closing `]`, or null when the
 * text is not a well-formed quoted segment.
 */
function readQuotedSegment(path: string, start: number): { segment: string; end: number } | null {
  const quote = path[start];
  if (quote !== '"' && quote !== "'") {
    return null;
  }

  let segment = '';
  for (let i = start + 1; i < path.length; i++) {
    const char = path[i];

    if (char === '\\' && i + 1 < path.length) {
      segment += path[i + 1];
      i++;
    } else if (char === quote) {
      return path[i + 1] === ']' ? { segment, end: i + 1 } : null;
    } else {
      segment += char;
    }
  }

  return null;
}

function normalizeBracketSegment(segment: string): string | number {
  if (INDEX.test(segment)) {
    return Number(segment);
  }

  const first = segment[0];
  const last = segment[segment.length - 1];
  if (segment.length >= 2 && first === last && (first === '"' || first === "'")) {
    return segment.slice(1, -1);
  }

  return segment;
}

/**
 * Coerces an array path element to a primitive key. Objects (arrays, `String`
 * wrappers, ...) are stringified up front so that the unsafe-key guard sees the
 * same key the property access would.
 */
function normalizeKey(key: unknown): PathKey {
  return typeof key === 'symbol' || typeof key === 'number' ? key : String(key);
}

/**
 * Normalizes any `PropertyPath` (string, single key, or array of keys) into segments.
 *
 * @internal
 */
export function toPath(path: PropertyPath): PathKey[] {
  if (typeof path === 'string') {
    return parsePath(path);
  }

  if (Array.isArray(path)) {
    return path.map(normalizeKey);
  }

  return [normalizeKey(path)];
}

/**
 * Checks whether a segment should be treated as an array index when a container
 * has to be created for it: a non-negative integer, or its canonical string form.
 *
 * @internal
 */
export function isIndexSegment(segment: PathKey): boolean {
  if (typeof segment === 'number') {
    return Number.isInteger(segment) && segment >= 0 && segment <= MAX_ARRAY_INDEX;
  }

  return typeof segment === 'string' && INDEX.test(segment) && Number(segment) <= MAX_ARRAY_INDEX;
}

/**
 * Assigns an own enumerable property, even when the key is `__proto__`, which a
 * plain assignment would instead treat as "set the prototype".
 *
 * @internal
 */
export function assignOwnKey(
  object: Record<PropertyKey, any>,
  key: PropertyKey,
  value: unknown
): void {
  if (key === '__proto__') {
    Object.defineProperty(object, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    object[key] = value;
  }
}
