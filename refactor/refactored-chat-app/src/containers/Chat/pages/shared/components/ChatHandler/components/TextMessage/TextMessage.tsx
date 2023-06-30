import { Avatar, Dropdown } from "antd";
import { MoreDotsSvg } from "../../../../../../../../shared/assets/svg/SvgProvider";
import c from "./TextMessage.module.scss";
import { motion } from "framer-motion";
import { forwardRef } from "react";

const formatDate = (date: Date) => {
  const hours = (date.getHours() + "").padStart(2, "0");
  const minutes = (date.getMinutes() + "").padStart(2, "0");

  return hours + ":" + minutes;
};

const items = [
  {
    label: "remove message",
    key: "delete",
    danger: true,
  },
];

type MessageProps = {
  message: Message;
  userId: string;
  deleteMessage: (message: Message) => void;
};

const TextMessage = (
  { message, userId, deleteMessage }: MessageProps,
  ref: any
) => {
  const sentDate = new Date(message.sent_date);

  const menuOnClick = ({ key }: { key: string }) => {
    switch (key) {
      case "delete":
        if (!message.temporary) deleteMessage(message);
    }
  };

  const isSender = userId === message.sender._id;

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: 1,

        scale: 1,
      }}
      exit={{
        opacity: 0,

        scale: 0.8,
      }}
      transition={{
        opacity: { duration: 0.2 },
      }}
      style={{
        originX: isSender ? 1 : 0,
      }}
      className={
        c.TextMessage +
        (isSender ? ` ${c.SelfSent}` : "") +
        (message.temporary ? " " + c.Temporary : "") +
        (message.error ? " " + c.Error : "")
      }
    >
      {!isSender && (
        <Avatar src={message.sender.profile_picture}>
          {message.sender.username[0]}
        </Avatar>
      )}
      <div className={c.MessageHolder} sent-date={formatDate(sentDate)}>
        {message.message}
        {isSender && (
          <div className={c.Options}>
            <Dropdown
              menu={{ items, onClick: menuOnClick }}
              trigger={["click"]}
            >
              <MoreDotsSvg />
            </Dropdown>
          </div>
        )}
        <div className={c.SentDateHolder}>{formatDate(sentDate)}</div>
      </div>
    </motion.div>
  );
};

export default forwardRef(TextMessage);
