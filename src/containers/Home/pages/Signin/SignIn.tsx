import classes from "./Signin.module.scss";
import { Input, Button } from "antd";
import { useState } from "react";

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import { useAppDispatch } from "../../../../store/ReduxHooks";
import { AuthActions } from "../../../../store/slices/AuthSlice";
import { NotifActions } from "../../../../store/slices/NotificationSlice";
import { motion } from "framer-motion";
import { apiLogin, oauthLogin } from "../../../../client/ApiClient";
import { GoogleLogin } from "@react-oauth/google";
import axios, { AxiosError } from "axios";

const shellVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 210,
      staggerChildren: 0.08,
      delayChildren: 0.06,
    },
  },
};

const panelVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const formVariants = {
  hidden: { opacity: 0, x: 16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const formListVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};

const fieldVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
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
      placeholder: "Password",
      prefix: LockOutlined,
    },
  });
  const [isSigningIn, setIsSigningIn] = useState(false);
  const dispatch = useAppDispatch();

  const oauthSignIn = (id_token?: string) => {
    if (isSigningIn) return;
    setIsSigningIn(true);
    oauthLogin(id_token)
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

  const signIn = () => {
    if (isSigningIn) return;
    setIsSigningIn(true);
    apiLogin({
      identifier: signinData["identifier"].value,
      password: signinData["password"].value,
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
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={classes.Signin}
    >
      <motion.div
        className={classes.AuthShell}
        variants={shellVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.aside className={classes.VisualPanel} variants={panelVariants}>
          <div className={classes.VisualEyebrow}>ChatEase</div>
          <h2 className={classes.VisualTitle}>Welcome back to your space.</h2>
          <p className={classes.VisualContent}>
            Jump into ongoing conversations, sync instantly, and keep every
            message where it belongs.
          </p>
          <div className={classes.VisualPills}>
            <span>Secure</span>
            <span>Realtime</span>
            <span>Cross-device</span>
          </div>
        </motion.aside>

        <motion.div className={classes.SigninBox} variants={formVariants}>
          <header className={classes.Header}>Sign in</header>
          <div className={classes.SubHeader}>
            Continue your chats in one click.
          </div>

          <motion.div
            className={classes.InputBox}
            initial="hidden"
            animate="visible"
            variants={formListVariants}
          >
            {Object.keys(signinData).map((key) => {
              let InputType = Input;
              const PrefixIcon = signinData[key].prefix;
              if (signinData[key].type === "password")
                InputType = Input.Password as typeof Input;
              return (
                <motion.div
                  key={key}
                  variants={fieldVariants}
                  className={classes.InputHolder}
                >
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
                    autoComplete={
                      key === "identifier"
                        ? "username"
                        : key === "password"
                          ? "current-password"
                          : "off"
                    }
                  />
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div variants={fieldVariants} className={classes.ButtonHolder}>
            <Button
              className={classes.Button}
              type="primary"
              onClick={signIn}
              loading={isSigningIn}
            >
              Sign in
            </Button>
          </motion.div>

          <motion.div variants={fieldVariants} className={classes.DividerWrap}>
            <div className={classes.Divider}>
              <div className={classes.DividerLine}></div>
              <div className={classes.DiviverContent}>or continue with</div>
              <div className={classes.DividerLine}></div>
            </div>
          </motion.div>

          <motion.div variants={fieldVariants} className={classes.GoogleHolder}>
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                console.log(credentialResponse);
                oauthSignIn(credentialResponse.credential);
                axios({
                  url: `https://oauth2.googleapis.com/tokeninfo`,
                  params: {
                    id_token: credentialResponse.credential,
                  },
                  method: "get",
                })
                  .then((res) => {
                    console.log("google token info :", res);
                  })
                  .catch((err: AxiosError) => {
                    console.log("google token error:", err);
                    console.log("google token error data: ", err.response);
                  });
              }}
              onError={() => {
                console.log("Login Failed");
              }}
              auto_select={false}
              shape="circle"
            />
          </motion.div>

          <motion.footer variants={fieldVariants} className={classes.Suggestion}>
            <span className={classes.SuggestionText}>
              Don&apos;t have an account?{" "}
            </span>
            <NavLink className={classes.SuggestionLink} to="/signup">
              Sign up
            </NavLink>
          </motion.footer>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default Signin;
