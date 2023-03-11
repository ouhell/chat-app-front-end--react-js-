import React, { lazy, Suspense } from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";

import classes from "./App.module.scss";
//import Chat from "./containers/Chat/Chat";
//import Home from "./containers/Home/Home";

function wait() {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, 3000);
  });
}

console.log("app classses", classes);

const Home = lazy(() => {
  return import("./containers/Home/Home");
});
const Chat = lazy(() => {
  return import("./containers/Chat/Chat");
});

function App() {
  const userData = useSelector((state) => state.auth.userData);

  const MainElement = userData ? <Chat /> : <Home />;

  return (
    <div className={classes.App}>
      {/* {contextHolder} */}
      <Suspense fallback={<h1>Loading...</h1>}>
        <Routes>
          <Route path="/*" element={MainElement} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
