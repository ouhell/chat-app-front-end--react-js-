import { useState } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import { motion } from "framer-motion";
import classes from "./ChatDisplayer.module.scss";
import ContactDisplayer from "./components/ContactDisplayer/ContactDisplayer";

const chatTypes = [
  {
    title: "private",
    path: "/chats/private",
    render: <ContactDisplayer />,
  },
  {
    title: "groups",
    path: "/chats/groups",
    render: null,
  },
  {
    title: "public",
    path: "/chats/public",
    render: null,
  },
];

const ChatsDisplayer = () => {
  const [selectedChatType, setSelectedChatType] = useState(chatTypes[0]);
  return (
    <div className={classes.ChatDisplayer}>
      <header className={classes.Header}>Chats</header>
      <div className={classes.ChatTypes}>
        {chatTypes.map((type) => {
          const isSelected = selectedChatType.title === type.title;
          return (
            <div
              key={type.title}
              className={
                classes.ChatType + (isSelected ? ` ${classes.active}` : "")
              }
              onClick={() => {
                setSelectedChatType(type);
              }}
            >
              {type.title}
              {isSelected ? (
                <motion.div // underline on active
                  className={classes.underline}
                  layoutId="ChatTypeUnderline"
                  transition={{
                    duration: 0.2,
                  }}
                ></motion.div>
              ) : null}
            </div>
          );
        })}
      </div>
      <div className={classes.Content}>{selectedChatType.render}</div>
    </div>
  );
};

export default ChatsDisplayer;
