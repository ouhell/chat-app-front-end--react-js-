import { Route, Routes } from "react-router-dom";
import classes from "./Chat.module.scss";
import NavBar from "./components/NavBar/NavBar";
import PublicConversation from "./pages/PublicConversation/PublicConversation";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChatActions } from "../../store/slices/ChatSlice";

export default function Chat() {
  const counter = useSelector((state) => state.counter);

  const dispatch = useDispatch();
  useEffect(() => {}, []);

  return (
    <div className={classes.Chat}>
      <section className={classes.MainSection}>
        <NavBar />
        <div className={classes.MainContent}>
          <Routes>
            <Route path="/chats/private/:id" element={<PublicConversation />} />
          </Routes>
        </div>
        <div
          className={classes.SideContent}
          onClick={() => {
            dispatch(ChatActions.increment());
          }}
        ></div>
      </section>
    </div>
  );
}
