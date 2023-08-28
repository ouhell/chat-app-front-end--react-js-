import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Signin from "./pages/Signin/SignIn";
import SignUp from "./pages/Signup/SignUp";
import Main from "./pages/Main/Main";
import { motion, m, AnimatePresence } from "framer-motion";
import c from "./Home.module.scss";
import { LogoSvg } from "../../shared/assets/svg/SvgProvider";
import classNames from "classnames";

const navigationItems = [
  { name: "home", to: "/" },
  { name: "login", to: "/signin" },
  { name: "about", to: "/about" },
];

const variants = {
  hide: {
    scale: 0.8,
    opacity: 0,
  },
  show: {
    scale: 1,
    opacity: 1,
    transition: {
      delay: 0.5,
    },
  },
};

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className={c.Home}>
      <motion.header className={c.Header}>
        <motion.div className={c.LogoHolder}>
          <LogoSvg
            className={c.Logo}
            onClick={() => {
              navigate("/");
            }}
          />
          <m.div
            className={c.LogoText}
            onClick={() => {
              navigate("/");
            }}
          >
            ChatEase
          </m.div>
        </motion.div>
        <motion.div className={c.NavigationHolder} variants={variants}>
          {navigationItems.map((item, i) => {
            const isCurrentPath = location.pathname === item.to;
            return (
              <motion.div
                key={item.name}
                initial={{
                  scale: 0.8,
                  opacity: 0,
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  transition: {
                    delay: 0.2 * i,
                  },
                }}
                variants={variants}
                whileHover={{
                  y: -2,
                  scale: 1.02,
                  /* color: "rgb(100 219 222)", */
                }}
                className={classNames({
                  [c.NavigationItem]: true,
                  [c.active]: isCurrentPath,
                })}
                onClick={() => {
                  navigate(item.to);
                }}
              >
                {item.name}
                {isCurrentPath && (
                  <motion.div
                    layoutId="navigationUnderline"
                    className={c.Underline}
                  ></motion.div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </motion.header>
      <div className={c.Page}>
        <AnimatePresence initial={false} mode="wait">
          <Routes key={location.pathname} location={location}>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<Signin />} />

            <Route path="/*" element={<Main />} />
          </Routes>
        </AnimatePresence>
      </div>
    </div>
  );
};
export default Home;
