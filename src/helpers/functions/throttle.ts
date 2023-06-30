type ThrottleFn = (...args: any[]) => void;

export default function throttle(func: ThrottleFn, delay: number): ThrottleFn {
  let lastExecutionTime = 0;
  let timeoutId: NodeJS.Timeout | null = null;
  let queuedArgs: any[] = [];

  function clearPendingExecution() {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  }

  function executeFunc() {
    lastExecutionTime = Date.now();
    func(...queuedArgs);
    queuedArgs = [];
    timeoutId = null;
  }

  return function throttled(...args: any[]) {
    const currentTime = Date.now();
    const elapsedTime = currentTime - lastExecutionTime;

    if (elapsedTime < delay) {
      clearPendingExecution();
      queuedArgs = args;

      timeoutId = setTimeout(() => {
        executeFunc();
      }, delay - elapsedTime);
    } else {
      clearPendingExecution();
      executeFunc();
    }
  };
}
