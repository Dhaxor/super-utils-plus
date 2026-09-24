import { memoize, MemoizeCache } from '../memoize.js';

describe('memoize', () => {
  const originalCache = memoize.Cache;

  afterEach(() => {
    memoize.Cache = originalCache;
  });

  test('should cache results by the first argument by default', () => {
    const func = jest.fn((a: number, b: number) => a + b);
    const memoized = memoize(func);

    expect(memoized(1, 2)).toBe(3);
    // Same first argument: the cached result is returned even though `b` differs
    expect(memoized(1, 3)).toBe(3);
    expect(func).toHaveBeenCalledTimes(1);

    expect(memoized(2, 3)).toBe(5);
    expect(func).toHaveBeenCalledTimes(2);
  });

  test('should call the original function once per key', () => {
    const func = jest.fn((key: string) => key.toUpperCase());
    const memoized = memoize(func);

    ['a', 'b', 'a', 'b', 'a', 'c'].forEach(key => memoized(key));

    expect(func).toHaveBeenCalledTimes(3);
    expect(func.mock.calls).toEqual([['a'], ['b'], ['c']]);
  });

  test('should return the same result for repeated calls', () => {
    const memoized = memoize((n: number) => ({ n }));

    const first = memoized(1);
    expect(memoized(1)).toBe(first);
    expect(memoized(2)).not.toBe(first);
  });

  test('should support a custom resolver', () => {
    const func = jest.fn((a: number, b: number) => a + b);
    const memoized = memoize(func, (a, b) => `${a}:${b}`);

    expect(memoized(1, 2)).toBe(3);
    expect(memoized(1, 3)).toBe(4);
    expect(func).toHaveBeenCalledTimes(2);

    expect(memoized(1, 2)).toBe(3);
    expect(func).toHaveBeenCalledTimes(2);

    expect(memoized.cache.has('1:2')).toBe(true);
    expect(memoized.cache.has('1:3')).toBe(true);
  });

  test('should pass all arguments to the resolver', () => {
    const resolver = jest.fn((...args: unknown[]) => JSON.stringify(args));
    const memoized = memoize((...args: unknown[]) => args.length, resolver);

    memoized(1, 'two', 3);

    expect(resolver).toHaveBeenCalledWith(1, 'two', 3);
  });

  test('should expose the cache as a Map', () => {
    const memoized = memoize((n: number) => n * 2);

    expect(memoized.cache).toBeInstanceOf(Map);
    expect(memoized.cache.has(1)).toBe(false);

    memoized(1);

    expect(memoized.cache.has(1)).toBe(true);
    expect(memoized.cache.get(1)).toBe(2);
  });

  test('should allow the cache to be modified', () => {
    const func = jest.fn((n: number) => n * 2);
    const memoized = memoize(func);

    memoized.cache.set(1, 100);
    expect(memoized(1)).toBe(100);
    expect(func).not.toHaveBeenCalled();

    memoized(2);
    expect(func).toHaveBeenCalledTimes(1);

    (memoized.cache as Map<number, number>).delete(2);
    expect(memoized(2)).toBe(4);
    expect(func).toHaveBeenCalledTimes(2);

    (memoized.cache as Map<number, number>).clear();
    expect(memoized(1)).toBe(2);
    expect(func).toHaveBeenCalledTimes(3);
  });

  test('should cache object keys by reference', () => {
    const values = (object: Record<string, number>) => Object.values(object);
    const object = { a: 1, b: 2 };
    const other = { c: 3, d: 4 };
    const memoizedValues = memoize(values);

    expect(memoizedValues(object)).toEqual([1, 2]);
    expect(memoizedValues(other)).toEqual([3, 4]);

    object.a = 2;
    expect(memoizedValues(object)).toEqual([1, 2]);

    memoizedValues.cache.set(object, ['a', 'b']);
    expect(memoizedValues(object)).toEqual(['a', 'b']);
  });

  test('should cache undefined results', () => {
    const func = jest.fn((_key: string) => undefined);
    const memoized = memoize(func);

    expect(memoized('key')).toBeUndefined();
    expect(memoized('key')).toBeUndefined();

    expect(func).toHaveBeenCalledTimes(1);
    expect(memoized.cache.has('key')).toBe(true);
  });

  test('should use undefined as the key when called without arguments', () => {
    const func = jest.fn(() => 'result');
    const memoized = memoize(func);

    expect(memoized()).toBe('result');
    expect(memoized()).toBe('result');

    expect(func).toHaveBeenCalledTimes(1);
    expect(memoized.cache.has(undefined)).toBe(true);
  });

  test('should forward the this binding to the original function', () => {
    const object = {
      multiplier: 3,
      multiply: memoize(function (this: { multiplier: number }, n: number) {
        return n * this.multiplier;
      }),
    };

    expect(object.multiply(2)).toBe(6);
    expect(object.multiply(2)).toBe(6);
  });

  test('should forward the this binding to the resolver', () => {
    const func = jest.fn(function (this: unknown, n: number) {
      return n;
    });
    const resolver = jest.fn(function (this: unknown, n: number) {
      return n;
    });
    const memoized = memoize(func, resolver);
    const context = { name: 'context' };

    memoized.call(context, 1);

    expect(func.mock.contexts[0]).toBe(context);
    expect(resolver.mock.contexts[0]).toBe(context);
  });

  test('should use Map as the default cache implementation', () => {
    expect(memoize.Cache).toBe(Map);
  });

  test('should allow memoize.Cache to be replaced with a custom implementation', () => {
    class TrackingCache implements MemoizeCache {
      store = new Map<unknown, unknown>();
      calls: string[] = [];

      has(key: unknown): boolean {
        this.calls.push('has');
        return this.store.has(key);
      }

      get(key: unknown): unknown {
        this.calls.push('get');
        return this.store.get(key);
      }

      delete(key: unknown): boolean {
        this.calls.push('delete');
        return this.store.delete(key);
      }

      set(key: unknown, value: unknown): this {
        this.calls.push('set');
        this.store.set(key, value);
        return this;
      }
    }

    memoize.Cache = TrackingCache;

    const func = jest.fn((n: number) => n + 1);
    const memoized = memoize(func);

    expect(memoized.cache).toBeInstanceOf(TrackingCache);

    expect(memoized(1)).toBe(2);
    expect(memoized(1)).toBe(2);

    const cache = memoized.cache as unknown as TrackingCache;
    expect(func).toHaveBeenCalledTimes(1);
    expect(cache.store.get(1)).toBe(2);
    expect(cache.calls).toEqual(['has', 'set', 'has', 'get']);
  });

  test('should allow memoize.Cache to be replaced with WeakMap', () => {
    memoize.Cache = WeakMap as unknown as new () => MemoizeCache;

    const func = jest.fn((object: { n: number }) => object.n * 2);
    const memoized = memoize(func);
    const key = { n: 2 };

    expect(memoized.cache).toBeInstanceOf(WeakMap);
    expect(memoized(key)).toBe(4);
    expect(memoized(key)).toBe(4);
    expect(func).toHaveBeenCalledTimes(1);
    expect(memoized.cache.has(key)).toBe(true);
  });

  test('should keep using the cache implementation that was active when memoized', () => {
    memoize.Cache = WeakMap as unknown as new () => MemoizeCache;
    const withWeakMap = memoize((object: object) => object);

    memoize.Cache = originalCache;
    const withMap = memoize((n: number) => n);

    expect(withWeakMap.cache).toBeInstanceOf(WeakMap);
    expect(withMap.cache).toBeInstanceOf(Map);
  });
});

describe('memoize cache typing', () => {
  test('should expose the default cache as a Map with clear and size', () => {
    const memoized = memoize((n: number) => n * 2);
    memoized(1);
    memoized(2);
    expect(memoized.cache.size).toBe(2);
    memoized.cache.clear();
    expect(memoized.cache.size).toBe(0);
  });
});
