import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";

import classes from "./App.module.scss";
import Chat from "./containers/Chat/Chat";
import Home from "./containers/Home/Home";

function App() {
  const userData = useSelector((state) => state.auth.userData);
  let mainElement = userData ? <Chat /> : <Home />;

  return (
    <div className={classes.App}>
      {/* {contextHolder} */}
      <Routes>
        <Route path="/*" element={mainElement} />
      </Routes>
    </div>
  );
}

export default App;
