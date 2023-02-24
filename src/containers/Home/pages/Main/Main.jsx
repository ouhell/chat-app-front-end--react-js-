import axios from "axios";
import { m, motion } from "framer-motion";

import c from "./Main.module.scss";

const Main = () => {
  return (
    <div className={c.Main}>
      <m.section className={c.FirstHandler}>
        <m.div className={c.Description}></m.div>
        <m.div className={c.Visualisation}></m.div>
      </m.section>
    </div>
  );
};

export default Main;
