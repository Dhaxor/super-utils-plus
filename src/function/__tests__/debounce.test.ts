import { debounce } from '../debounce.js';

describe('debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should invoke only the last call made within the wait period', () => {
    const func = jest.fn();
    const debounced = debounce(func, 100);

    debounced(1);
    debounced(2);
    debounced(3);
    expect(func).not.toHaveBeenCalled();

    jest.advanceTimersByTime(99);
    expect(func).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith(3);
  });

  test('should restart the timer when called again before the wait elapses', () => {
    const func = jest.fn();
    const debounced = debounce(func, 100);

    debounced(1);
    jest.advanceTimersByTime(60);

    debounced(2);
    jest.advanceTimersByTime(60);
    // 120ms since the first call, but only 60ms since the last one
    expect(func).not.toHaveBeenCalled();

    jest.advanceTimersByTime(40);
    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith(2);
  });

  test('should invoke once per burst of calls', () => {
    const func = jest.fn();
    const debounced = debounce(func, 100);

    debounced('a');
    debounced('b');
    jest.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenLastCalledWith('b');

    debounced('c');
    debounced('d');
    jest.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(2);
    expect(func).toHaveBeenLastCalledWith('d');
  });

  test('should pass all arguments of the call to the debounced function', () => {
    const func = jest.fn();
    const debounced = debounce(func, 100);

    debounced(1, 'two', { three: 3 });
    jest.advanceTimersByTime(100);

    expect(func).toHaveBeenCalledWith(1, 'two', { three: 3 });
  });

  test('should default to a wait of 0', () => {
    const func = jest.fn();
    const debounced = debounce(func);

    debounced(1);
    expect(func).not.toHaveBeenCalled();

    jest.advanceTimersByTime(0);
    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith(1);
  });

  test('should invoke immediately on the leading edge when leading is true', () => {
    const func = jest.fn();
    const debounced = debounce(func, 100, { leading: true });

    debounced(1);
    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith(1);

    debounced(2);
    debounced(3);
    expect(func).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(2);
    expect(func).toHaveBeenLastCalledWith(3);
  });

  test('should not invoke a trailing call when leading is true and only one call was made', () => {
    const func = jest.fn();
    const debounced = debounce(func, 100, { leading: true });

    debounced(1);
    jest.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(1);

    debounced(2);
    expect(func).toHaveBeenCalledTimes(2);
    expect(func).toHaveBeenLastCalledWith(2);
  });

  test('should invoke only once per burst with leading: true and trailing: false', () => {
    const func = jest.fn();
    const debounced = debounce(func, 100, { leading: true, trailing: false });

    debounced(1);
    debounced(2);
    debounced(3);
    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith(1);

    jest.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(1);

    debounced(4);
    debounced(5);
    expect(func).toHaveBeenCalledTimes(2);
    expect(func).toHaveBeenLastCalledWith(4);

    jest.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(2);
  });

  test('should never invoke when both leading and trailing are false', () => {
    const func = jest.fn();
    const debounced = debounce(func, 100, { leading: false, trailing: false });

    debounced(1);
    debounced(2);
    jest.advanceTimersByTime(200);

    expect(func).not.toHaveBeenCalled();
  });

  test('should force an invocation once maxWait elapses during a continuous stream of calls', () => {
    const withMaxWait = jest.fn();
    const withoutMaxWait = jest.fn();
    const debounced = debounce(withMaxWait, 100, { maxWait: 250 });
    const plain = debounce(withoutMaxWait, 100);

    // Call every 50ms for 500ms: activity never stops for a full `wait`
    for (let i = 0; i < 10; i++) {
      debounced(i);
      plain(i);
      jest.advanceTimersByTime(50);
    }

    expect(withoutMaxWait).not.toHaveBeenCalled();
    expect(withMaxWait).toHaveBeenCalledTimes(2);
    expect(withMaxWait.mock.calls).toEqual([[4], [9]]);

    // Once the calls stop, the plain debounce fires its trailing call
    jest.advanceTimersByTime(100);
    expect(withoutMaxWait).toHaveBeenCalledTimes(1);
    expect(withoutMaxWait).toHaveBeenCalledWith(9);
    expect(withMaxWait).toHaveBeenCalledTimes(2);
  });

  test('should invoke synchronously when maxWait has elapsed but the timer has not fired yet', () => {
    const func = jest.fn();
    const debounced = debounce(func, 100, { maxWait: 100 });

    debounced(1);
    expect(func).not.toHaveBeenCalled();

    // Advance the clock without running any timers
    jest.setSystemTime(Date.now() + 100);

    debounced(2);
    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith(2);
  });

  test('should combine maxWait with leading', () => {
    const func = jest.fn();
    const debounced = debounce(func, 100, { leading: true, maxWait: 150 });

    debounced(1);
    expect(func).toHaveBeenCalledTimes(1);

    for (let i = 2; i <= 4; i++) {
      jest.advanceTimersByTime(50);
      debounced(i);
    }
    // 150ms after the leading invocation, maxWait forces another one
    expect(func).toHaveBeenCalledTimes(2);
    expect(func).toHaveBeenLastCalledWith(3);

    jest.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(3);
    expect(func).toHaveBeenLastCalledWith(4);
  });

  test('should cancel a pending invocation', () => {
    const func = jest.fn();
    const debounced = debounce(func, 100);

    debounced(1);
    debounced.cancel();
    jest.advanceTimersByTime(200);

    expect(func).not.toHaveBeenCalled();
  });

  test('should start over after cancel', () => {
    const func = jest.fn();
    const debounced = debounce(func, 100, { leading: true });

    debounced(1);
    expect(func).toHaveBeenCalledTimes(1);

    debounced(2);
    debounced.cancel();
    jest.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(1);

    debounced(3);
    expect(func).toHaveBeenCalledTimes(2);
    expect(func).toHaveBeenLastCalledWith(3);
  });

  test('should allow cancel to be called when nothing is pending', () => {
    const func = jest.fn();
    const debounced = debounce(func, 100);

    expect(() => debounced.cancel()).not.toThrow();

    debounced(1);
    jest.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(1);
  });

  test('should flush a pending invocation immediately and return its result', () => {
    const func = jest.fn((x: number) => x * 2);
    const debounced = debounce(func, 100);

    debounced(1);
    debounced(2);
    expect(func).not.toHaveBeenCalled();

    expect(debounced.flush()).toBe(4);
    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith(2);

    jest.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(1);
  });

  test('should return the last result from flush when nothing is pending', () => {
    const func = jest.fn((x: number) => x * 2);
    const debounced = debounce(func, 100);

    expect(debounced.flush()).toBeUndefined();

    debounced(3);
    expect(debounced.flush()).toBe(6);
    expect(debounced.flush()).toBe(6);
    expect(func).toHaveBeenCalledTimes(1);
  });

  test('should not flush when trailing is false', () => {
    const func = jest.fn((x: number) => x * 2);
    const debounced = debounce(func, 100, { leading: true, trailing: false });

    expect(debounced(1)).toBe(2);
    debounced(2);
    expect(debounced.flush()).toBe(2);
    expect(func).toHaveBeenCalledTimes(1);
  });

  test('should return the result of the last invocation', () => {
    const debounced = debounce((x: number) => x * 2, 100);

    expect(debounced(1)).toBeUndefined();
    jest.advanceTimersByTime(100);

    expect(debounced(5)).toBe(2);
    jest.advanceTimersByTime(100);

    expect(debounced(7)).toBe(10);
  });

  test('should return the leading result immediately when leading is true', () => {
    const debounced = debounce((x: number) => x * 2, 100, { leading: true });

    expect(debounced(1)).toBe(2);
    expect(debounced(3)).toBe(2);

    jest.advanceTimersByTime(100);
    expect(debounced(4)).toBe(8);
  });

  test('should use the this binding and arguments of the last call', () => {
    const func = jest.fn(function (this: unknown, ...args: unknown[]) {
      return args;
    });
    const debounced = debounce(func, 100);
    const first = { name: 'first' };
    const second = { name: 'second' };

    debounced.call(first, 1, 'a');
    debounced.call(second, 2, 'b');
    jest.advanceTimersByTime(100);

    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith(2, 'b');
    expect(func.mock.contexts[0]).toBe(second);
  });

  test('should use the object as this when invoked as a method', () => {
    const func = jest.fn();
    const object = { name: 'object', debounced: debounce(func, 100) };

    object.debounced('x');
    jest.advanceTimersByTime(100);

    expect(func.mock.contexts[0]).toBe(object);
  });

  test('should expose cancel and flush methods', () => {
    const debounced = debounce(() => undefined, 100);

    expect(typeof debounced.cancel).toBe('function');
    expect(typeof debounced.flush).toBe('function');
  });
});
