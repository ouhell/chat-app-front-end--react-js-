import classes from "./Signin.module.scss";
import { Input, Button } from "antd";
import { useState } from "react";
import axios from "axios";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { NavLink, useNavigate } from "react-router-dom";
const Signin = () => {
  const [signinData, setSigninData] = useState({
    identifier: "",
    password: "",
  });
  const [isSigningIn, setIsSigningIn] = useState(false);

  const navigate = useNavigate();

  const signIn = () => {
    if (isSigningIn) return;
    setIsSigningIn(true);
    axios
      .post("api/auth/login", {
        identifier: signinData.identifier.trim(),
        password: signinData.password.trim(),
      })
      .then((res) => {
        localStorage.setItem("userData", JSON.stringify(res.data));
        navigate("/", {
          replace: true,
        });
        navigate(0);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsSigningIn(false);
      });
  };
  return (
    <section className={classes.Signin}>
      <div className={classes.SigninBox}>
        <header className={classes.Header}>Login</header>

        <div className={classes.InputBox}>
          <div className={classes.InputHolder}>
            <Input
              prefix={<UserOutlined className={classes.PrefixIcon} />}
              onKeyDown={(e) => {
                if (e.key === "Enter") signIn();
              }}
              value={signinData.identifier}
              onChange={(e) => {
                setSigninData((oldvalue) => {
                  return { ...oldvalue, identifier: e.target.value };
                });
              }}
              className={classes.Input}
              placeholder="Username or Email"
            />
          </div>
          <div className={classes.InputHolder}>
            <Input.Password
              prefix={<LockOutlined className={classes.PrefixIcon} />}
              onKeyDown={(e) => {
                if (e.key === "Enter") signIn();
              }}
              value={signinData.password}
              onChange={(e) => {
                setSigninData((oldvalue) => {
                  return { ...oldvalue, password: e.target.value };
                });
              }}
              className={classes.Input}
              placeholder="Password"
            />
          </div>
        </div>

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
