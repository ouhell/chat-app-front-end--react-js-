import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Signin from "./pages/Signin/SignIn";
import SignUp from "./pages/Signup/SignUp";
import Main from "./pages/Main/Main";
import { motion, m, AnimatePresence } from "framer-motion";
import c from "./Home.module.scss";
import { LogoSvg } from "../../shared/assets/svg/SvgProvider";

const navigationItems = [
  { name: "login", to: "/signin" },
  { name: "about", to: "/about" },
  { name: "extra", to: "/extra" },
];

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className={c.Home}>
      <motion.header className={c.Header}>
        <motion.div drag className={c.LogoHolder}>
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
            ShutApp
          </m.div>
        </motion.div>
        <m.div className={c.NavigationHolder}>
          {navigationItems.map((item) => {
            return (
              <motion.div
                key={item.name}
                whileHover={{
                  y: -2,
                  scale: 1.02,
                  color: "rgb(100 219 222)",
                }}
                className={c.NavigationItem}
                onClick={() => {
                  navigate(item.to);
                }}
              >
                {item.name}
              </motion.div>
            );
          })}
        </m.div>
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
