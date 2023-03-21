import { Button } from "antd";
import axios from "axios";
import { m, motion, useScroll, useSpring } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ChatIllustration from "../../../../shared/assets/svg/chat-illustration.svg";

import c from "./Main.module.scss";

const Main = () => {
  const navigate = useNavigate();

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
        <motion.div className={c.Description}>
          <motion.div
            className={c.Title}
            initial={{
              y: "-50%",
              opacity: 0.5,
            }}
            animate={{
              y: "-50%",
              opacity: 0.5,
              transition: {
                duration: 0,
              },
            }}
            whileInView={{
              y: 0,
              opacity: 1,
              transition: {
                type: "spring",
                stiffness: 100,
                damping: 20,
              },
            }}
            viewport={{
              once: true,
            }}
          >
            The Ultimate Communication Platform
          </motion.div>
          <motion.div
            className={c.Content}
            initial={{
              x: "30%",
              opacity: 0.5,
            }}
            animate={{
              x: "30%",
              opacity: 0.5,
              transition: {
                duration: 0,
              },
            }}
            whileInView={{
              x: 0,
              opacity: 1,
              transition: {
                type: "spring",
                stiffness: 50,
                damping: 20,
              },
            }}
            viewport={{
              once: true,
            }}
          >
            {" "}
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dicta
            reiciendis voluptatum numquam quas a tempore expedita necessitatibus
            nihil unde amet enim exercitationem, autem, similique consequatur?
            Quaerat ut iusto voluptatem quis inventore vero voluptatibus sequi
            voluptatum provident, voluptate atque. Commodi in reiciendis
            architecto eos modi iusto cupiditate provident molestiae voluptatum
            saepe!{" "}
          </motion.div>
          <motion.div
            initial={{
              x: "-100%",
              opacity: 0.3,
            }}
            animate={{
              x: "-100%",
              opacity: 0.3,
              transition: {
                duration: 0,
              },
            }}
            whileInView={{
              x: 0,
              opacity: 1,
              transition: {
                type: "spring",
                damping: 20,
              },
            }}
            viewport={{
              once: true,
            }}
            className={c.ActionHolder}
          >
            <motion.button
              className={c.PrimaryButton}
              onClick={() => {
                navigate("/signup");
              }}
            >
              Get Started
            </motion.button>
            <motion.button
              className={c.SecondaryButton}
              onClick={() => {
                navigate("/signin");
              }}
            >
              Login
            </motion.button>
          </motion.div>
        </motion.div>
        <motion.div
          className={c.Visualisation}
          initial={{
            x: "7%",
            y: "7%",
            opacity: 0.5,
          }}
          animate={{
            x: "7%",
            y: "7%",
            opacity: 0.5,
            transition: {
              duration: 0,
            },
          }}
          whileInView={{
            x: 0,
            y: 0,
            opacity: 1,
            transition: {
              type: "spring",
              stiffness: 50,
              damping: 20,
            },
          }}
          viewport={{
            once: true,
          }}
        >
          <img src={ChatIllustration} />
        </motion.div>
      </motion.section>
    </motion.div>
  );
};

export default Main;
