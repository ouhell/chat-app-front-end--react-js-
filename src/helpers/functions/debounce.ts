type DebounceFn = (...args: any[]) => void;

export default function debounce(func: DebounceFn, delay: number): DebounceFn {
  let timeoutId: NodeJS.Timeout;

  return function debounced(...args: any[]) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
