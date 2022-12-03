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
            <NavLink
              key={type.title}
              to={type.path}
              style={({ isActive }) => {
                return { textDecoration: "none" };
              }}
              className={({ isActive }) => (isActive ? classes.activeLink : "")}
              end
            >
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
            </NavLink>
          );
        })}
      </div>
      <div className={classes.Content}>
        <Routes>
          {["/", "/private/*"].map((path) => (
            <Route key={path} path={path} element={<ContactDisplayer />} />
          ))}
        </Routes>
      </div>
    </div>
  );
};

export default ChatsDisplayer;
