import { motion, useInView } from "framer-motion";
import React, { useRef } from "react";

const variants = {
  hide: {
    x: "-500%",
    rotate: "-360deg",
    backgroundColor: "red",
  },
  show: {
    x: 0,
    rotate: 0,
    backgroundColor: "blue",
    transition: {
      delay: 0.5,
    },
  },
  enlarge: {
    scale: 1.2,
  },
};

const ViewBox = () => {
  const ref = useRef();
  const inView = useInView(ref, {
    margin: "-120px",
  });

  return (
    <motion.div
      ref={ref}
      style={{
        width: "10rem",
        height: "10rem",
        backgroundColor: "red",
      }}
      variants={variants}
      initial="hide"
      whileInView="show"
      whileHover={"enlarge"}
      /* viewport={{
        once: false,
        margin: "-100px 0px -50px 0px",
      }} */
    ></motion.div>
  );
};
export default ViewBox;
