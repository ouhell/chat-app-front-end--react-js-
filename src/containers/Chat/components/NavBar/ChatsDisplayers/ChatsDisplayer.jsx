import { useState } from "react";
import classes from "./ChatDisplayer.module.scss";
import ContactDisplayer from "./components/ContactDisplayer/ContactDisplayer";

const chatTypes = [
  {
    title: "private",
    render: <ContactDisplayer />,
  },
  {
    title: "groups",
    render: null,
  },
  {
    title: "public",
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
            </div>
          );
        })}
      </div>
      <div className={classes.Content}>{selectedChatType.render}</div>
    </div>
  );
};

export default ChatsDisplayer;
