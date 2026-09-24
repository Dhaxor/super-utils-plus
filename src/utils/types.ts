/**
 * Type definitions for SuperUtilsPlus
 */

// Function types
export type AnyFunction = (...args: any[]) => any;
export type Predicate<T> = (value: T, index: number, collection: T[]) => boolean;
export type ObjectPredicate<T> = (value: T[keyof T], key: string, obj: T) => boolean;
export type Comparator<T> = (a: T, b: T) => number;
export type PropertyPath = string | number | symbol | (string | number | symbol)[];

// Collection types
export type Collection<T> = T[] | Record<string, T>;
export type PropertyName = string | number | symbol;

// Common callback types
export type IterateeFunction<T, R> = (value: T, index: number, collection: T[]) => R;
export type ObjectIterateeFunction<T, R> = (value: any, key: string, object: T) => R;
export type Iteratee<T, R> = PropertyName | [PropertyName, any] | IterateeFunction<T, R>;

/**
 * The predicate forms accepted by `find`, `filter`, `reject`, and friends:
 * a function, a `[property, value]` pair, an object of properties to match,
 * or a property name whose value must be truthy.
 */
export type PredicateShorthand<T> =
  | ((value: T, index: number, collection: T[]) => boolean)
  | Record<string, any>
  | string
  | [string, any];

/**
 * A function that derives a comparison key from a value, or the name of a
 * property to read that key from.
 */
export type ValueIteratee<T, K> = ((value: T) => K) | keyof T;

// Debounce/Throttle options
export interface DebounceOptions {
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
}

export interface ThrottleOptions {
  leading?: boolean;
  trailing?: boolean;
}

// Template options
export interface TemplateOptions {
  interpolate?: RegExp;
  escape?: RegExp;
  evaluate?: RegExp;
}

// Truncate options
export interface TruncateOptions {
  length?: number;
  omission?: string;
  separator?: string | RegExp;
}

// Deep partial type for merging
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
