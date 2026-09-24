import { throttle } from '../throttle.js';

describe('throttle', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should invoke immediately on the first call', () => {
    const func = jest.fn();
    const throttled = throttle(func, 100);

    throttled(1);

    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith(1);
  });

  test('should invoke at most once per wait window with a trailing call using the latest args', () => {
    const func = jest.fn();
    const throttled = throttle(func, 100);

    throttled(1);
    throttled(2);
    throttled(3);
    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith(1);

    jest.advanceTimersByTime(99);
    expect(func).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(1);
    expect(func).toHaveBeenCalledTimes(2);
    expect(func).toHaveBeenLastCalledWith(3);
  });

  test('should keep throttling across consecutive windows', () => {
    const func = jest.fn();
    const throttled = throttle(func, 100);

    throttled(1);
    throttled(2);
    jest.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(2);
    expect(func).toHaveBeenLastCalledWith(2);

    // The trailing invocation started a new window, so this call must wait
    throttled(3);
    expect(func).toHaveBeenCalledTimes(2);

    jest.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(3);
    expect(func).toHaveBeenLastCalledWith(3);
  });

  test('should not invoke a trailing call when only one call was made in the window', () => {
    const func = jest.fn();
    const throttled = throttle(func, 100);

    throttled(1);
    jest.advanceTimersByTime(200);

    expect(func).toHaveBeenCalledTimes(1);
  });

  test('should pass all arguments of the call to the throttled function', () => {
    const func = jest.fn();
    const throttled = throttle(func, 100);

    throttled(1, 'two', { three: 3 });

    expect(func).toHaveBeenCalledWith(1, 'two', { three: 3 });
  });

  test('should default to a wait of 0, invoking every call immediately', () => {
    const func = jest.fn();
    const throttled = throttle(func);

    throttled(1);
    expect(func).toHaveBeenCalledTimes(1);

    // The 0ms window has already elapsed, so the next call is not deferred
    throttled(2);
    expect(func).toHaveBeenCalledTimes(2);
    expect(func).toHaveBeenLastCalledWith(2);

    jest.advanceTimersByTime(0);
    expect(func).toHaveBeenCalledTimes(2);
  });

  test('should delay the first call when leading is false', () => {
    const func = jest.fn();
    const throttled = throttle(func, 100, { leading: false });

    throttled(1);
    expect(func).not.toHaveBeenCalled();

    throttled(2);
    jest.advanceTimersByTime(99);
    expect(func).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith(2);
  });

  test('should drop the trailing call when trailing is false', () => {
    const func = jest.fn();
    const throttled = throttle(func, 100, { trailing: false });

    throttled(1);
    throttled(2);
    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith(1);

    jest.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(1);

    throttled(3);
    expect(func).toHaveBeenCalledTimes(2);
    expect(func).toHaveBeenLastCalledWith(3);
  });

  test('should never invoke when both leading and trailing are false', () => {
    const func = jest.fn();
    const throttled = throttle(func, 100, { leading: false, trailing: false });

    throttled(1);
    throttled(2);
    jest.advanceTimersByTime(200);

    expect(func).not.toHaveBeenCalled();
  });

  test('should invoke each call when calls are spaced further apart than wait', () => {
    const func = jest.fn();
    const throttled = throttle(func, 100);

    throttled(1);
    expect(func).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(150);
    throttled(2);
    expect(func).toHaveBeenCalledTimes(2);
    expect(func).toHaveBeenLastCalledWith(2);

    jest.advanceTimersByTime(150);
    throttled(3);
    expect(func).toHaveBeenCalledTimes(3);
    expect(func).toHaveBeenLastCalledWith(3);

    jest.advanceTimersByTime(150);
    expect(func).toHaveBeenCalledTimes(3);
  });

  test('should invoke synchronously when the wait has elapsed but the timer has not fired yet', () => {
    const func = jest.fn();
    const throttled = throttle(func, 100);

    throttled(1);
    expect(func).toHaveBeenCalledTimes(1);

    // Advance the clock without running any timers
    jest.setSystemTime(Date.now() + 100);

    throttled(2);
    expect(func).toHaveBeenCalledTimes(2);
    expect(func).toHaveBeenLastCalledWith(2);
  });

  test('should re-arm the timer when it fires before the wait has elapsed on the adjusted clock', () => {
    const func = jest.fn();
    const throttled = throttle(func, 100);

    throttled(1);
    expect(func).toHaveBeenCalledTimes(1);

    // The window elapses without the timer firing, so the next call invokes synchronously
    jest.setSystemTime(Date.now() + 100);
    throttled(2);
    expect(func).toHaveBeenCalledTimes(2);

    // A third call is pending as the trailing invocation
    throttled(3);
    expect(func).toHaveBeenCalledTimes(2);

    // The system clock is adjusted backwards by 40ms
    jest.setSystemTime(Date.now() - 40);

    // When the timer fires, only 60ms have elapsed since the last invocation, so it re-arms
    jest.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(2);

    jest.advanceTimersByTime(39);
    expect(func).toHaveBeenCalledTimes(2);

    jest.advanceTimersByTime(1);
    expect(func).toHaveBeenCalledTimes(3);
    expect(func).toHaveBeenLastCalledWith(3);
  });

  test('should cancel a pending trailing invocation', () => {
    const func = jest.fn();
    const throttled = throttle(func, 100);

    throttled(1);
    throttled(2);
    throttled.cancel();
    jest.advanceTimersByTime(200);

    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith(1);
  });

  test('should start over after cancel', () => {
    const func = jest.fn();
    const throttled = throttle(func, 100);

    throttled(1);
    throttled(2);
    throttled.cancel();

    throttled(3);
    expect(func).toHaveBeenCalledTimes(2);
    expect(func).toHaveBeenLastCalledWith(3);
  });

  test('should allow cancel to be called when nothing is pending', () => {
    const func = jest.fn();
    const throttled = throttle(func, 100);

    expect(() => throttled.cancel()).not.toThrow();

    throttled(1);
    expect(func).toHaveBeenCalledTimes(1);
  });

  test('should flush a pending trailing invocation immediately and return its result', () => {
    const func = jest.fn((x: number) => x * 2);
    const throttled = throttle(func, 100);

    expect(throttled(1)).toBe(2);
    throttled(2);
    expect(func).toHaveBeenCalledTimes(1);

    expect(throttled.flush()).toBe(4);
    expect(func).toHaveBeenCalledTimes(2);
    expect(func).toHaveBeenLastCalledWith(2);

    jest.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(2);
  });

  test('should return the last result from flush when nothing is pending', () => {
    const func = jest.fn((x: number) => x * 2);
    const throttled = throttle(func, 100);

    expect(throttled.flush()).toBeUndefined();

    throttled(3);
    expect(throttled.flush()).toBe(6);
    expect(throttled.flush()).toBe(6);
    expect(func).toHaveBeenCalledTimes(1);
  });

  test('should return the result of the last invocation', () => {
    const throttled = throttle((x: number) => x * 2, 100);

    expect(throttled(1)).toBe(2);
    expect(throttled(5)).toBe(2);

    jest.advanceTimersByTime(100);
    expect(throttled(7)).toBe(10);
  });

  test('should return undefined until the first invocation when leading is false', () => {
    const throttled = throttle((x: number) => x * 2, 100, { leading: false });

    expect(throttled(1)).toBeUndefined();
    jest.advanceTimersByTime(100);

    expect(throttled(2)).toBe(2);
  });

  test('should use the this binding and arguments of the latest call for the trailing invocation', () => {
    const func = jest.fn(function (this: unknown, ...args: unknown[]) {
      return args;
    });
    const throttled = throttle(func, 100);
    const first = { name: 'first' };
    const second = { name: 'second' };
    const third = { name: 'third' };

    throttled.call(first, 1, 'a');
    throttled.call(second, 2, 'b');
    throttled.call(third, 3, 'c');
    jest.advanceTimersByTime(100);

    expect(func).toHaveBeenCalledTimes(2);
    expect(func.mock.calls).toEqual([
      [1, 'a'],
      [3, 'c'],
    ]);
    expect(func.mock.contexts).toEqual([first, third]);
  });

  test('should use the object as this when invoked as a method', () => {
    const func = jest.fn();
    const object = { name: 'object', throttled: throttle(func, 100) };

    object.throttled('x');

    expect(func.mock.contexts[0]).toBe(object);
  });

  test('should expose cancel and flush methods', () => {
    const throttled = throttle(() => undefined, 100);

    expect(typeof throttled.cancel).toBe('function');
    expect(typeof throttled.flush).toBe('function');
  });
});

describe('throttle (Lodash parity)', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should invoke a late call even when trailing is false', () => {
    const func = jest.fn();
    const throttled = throttle(func, 100, { trailing: false });

    throttled(1);
    expect(func).toHaveBeenCalledTimes(1);

    // The window elapses while the timer is still pending (busy event loop)
    jest.setSystemTime(Date.now() + 150);
    throttled(2);

    expect(func).toHaveBeenCalledTimes(2);
    expect(func).toHaveBeenLastCalledWith(2);
  });
});
