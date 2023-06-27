import classes from "./Signin.module.scss";
import { Input, Button } from "antd";
import { useState } from "react";

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../../store/ReduxHooks";
import { AuthActions } from "../../../../store/slices/AuthSlice";
import { NotifActions } from "../../../../store/slices/NotificationSlice";
import { motion } from "framer-motion";
import { apiLogin } from "../../../../client/ApiClient";

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

type SignInInput = {
  value: string;
  type: "text" | "password";
  placeholder: string;
  prefix: typeof LockOutlined;
};

const Signin = () => {
  const [signinData, setSigninData] = useState<{ [key: string]: SignInInput }>({
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
  const dispatch = useAppDispatch();

  const signIn = () => {
    if (isSigningIn) return;
    setIsSigningIn(true);
    apiLogin(signinData)
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
    <motion.section
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
      className={classes.Signin}
    >
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
            if (signinData[key].type === "password")
              InputType = Input.Password as typeof Input;
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
    </motion.section>
  );
};

export default Signin;
