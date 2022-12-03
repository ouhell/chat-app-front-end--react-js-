import { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import classes from "./App.module.scss";
import Chat from "./containers/Chat/Chat";

function App() {
  return (
    <div className={classes.App}>
      <Routes>
        <Route path="/*" element={<Chat />} />
      </Routes>
    </div>
  );
}

export default App;
