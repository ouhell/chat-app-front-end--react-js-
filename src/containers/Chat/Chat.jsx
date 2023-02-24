import { Route, Routes, useLocation } from "react-router-dom";
import classes from "./Chat.module.scss";
import NavBar from "./components/NavBar/NavBar";
import PrivateConversation from "./pages/PrivateConversation/PrivateConversation";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChatActions } from "../../store/slices/ChatSlice";
import Profile from "./pages/Profile/Profile";
import axios from "axios";
import { ComponentActions } from "../../store/slices/ComponentSlice";
import PublicConversation from "./pages/PublicConversation/PublicConversation";
import Default from "./pages/Default/Default";
import ChatController from "./components/ChatController/ChatController";
import { AnimatePresence } from "framer-motion";

export default function Chat() {
  const startY = useRef(0);
  const startX = useRef(0);
  const location = useLocation();
  const { pathname } = location;
  const dispatch = useDispatch();

  return (
    <div className={classes.Chat}>
      <ChatController />
      <section className={classes.MainSection}>
        <NavBar />
        <div
          className={classes.MainContent}
          onTouchStart={(e) => {
            startX.current = e.touches[0].clientX;
            startY.current = e.touches[0].clientY;
          }}
          onTouchEnd={(e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = endX - startX.current;
            const diffY = endY - startY.current;
            if (Math.abs(diffX) > Math.abs(diffY) && diffX > 30) {
              dispatch(ComponentActions.openNav());
            }
          }}
        >
          <AnimatePresence initial={false} mode={"wait"}>
            <Routes location={location} key={pathname}>
              <Route
                path="/chats/private/:id"
                element={<PrivateConversation />}
              />
              <Route
                path="/chats/public/:id"
                element={<PublicConversation />}
              />
              <Route path="/settings" element={<Profile />} />
              <Route path="/*" element={<Default />} />
            </Routes>
          </AnimatePresence>
        </div>
        <div className={classes.SideContent}></div>
      </section>
    </div>
  );
}
