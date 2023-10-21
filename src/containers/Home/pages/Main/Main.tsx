import { motion } from "framer-motion";
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
              y: -40,
              opacity: 0.5,
            }}
            animate={{
              y: -40,
              opacity: 0.5,
              transition: {
                duration: 0,
              },
            }}
            whileInView={{
              y: 0,
              opacity: 1,
              transition: {
                duration: 1.4,
                ease: [0.25, 0.25, 0.25, 0.75],
              },
            }}
            viewport={{
              once: true,
            }}
          >
            Seamless Conversations Made Simple
          </motion.div>
          <motion.div
            className={c.Content}
            initial={{
              x: 40,
              opacity: 0,
            }}
            animate={{
              x: 40,
              opacity: 0,
              transition: {
                duration: 0,
              },
            }}
            whileInView={{
              x: 0,
              opacity: 1,
              transition: {
                duration: 1.4,
                ease: [0.25, 0.25, 0.25, 0.75],
                delay: 0.4,
              },
            }}
            viewport={{
              once: true,
            }}
          >
            "Connecting you with ease. Experience smooth communication and
            real-time interactions. Stay connected, stay engaged, and enjoy
            hassle-free conversations with our simple chat application."
          </motion.div>
          <motion.div
            initial={{
              x: -30,
              opacity: 0,
            }}
            animate={{
              x: -30,
              opacity: 0,
              transition: {
                duration: 0,
              },
            }}
            whileInView={{
              x: 0,
              opacity: 1,
              transition: {
                duration: 1.4,
                ease: "easeInOut",
                delay: 0.5,
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
            // x: 100,
            // y: 100,
            opacity: 0,
          }}
          animate={{
            // x: 100,
            // y: 100,
            opacity: 0,
            transition: {
              duration: 0,
            },
          }}
          whileInView={{
            x: 0,
            y: 0,
            opacity: 1,
            transition: {
              duration: 1,
              delay: 1.5,
              ease: [0.25, 0.25, 0.25, 0.75],
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
