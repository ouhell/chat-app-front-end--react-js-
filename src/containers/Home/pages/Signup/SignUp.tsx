import classes from "./Signup.module.scss";
import { Input, Button } from "antd";
import { ReactNode, useState } from "react";

import {
  UnlockOutlined,
  UserOutlined,
  CheckOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { NavLink, useNavigate } from "react-router-dom";
import { useRef } from "react";
import { motion } from "framer-motion";
import {
  apiCheckEmailExists,
  apiCheckUsernameExists,
  apiSignup,
  oauthLogin,
} from "../../../../client/ApiClient";
import { GoogleLogin } from "@react-oauth/google";
import { useAppDispatch } from "../../../../store/ReduxHooks";
import { AuthActions } from "../../../../store/slices/AuthSlice";
import { NotifActions } from "../../../../store/slices/NotificationSlice";

const variants = {
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
    },
  },
  hidden: { opacity: 0, y: 15 },
};

type Validation = {
  isValid: boolean;
  errorMessage: string;
};

type InputConfig = {
  type: "text" | "password";
  prefix: ReactNode;
  placeHolder: string;
  maxLength: number;
  visibilityToggle?: boolean;
};

type Field = {
  value: string;
  validation: (value: string) => unknown;
  isValid: boolean;
  errorMessage: string;
  isTouched: boolean;
  isLoading: boolean;
  input_config: InputConfig;
};

type FormData = {
  feilds: { [key: string]: Field };
};

