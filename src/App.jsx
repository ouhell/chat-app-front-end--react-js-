import { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import classes from "./App.module.scss";
import Chat from "./containers/Chat/Chat";
import Home from "./containers/Home/Home";
import Signin from "./containers/Home/pages/Signin/SignIn";

function App() {
  const userData = localStorage.getItem("userData");
  let mainElement = userData ? <Chat /> : <Home />;

  return (
    <div className={classes.App}>
      <Routes>
        <Route path="/*" element={mainElement} />
      </Routes>
    </div>
  );
}

export default App;
