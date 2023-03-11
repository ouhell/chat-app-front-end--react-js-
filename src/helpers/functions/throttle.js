const throttle = (func, delay = 500) => {
  let shouldWait = false;
  let delayedCall = false;
  let waitingArgs = [];

  const timeoutFunction = () => {
    shouldWait = false;
    if (delayedCall) {
      delayedCall = false;
      waitingArgs = [];
      func(...waitingArgs);
      setTimeout(timeoutFunction, delay);
    } else {
      shouldWait = false;
    }
  };
  return (...args) => {
    if (shouldWait) {
      waitingArgs = args;
      delayedCall = true;
      return;
    }

    shouldWait = true;

    func(args);
    setTimeout(timeoutFunction, delay);
  };
};
export default throttle;
