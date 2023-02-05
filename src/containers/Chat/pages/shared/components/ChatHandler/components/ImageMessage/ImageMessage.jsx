import { Dropdown, Image, Spin, Avatar } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import c from "./ImageMessage.module.scss";
import { MoreDotsSvg } from "../../../../../../../../shared/assets/svg/SvgProvider";

const items = [
  {
    label: "delete message",
    key: "delete",
    danger: true,
  },
];

const ImageMessage = ({ message, userId, deleteMessage }) => {
  const menuOnClick = ({ key }) => {
    switch (key) {
      case "delete":
        deleteMessage(message);
    }
  };
  const isSender = message.sender._id === userId;
  return (
    <div
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
    </div>
  );
};

export default ImageMessage;
