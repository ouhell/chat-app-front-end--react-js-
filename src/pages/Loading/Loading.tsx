import { motion } from "framer-motion";
import C from "./Loading.module.scss";

const LoadingPage = () => {
  return (
    <div className={C.Loading}>
      <svg viewBox="0 0 64 64">
        <g id="Layer_1">
          <motion.g
          /*  initial={{
              pathLength: 0,
            }} */
          >
            <motion.circle
              /* animate={{
                r: 45,
                transition: {
                  repeat: Infinity,
                  repeatType: "reverse",
                  stiffness: 20,
                },
              }} */
              cx="32"
              cy="32"
              r="32"
              fill="#b750fd"
            />
          </motion.g>
          <g opacity={0.2}>
            <path
              fill="#6d54e5"
              d="M52,32c0-9.9-9-18-20-18s-20,8.1-20,18c0,9.6,8.3,17.4,18.8,17.9C31.5,53.6,32,56,32,56s5-3,9.6-8.2
			C47.8,44.7,52,38.8,52,32z"
            />
          </g>
          <g>
            <path
              fill="#FFFFFF"
              d="M49,28.8C49,43.8,32,54,32,54s-9.4-42,0-42S49,19.5,49,28.8z"
            />
          </g>
          <g>
            <ellipse fill="#FFFFFF" cx="32" cy="30" rx="20" ry="18" />
          </g>
          <motion.g
            animate={{
              y: "-20%",
              transition: {
                repeat: Infinity,
                repeatType: "mirror",
                duration: 0.5,
                delay: 0.5,
                repeatDelay: 0.7,
              },
            }}
          >
            <circle fill="#6d54e5" cx="32" cy="30" r="2" />
          </motion.g>
          <motion.g
            animate={{
              y: "-20%",
              transition: {
                repeat: Infinity,
                repeatType: "mirror",
                duration: 0.5,
                delay: 1,
                repeatDelay: 0.7,
              },
            }}
          >
            <circle fill="#6d54e5" cx="40" cy="30" r="2" />
          </motion.g>
          <motion.g
            animate={{
              y: "-20%",
              transition: {
                repeat: Infinity,
                repeatType: "mirror",
                duration: 0.5,
                delay: 0,
                repeatDelay: 0.7,
              },
            }}
          >
            <circle fill="#6d54e5" cx="24" cy="30" r="2" />
          </motion.g>
        </g>
        <g id="Layer_2"></g>
      </svg>
    </div>
  );
};

export default LoadingPage;
