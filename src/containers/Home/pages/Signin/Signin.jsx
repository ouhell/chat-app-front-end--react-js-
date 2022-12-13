import classes from "./Signin.module.scss";
import { Input, Button } from "antd";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Signin = () => {
  const [signinData, setSigninData] = useState({
    identifier: "",
    password: "",
  });

  const navigate = useNavigate();

  const signIn = () => {
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
      .catch((err) => console.log(err));
  };
  return (
    <section className={classes.Signin}>
      <div className={classes.SigninBox}>
        <div className={classes.InputHolder}>
          <Input
            value={signinData.identifier}
            onChange={(e) => {
              setSigninData((oldvalue) => {
                return { ...oldvalue, identifier: e.target.value };
              });
            }}
            className={classes.Input}
            placeholder="username or email"
          />
        </div>
        <div className={classes.InputHolder}>
          <Input.Password
            value={signinData.password}
            onChange={(e) => {
              setSigninData((oldvalue) => {
                return { ...oldvalue, password: e.target.value };
              });
            }}
            className={classes.Input}
            placeholder="password"
          />
        </div>
        <Button className={classes.Button} onClick={signIn}>
          Signin
        </Button>
      </div>
    </section>
  );
};

export default Signin;
