import { Avatar, Dropdown } from "antd";
import { MoreDotsSvg } from "../../../../../../../../shared/assets/svg/SvgProvider";
import c from "./TextMessage.module.scss";

const formatDate = (date) => {
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

const TextMessage = ({ message, userId, deleteMessage }) => {
  const sentDate = new Date(message.sent_date);

  const menuOnClick = ({ key }) => {
    switch (key) {
      case "delete":
        deleteMessage(message);
    }
  };

  const isSender = userId === message.sender._id;

  return (
    <div
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
    </div>
  );
};

export default TextMessage;
