import { Dropdown, Image, Spin, Avatar } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import c from "./ImageMessage.module.scss";
import { MoreDotsSvg } from "../../../../../../../../shared/assets/svg/SvgProvider";
import { motion } from "framer-motion";

import React from "react";
const items = [
  {
    label: "delete message",
    key: "delete",
    danger: true,
  },
];

type MessageProps = {
  message: Message;
  userId: string;
  deleteMessage: (message: Message) => void;
};

const ImageMessage = (
  { message, userId, deleteMessage }: MessageProps,
  ref: any
) => {
  const menuOnClick = ({ key }: { key: string }) => {
    switch (key) {
      case "delete":
        deleteMessage(message);
    }
  };
  const isSender = message.sender._id === userId;
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
        layout: {},
      }}
      style={{
        originX: isSender ? 1 : 0,
      }}
      className={
        c.ImageMessage +
        (isSender ? ` ${c.SelfSent}` : "") +
        /*  (message.temporary ? " " + c.Temporary : "") + */
        (message.error ? " " + c.Error : "")
      }
    >
      {!isSender && (
        <Avatar src={message.sender.profile_picture}>
          {message.sender.username[0]}
        </Avatar>
      )}
      <div className={c.MessageHolder}>
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

        <Spin
          indicator={
            <LoadingOutlined
              style={{
                color: "var(--primary-soft)",
              }}
            />
          }
          spinning={message.temporary ? true : false}
        >
          <Image src={message.content} />
        </Spin>
      </div>
    </motion.div>
  );
};

export default React.forwardRef(ImageMessage);
