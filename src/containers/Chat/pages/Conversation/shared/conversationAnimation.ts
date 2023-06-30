export const conversationAnimationVariants = {
  hide: {
    y: "-100%",
    opacity: 0,
  },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 900,
      damping: 55,
    },
  },
  exit: {
    x: "100%",

    transition: {
      type: "spring",
      stiffness: 900,
      damping: 55,
    },
  },
};
