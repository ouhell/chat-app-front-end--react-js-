import { Empty } from "antd";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import classes from "./ChatDisplayer.module.scss";
import ContactDisplayer from "./components/ContactDisplayer/ContactDisplayer";
import { PluxCircleSvg } from "../../../../../../shared/assets/svg/SvgProvider";
import ContactAdder from "./components/ContactAdder/ContactAdder";
import PublicConversationDisplayer from "./components/PublicConversationDisplayer/PublicConversationDisplayer";
import { useAppSelector } from "../../../../../../store/ReduxHooks";

const chatTypes = [
  {
    key: "private",
    title: "private",
    render: <ContactDisplayer />,
  },
  {
    key: "groups",
    title: "groups",
    render: null,
  },
  {
    key: "public",
    title: "public",
    render: <PublicConversationDisplayer />,
  },
];

const ChatsDisplayer = () => {
  const [selectedChatType, setSelectedChatType] = useState(chatTypes[0]);
  const [showContactAdder, setShowContactAdder] = useState(false);

  const contactCount = useAppSelector(
    (state) => Object.keys(state.chat.contacts).length
  );
  const publicCount = useAppSelector((state) => state.chat.publicConvos.length);

  const chatTypeMeta = useMemo(
    () => ({
      private: contactCount,
      groups: 0,
      public: publicCount,
    }),
    [contactCount, publicCount]
  );

  return (
    <div className={classes.ChatDisplayer}>
      <ContactAdder
        open={showContactAdder}
        onCancel={() => {
          setShowContactAdder(false);
        }}
      ></ContactAdder>

      <header className={classes.Header}>
        <div>
          <h3 className={classes.HeaderText}>Chats</h3>
          <p className={classes.HeaderSubText}>Recent conversations</p>
        </div>
        <button
          type="button"
          className={classes.AddButton}
          aria-label="Add contact"
          onClick={() => {
            setShowContactAdder(true);
          }}
        >
          {<PluxCircleSvg />}
        </button>
      </header>

      <div className={classes.ChatTypes}>
        {chatTypes.map((type) => {
          const isSelected = selectedChatType.title === type.title;
          const count = chatTypeMeta[type.key as keyof typeof chatTypeMeta];
          return (
            <button
              type="button"
              key={type.title}
              className={
                classes.ChatType + (isSelected ? ` ${classes.active}` : "")
              }
              onClick={() => {
                setSelectedChatType(type);
              }}
            >
              <span>{type.title}</span>
              <span className={classes.TypeCount}>{count}</span>
              {isSelected ? (
                <motion.div // underline on active
                  className={classes.underline}
                  layoutId="ChatTypeUnderline"
                  transition={{
                    duration: 0.2,
                  }}
                ></motion.div>
              ) : null}
            </button>
          );
        })}
      </div>
      <div className={classes.Content}>
        {selectedChatType.key === "groups" ? (
          <div className={classes.EmptyState}>
            <Empty description="Groups are coming soon" />
          </div>
        ) : (
          selectedChatType.render
        )}
      </div>
    </div>
  );
};

export default ChatsDisplayer;
