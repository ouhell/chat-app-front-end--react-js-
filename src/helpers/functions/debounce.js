const debounce = (func, delay = 500) => {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(args);
    }, delay);
  };
};
export default debounce;
