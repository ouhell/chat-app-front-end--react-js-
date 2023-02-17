import { Route, Routes } from "react-router-dom";
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

export default function Chat() {
  const startY = useRef(0);
  const startX = useRef(0);

  const userData = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();
  useEffect(() => {
    fetchNotifications();
    dispatch(
      ChatActions.emit({
        event: "self connect",
        data: userData.userId,
      })
    );

    dispatch(
      ChatActions.on({
        event: "receive message",
        callback: (message) => {
          console.log("");
          dispatch(
            ChatActions.addMessage({
              conversation_id: message.conversation,
              newMessage: message,
            })
          );
        },
      })
    );

    dispatch(
      ChatActions.on({
        event: "remove message",
        callback: (message) => {
          dispatch(
            ChatActions.deleteMessage({
              conversation_id: message.conversation,
              id: message._id,
            })
          );
        },
      })
    );
  }, []);

  const fetchNotifications = () => {
    axios
      .get("/api/userapi/request", {
        headers: {
          authorization: "Bearer " + userData.access_token,
        },
      })
      .then((res) => {
        dispatch(ChatActions.setRequests(res.data));
        dispatch(
          ChatActions.on({
            event: "receive request",
            callback: (request) => {
              dispatch(ChatActions.addRequest(request));
            },
          })
        );
        dispatch(
          ChatActions.on({
            event: "canceled request",
            callback: (requestId) => {
              dispatch(ChatActions.removeRequest(requestId));
            },
          })
        );
      })
      .catch((err) => {
        console.log("fetch request error :", err);
      });
  };

  return (
    <div className={classes.Chat}>
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
          <Routes>
            <Route
              path="/chats/private/:id"
              element={<PrivateConversation />}
            />
            <Route path="/chats/public/:id" element={<PublicConversation />} />
            <Route path="/settings" element={<Profile />} />
            <Route path="/*" element={<Default />} />
          </Routes>
        </div>
        <div className={classes.SideContent}></div>
      </section>
    </div>
  );
}
