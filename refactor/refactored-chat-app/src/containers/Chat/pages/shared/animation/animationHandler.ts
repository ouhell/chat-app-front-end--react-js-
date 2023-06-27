export const pageAnimation = {
  initial: {
    opacity: 0,
    y: 10,
    scale: 1.05,
    transition: {
      opacity: { duration: 0.2, ease: "easeOut" },
      y: { duration: 0.3 },
    },
  },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 1.05, transition: { duration: 0.1 } },
};