const SignUp = () => {
  const usernameCounter = useRef(0);
  const emailCounter = useRef(0);
  const [signupFormData, setSignupFormData] = useState<FormData>({
    feilds: {
      username: {
        value: "",
        validation: (value) => {
          const testingValue = value.trim();
          const validation = {
            isValid: true,
            errorMessage: "",
          };

          if (testingValue.length < 4) {
            validation.isValid = false;
            validation.errorMessage =
              "username must be longer than 3 characters";
            return setValidation("username", validation);
          }

          if (testingValue.length > 11) {
            validation.isValid = false;
            validation.errorMessage =
              "username must be less than 11 characters";
            return setValidation("username", validation);
          }

          // check if username already exists
          // setloading("username", true);
          setSignupFormData((old) => {
            const newFormData = { ...old };
            const newFeilds = { ...newFormData.feilds };
            const newFeild = { ...newFeilds.username };
            newFeild.isLoading = true;
            newFeilds.username = newFeild;
            newFormData.feilds = newFeilds;
            return newFormData;
          });
          usernameCounter.current++;
          const counter = usernameCounter.current;

          apiCheckUsernameExists(testingValue)
            .then((res) => {
              if (res.data) {
                validation.isValid = false;
                validation.errorMessage = "username already exists!";
              }
            })
            .catch(() => {
              validation.isValid = false;
              validation.errorMessage = "connection error";
            })
            .finally(() => {
              if (usernameCounter.current !== counter) return;

              setValidation("username", validation);
            });
        },
        isValid: false,
        errorMessage: "",
        isTouched: false,
        isLoading: false,
        input_config: {
          type: "text",
          prefix: <UserOutlined className={classes.PrefixIcon} />,
          placeHolder: "Username",
          maxLength: 25,
        },
      },
      personal_name: {
        value: "",
        validation: (value) => {
          const testingValue = value.trim();
          const validation = {
            isValid: true,
            errorMessage: "",
          };

          if (testingValue.length < 4) {
            validation.isValid = false;
            validation.errorMessage = "name must be longer than 3 characters";
            return setValidation("personal_name", validation);
          }

          setValidation("personal_name", validation);
        },
        isValid: false,
        errorMessage: "",
        isTouched: false,
        isLoading: false,
        input_config: {
          type: "text",
          prefix: <UserOutlined className={classes.PrefixIcon} />,
          placeHolder: "Personal Name",
          maxLength: 25,
        },
      },
      email: {
        value: "",
        validation: (value) => {
          const testingValue = value.trim();
          const validation = {
            isValid: true,
            errorMessage: "",
          };

          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testingValue)) {
            validation.isValid = false;
            validation.errorMessage = "invalid email";
            return setValidation("email", validation);
          }

          // setloading("email", true);
          setSignupFormData((old) => {
            const newFormData = { ...old };
            const newFeilds = { ...newFormData.feilds };
            const newFeild = { ...newFeilds.email };
            newFeild.isLoading = true;
            newFeilds.email = newFeild;
            newFormData.feilds = newFeilds;
            return newFormData;
          });
          emailCounter.current++;
          const counter = emailCounter.current;

          apiCheckEmailExists(testingValue)
            .then((res) => {
              if (res.data) {
                validation.isValid = false;
                validation.errorMessage = "email already exists!";
              }
            })
            .catch(() => {
              validation.isValid = false;
              validation.errorMessage = "connection error";
            })
            .finally(() => {
              if (emailCounter.current !== counter) return;
              setValidation("email", validation);
            });
        },
        isValid: false,
        errorMessage: "",
        isTouched: false,
        isLoading: false,
        input_config: {
          type: "text",
          prefix: <span className={classes.PrefixIcon}>@</span>,
          placeHolder: "Email",
          maxLength: 60,
        },
      },
      password: {
        value: "",
        validation: function (value) {
          const testingValue = value.trim();
          const validation = {
            isValid: true,
            errorMessage: "",
          };
          // signupFormData.feilds.confrim_password.validation(
          //   signupFormData.feilds.confrim_password.value
          // );
          // this.parent.confrim_password.validation(
          //   this.parent.confrim_password.value
          // );
          // check that it is longer than 8
          if (testingValue.length < 8) {
            validation.isValid = false;
            validation.errorMessage =
              "minimum eight characters, at least one uppercase letter, one lowercase letter and one number";
            return setValidation("password", validation);
          }

          // check that it contains at least a digit
          if (!/\d/.test(testingValue)) {
            validation.isValid = false;
            validation.errorMessage =
              "minimum eight characters, at least one uppercase letter, one lowercase letter and one number";
            return setValidation("password", validation);
          }
          // check that it contains at least one lowercase character
          if (!/[a-z]/.test(testingValue)) {
            validation.isValid = false;
            validation.errorMessage =
              "minimum eight characters, at least one uppercase letter, one lowercase letter and one number";
            return setValidation("password", validation);
          }

          // check that it contains at least one uppercase character
          if (!/[A-Z]/.test(testingValue)) {
            validation.isValid = false;
            validation.errorMessage =
              "minimum eight characters, at least one uppercase letter, one lowercase letter and one number";
            return setValidation("password", validation);
          }

          setValidation("password", validation);
        },
        isValid: false,
        errorMessage: "",
        isTouched: false,
        isLoading: false,
        input_config: {
          type: "password",
          prefix: <UnlockOutlined className={classes.PrefixIcon} />,
          placeHolder: "Password",
          visibilityToggle: true,
          maxLength: 25,
        },
      },
      // confrim_password: {
      //   value: "",
      //   validation: function (value) {
      //     const testingValue = value.trim();
      //     const validation = {
      //       isValid: true,
      //       errorMessage: "",
      //     };

      //     if (testingValue !== signupFormData.feilds.password.value.trim()) {
      //       validation.isValid = false;

      //       return setValidation("confrim_password", validation);
      //     }

      //     setValidation("confrim_password", validation);
      //   },
      //   isValid: false,
      //   errorMessage: "",
      //   isTouched: false,
      //   isLoading: false,
      //   input_config: {
      //     type: "password",
      //     prefix: <LockOutlined className={classes.PrefixIcon} />,
      //     placeHolder: "Confirm Password",
      //     visibilityToggle: false,
      //     maxLength: 25,
      //   },
      // },
    },
  });
  const [isSigningUp, setIsSigningUp] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const oauthSignIn = (id_token?: string) => {
    if (isSigningUp) return;
    setIsSigningUp(true);
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
        setIsSigningUp(false);
      });
  };

  function registerNewAccount() {
    if (isSigningUp) return;
    if (!isFormValid()) {
      validateAll();
      return;
    }

    setIsSigningUp(true);

    const userData = {
      username: signupFormData.feilds.username.value,
      email: signupFormData.feilds.email.value,
      personal_name: signupFormData.feilds.personal_name.value,
      password: signupFormData.feilds.password.value,
    };

    // for (let feild in signupFormData.feilds) {
    //   userData[feild] = signupFormData.feilds[feild].value.trim();
    // }

    apiSignup(userData)
      .then((res) => {
        dispatch(AuthActions.login(res.data));
      })
      .catch((err) => {
        console.log("signup error ", err);
      })
      .finally(() => {
        setIsSigningUp(false);
      });
  }

  function isFormValid() {
    for (const feild in signupFormData.feilds) {
      if (!signupFormData.feilds[feild].isValid) {
        return false;
      }
    }

    return true;
  }

  function validateAll() {
    for (const feild in signupFormData.feilds) {
      if (!signupFormData.feilds[feild].isValid) {
        signupFormData.feilds[feild].validation(
          signupFormData.feilds[feild].value
        );
      }
    }
  }

  // function resetFeildsParent(feilds) {
  //   (feilds.init = function () {
  //     for (let i in this) {
  //       if (typeof this[i] == "object") {
  //         this[i].parent = this;
  //       }
  //     }
  //     delete this.init;
  //   }),
  //     feilds.init();
  // }

  // function setloading(key: string, value: string) {
  //   setSignupFormData((prevFormData) => {
  //     const newFormData = { ...prevFormData };
  //     const newFeilds = { ...newFormData.feilds };
  //     const selectedFeild = { ...newFeilds[key] };

  //     selectedFeild.isTouched = true;
  //     selectedFeild.isValid = false;
  //     selectedFeild.isLoading = value;

  //     newFeilds[key] = selectedFeild;

  //     // resetFeildsParent(newFeilds);

  //     newFormData.feilds = newFeilds;
  //     return newFormData;
  //   });
  // }

  function setValidation(key: string, validation: Validation) {
    setSignupFormData((prevFormData) => {
      const newFormData = { ...prevFormData };
      const newFeilds = { ...newFormData.feilds };
      const selectedFeild = { ...newFeilds[key] };

      selectedFeild.isTouched = true;
      selectedFeild.isValid = validation.isValid;
      selectedFeild.errorMessage = validation.errorMessage;
      selectedFeild.isLoading = false;
      newFeilds[key] = selectedFeild;
      // resetFeildsParent(newFeilds);
      newFormData.feilds = newFeilds;
      return newFormData;
    });
  }

  function changeValue(key: string, newValue: string) {
    setSignupFormData((prevFormData) => {
      const newFormData = { ...prevFormData };
      const newFeilds = { ...newFormData.feilds };
      const selectedFeild = { ...newFeilds[key] };

      selectedFeild.isTouched = true;
      selectedFeild.value = newValue;

      newFeilds[key] = selectedFeild;
      // resetFeildsParent(newFeilds);
      newFormData.feilds = newFeilds;
      return newFormData;
    });

    signupFormData.feilds[key].validation(newValue);
  }

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
        <header className={classes.Header}>Sign Up</header>

        <motion.div
          className={classes.InputBox}
          variants={variants}
          initial="hidden"
          animate="visible"
        >
          {Object.keys(signupFormData.feilds).map((key) => {
            const feild = signupFormData.feilds[key];
            const config = feild.input_config;

            const props = {
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                changeValue(key, e.target.value);
              },
              value: feild.value,
              maxLength: config.maxLength,
              placeholder: config.placeHolder,
              className: classes.Input,
              status:
                !feild.isValid && feild.isTouched && !feild.isLoading
                  ? "error"
                  : ("normal" as "error" | ""),
              prefix: config.prefix,
              suffix: feild.isValid ? (
                <CheckOutlined
                  style={{
                    color: "green",
                  }}
                />
              ) : feild.isLoading ? (
                <LoadingOutlined
                  style={{
                    color: "var(--primary-soft)",
                  }}
                />
              ) : null,
              visibilityToggle: false,
            };
            let InputType = Input;

            const isPasswordInput = config.type === "password";

            if (isPasswordInput) {
              InputType = Input.Password as typeof Input;

              props.visibilityToggle = !!config.visibilityToggle;
            }

            return (
              <motion.div
                className={classes.InputHolder}
                variants={variants}
                key={key}
              >
                {feild.errorMessage ? (
                  <div className={classes.InputError}>{feild.errorMessage}</div>
                ) : null}
                <InputType {...props} type={config.type} />
              </motion.div>
            );
          })}
        </motion.div>

        <Button
          className={classes.Button}
          type="primary"
          loading={isSigningUp}
          onClick={registerNewAccount}
        >
          Sign Up
        </Button>

        <div
          style={{
            display: "grid",
            placeItems: "center",
          }}
        >
          <div className={classes.Divider}>
            <div className={classes.DividerLine}></div>
            <div className={classes.DiviverContent}>or</div>
            <div className={classes.DividerLine}></div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: " center",
          }}
        >
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              console.log(credentialResponse);
              oauthSignIn(credentialResponse.credential);
            }}
            onError={() => {
              console.log("Login Failed");
            }}
            auto_select={false}
            shape="circle"
          />
        </div>
        <footer className={classes.Suggestion}>
          <span className={classes.SuggestionText}>
            Already have an account?{" "}
          </span>
          <NavLink className={classes.SuggestionLink} to="/signin">
            login
          </NavLink>
        </footer>
      </div>
    </motion.section>
  );
};

export default SignUp;
