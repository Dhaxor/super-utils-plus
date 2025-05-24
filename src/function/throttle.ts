import { ThrottleOptions } from '../utils/types';

/**
 * Creates a throttled function that only invokes func at most once per
 * every wait milliseconds. The throttled function comes with a cancel
 * method to cancel delayed func invocations and a flush method to
 * immediately invoke them.
 * 
 * @param func - The function to throttle
 * @param wait - The number of milliseconds to throttle invocations to
 * @param options - The options object
 * @returns The new throttled function
 * 
 * @example
 * ```ts
 * // Avoid excessively updating the position while scrolling
 * window.addEventListener('scroll', throttle(updatePosition, 100));
 * 
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes
 * const throttled = throttle(renewToken, 300000, { 
 *   trailing: false 
 * });
 * element.addEventListener('click', throttled);
 * 
 * // Cancel the trailing throttled invocation
 * throttled.cancel();
 * ```
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait = 0,
  options: ThrottleOptions = {}
): T & { cancel: () => void; flush: () => void } {
  let leading = true;
  let trailing = true;
  
  if (typeof options === 'object') {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  
  let lastArgs: any[] | undefined;
  let lastThis: any;
  let result: any;
  let timerId: ReturnType<typeof setTimeout> | undefined;
  let lastCallTime: number | undefined;
  
  function invokeFunc(time: number): any {
    const args = lastArgs!;
    const thisArg = lastThis;
    
    lastArgs = lastThis = undefined;
    lastCallTime = time;
    result = func.apply(thisArg, args);
    return result;
  }
  
  function startTimer(pendingFunc: () => any, wait: number): ReturnType<typeof setTimeout> {
    return setTimeout(pendingFunc, wait);
  }
  
  function cancelTimer(id: ReturnType<typeof setTimeout>): void {
    clearTimeout(id);
  }
  
  function trailingEdge(time: number): any {
    timerId = undefined;
    
    // Only invoke if we have `lastArgs` which means `func` has been
    // throttled at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }
  
  function remainingWait(time: number): number {
    const timeSinceLastCall = time - (lastCallTime || 0);
    return wait - timeSinceLastCall;
  }
  
  function shouldInvoke(time: number): boolean {
    const timeSinceLastCall = time - (lastCallTime || 0);
    
    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, or the system time has gone backwards and we're treating
    // it as the trailing edge.
    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0
    );
  }
  
  function timerExpired(): any {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer
    timerId = startTimer(timerExpired, remainingWait(time));
    return undefined;
  }
  
  function leadingEdge(time: number): any {
    // Reset any `maxWait` timer.
    lastCallTime = time;
    
    // Start the timer for the trailing edge.
    timerId = startTimer(timerExpired, wait);
    
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }
  
  function cancel(): void {
    if (timerId !== undefined) {
      cancelTimer(timerId);
    }
    lastCallTime = undefined;
    lastArgs = lastThis = timerId = undefined;
  }
  
  function flush(): any {
    return timerId === undefined ? result : trailingEdge(Date.now());
  }
  
  function throttled(this: any, ...args: any[]): any {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);
    
    lastArgs = args;
     // eslint-disable-next-line @typescript-eslint/no-this-alias
    lastThis = this;
    
    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(time);
      }
      if (trailing) {
        // Handle invocations in a tight loop.
        timerId = startTimer(timerExpired, wait);
        return invokeFunc(time);
      }
    }
    if (timerId === undefined) {
      timerId = startTimer(timerExpired, wait);
    }
    return result;
  }
  
  throttled.cancel = cancel;
  throttled.flush = flush;
  
  return throttled as T & { cancel: () => void; flush: () => void };
}