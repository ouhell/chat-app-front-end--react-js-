import { useState } from "react";
import { motion } from "framer-motion";
import classes from "./ChatDisplayer.module.scss";
import ContactDisplayer from "./components/ContactDisplayer/ContactDisplayer";
import { PluxCircleSvg } from "../../../../../../shared/assets/svg/SvgProvider";
import ContactAdder from "./components/ContactAdder/ContactAdder";
import { useDispatch } from "react-redux";
import { NotifActions } from "../../../../../../store/slices/NotificationSlice";
import PublicConversationDisplayer from "./components/PublicConversationDisplayer/PublicConversationDisplayer";

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
    render: <PublicConversationDisplayer />,
  },
];

const ChatsDisplayer = () => {
  const [selectedChatType, setSelectedChatType] = useState(chatTypes[0]);
  const [showContactAdder, setShowContactAdder] = useState(false);
  const dispatch = useDispatch();
  return (
    <div className={classes.ChatDisplayer}>
      <header className={classes.Header}>
        <ContactAdder
          open={showContactAdder}
          onCancel={() => {
            setShowContactAdder(false);
          }}
        ></ContactAdder>
        <div
          className={classes.HeaderText}
          onClick={() => {
            dispatch(
              NotifActions.notify({
                type: "success",
                message: "OK",
              })
            );
          }}
        >
          {" "}
          Chats
        </div>
        <div
          className={classes.AddButton}
          onClick={() => {
            setShowContactAdder(true);
          }}
        >
          {<PluxCircleSvg />}
        </div>
      </header>

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
