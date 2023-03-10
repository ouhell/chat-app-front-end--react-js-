import { Button } from "antd";
import axios from "axios";
import { m, motion, useScroll, useSpring } from "framer-motion";
import { useState } from "react";
import ViewBox from "./components/ViewBox";

import c from "./Main.module.scss";

const Main = () => {
  const y = useSpring(0);
  console.log("y movement :", y);
  return (
    <motion.div
      initial={{
        scale: 1.1,
        opacity: 0,
      }}
      animate={{
        scale: 1,
        opacity: 1,
      }}
      exit={{
        scale: 1.1,
        opacity: 0,
      }}
      className={c.Main}
    >
      <motion.section className={c.FirstHandler}>
        {/*  <motion.div className={c.Description}></motion.div>
        <motion.div
          style={{
            y,
          }}
          className={c.Visualisation}
        ></motion.div> */}
        <ViewBox />
        <ViewBox />
        <ViewBox />
        <ViewBox />
        <ViewBox />
        <ViewBox />
        <ViewBox />
        <ViewBox />
        <ViewBox />
        <ViewBox />
      </motion.section>

      <Button onClick={() => y.set(y.get() + 100)}>Move it</Button>
    </motion.div>
  );
};

export default Main;
