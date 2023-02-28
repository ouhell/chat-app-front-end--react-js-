import classes from "./Signin.module.scss";
import { Input, Button } from "antd";
import { useState } from "react";
import axios from "axios";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AuthActions } from "../../../../store/slices/authenticationSlice";
import { NotifActions } from "../../../../store/slices/NotificationSlice";
import { motion } from "framer-motion";

const variants = {
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.2,
    },
  },
  hidden: { opacity: 0, y: 15 },
};

const Signin = () => {
  const [signinData, setSigninData] = useState({
    identifier: {
      value: "",
      type: "text",
      placeholder: "Username or Email",
      prefix: UserOutlined,
    },
    password: {
      value: "",
      type: "password",
      placeholder: "password",
      prefix: LockOutlined,
    },
  });
  const [isSigningIn, setIsSigningIn] = useState(false);
  const dispatch = useDispatch();

  const signIn = () => {
    if (isSigningIn) return;
    setIsSigningIn(true);
    axios
      .post("api/auth/login", {
        identifier: signinData.identifier.value.trim(),
        password: signinData.password.value.trim(),
      })
      .then((res) => {
        dispatch(AuthActions.login(res.data));
      })
      .catch((err) => {
        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.servedError
        ) {
          dispatch(
            NotifActions.notify({
              type: "error",
              message: err.response.data.message,
            })
          );
        }
        console.log("signin error", err);
      })
      .finally(() => {
        setIsSigningIn(false);
      });
  };
  return (
    <section className={classes.Signin}>
      <div className={classes.SigninBox}>
        <header className={classes.Header}>Login</header>

        <motion.div
          className={classes.InputBox}
          variants={variants}
          animate="visible"
          initial="hidden"
        >
          {Object.keys(signinData).map((key) => {
            let InputType = Input;
            const PrefixIcon = signinData[key].prefix;
            if (signinData[key].type === "password") InputType = Input.Password;
            return (
              <motion.div variants={variants} className={classes.InputHolder}>
                <InputType
                  prefix={<PrefixIcon className={classes.PrefixIcon} />}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") signIn();
                  }}
                  value={signinData[key].value}
                  onChange={(e) => {
                    setSigninData((oldvalue) => {
                      const newValue = { ...oldvalue };
                      newValue[key] = { ...oldvalue[key] };
                      newValue[key].value = e.target.value;
                      return newValue;
                    });
                  }}
                  className={classes.Input}
                  placeholder={signinData[key].placeholder}
                />
              </motion.div>
            );
          })}
        </motion.div>

        <Button
          className={classes.Button}
          type="primary"
          onClick={signIn}
          loading={isSigningIn}
        >
          login
        </Button>
        <footer className={classes.Suggestion}>
          <span className={classes.SuggestionText}>Dont have an account? </span>
          <NavLink className={classes.SuggestionLink} to="/signup">
            sign up
          </NavLink>
        </footer>
      </div>
    </section>
  );
};

export default Signin;
