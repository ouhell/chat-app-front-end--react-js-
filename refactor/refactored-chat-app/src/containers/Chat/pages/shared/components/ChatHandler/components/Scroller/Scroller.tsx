import C from "./Scroller.module.scss";
import { ArrowBackSvg } from "../../../../../../../../shared/assets/svg/SvgProvider";
import { AnimatePresence, motion } from "framer-motion";
type ScrollerProps = {
  onScroll: () => void;
  show: boolean;
};
const Scroller = ({ onScroll, show }: ScrollerProps) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{
            y: "150%",
            opacity: 0,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            y: "150%",
            opacity: 0,
          }}
          onClick={onScroll}
          className={C.Scroller}
        >
          <motion.div
            className={C.IconHolder}
            animate={{
              y: "15%",
              transition: {
                repeat: Infinity,
                repeatType: "mirror",
                type: "spring",
              },
            }}
          >
            <ArrowBackSvg />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Scroller;
