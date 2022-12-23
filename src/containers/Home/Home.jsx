import { Route, Routes } from "react-router-dom";
import Signin from "./pages/Signin/SignIn";
import SignUp from "./pages/Signup/SignUp";
import c from "./Home.module.scss";
const Home = () => {
  return (
    <div className={c.Home}>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </div>
  );
};
export default Home;
