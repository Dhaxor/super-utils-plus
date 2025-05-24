import { DebounceOptions } from '../utils/types';

/**
 * Creates a debounced function that delays invoking func until after wait
 * milliseconds have elapsed since the last time the debounced function was
 * invoked.
 * 
 * The debounced function comes with a cancel method to cancel delayed func
 * invocations and a flush method to immediately invoke them.
 * 
 * @param func - The function to debounce
 * @param wait - The number of milliseconds to delay
 * @param options - The options object
 * @returns The new debounced function
 * 
 * @example
 * ```ts
 * // Avoid costly calculations while the window size is being changed
 * window.addEventListener('resize', debounce(calculateLayout, 150));
 * 
 * // Invoke `sendMail` when the click event is fired, debouncing subsequent calls
 * const sendMailDebounced = debounce(sendMail, 300, {
 *   leading: true,
 *   trailing: false
 * });
 * element.addEventListener('click', sendMailDebounced);
 * 
 * // Cancel the debounced function
 * sendMailDebounced.cancel();
 * ```
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait = 0,
  options: DebounceOptions = {}
): T & { cancel: () => void; flush: () => void } {
  let lastArgs: any[] | undefined;
  let lastThis: any;
  let result: any;
  let timerId: ReturnType<typeof setTimeout> | undefined;
  let lastCallTime: number | undefined;
  let lastInvokeTime = 0;
  
  const { leading = false, trailing = true, maxWait } = options;
  const maxing = maxWait !== undefined;
  
  function invokeFunc(time: number): any {
    const args = lastArgs!;
    const thisArg = lastThis;
    
    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }
  
  function startTimer(pendingFunc: () => any, wait: number): ReturnType<typeof setTimeout> {
    return setTimeout(pendingFunc, wait);
  }
  
  function cancelTimer(id: ReturnType<typeof setTimeout>): void {
    clearTimeout(id);
  }
  
  function leadingEdge(time: number): any {
    lastInvokeTime = time;
    // Start the timer for the trailing edge
    timerId = startTimer(timerExpired, wait);
    // Invoke the leading edge
    return leading ? invokeFunc(time) : result;
  }
  
  function remainingWait(time: number): number {
    const timeSinceLastCall = time - (lastCallTime || 0);
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;
    
    return maxing
      ? Math.min(timeWaiting, (maxWait as number) - timeSinceLastInvoke)
      : timeWaiting;
  }
  
  function shouldInvoke(time: number): boolean {
    const timeSinceLastCall = time - (lastCallTime || 0);
    const timeSinceLastInvoke = time - lastInvokeTime;
    
    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxing && timeSinceLastInvoke >= (maxWait as number))
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
  
  function trailingEdge(time: number): any {
    timerId = undefined;
    
    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }
  
  function cancel(): void {
    if (timerId !== undefined) {
      cancelTimer(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }
  
  function flush(): any {
    return timerId === undefined ? result : trailingEdge(Date.now());
  }
  
  function debounced(this: any, ...args: any[]): any {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);
    
    lastArgs = args;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    lastThis = this;
    lastCallTime = time;
    
    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop
        timerId = startTimer(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = startTimer(timerExpired, wait);
    }
    return result;
  }
  
  debounced.cancel = cancel;
  debounced.flush = flush;
  
  return debounced as T & { cancel: () => void; flush: () => void };
}