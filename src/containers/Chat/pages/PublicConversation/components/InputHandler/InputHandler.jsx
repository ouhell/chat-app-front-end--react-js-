import classes from "./InputHandler.module.scss";
import {
  MicSvg,
  MoodSvg,
  SendArrowSvg,
  AttatchmentSvg,
} from "../../../../../../shared/assets/svg/SvgProvider";
import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useRef } from "react";

const InputHandler = ({ setMessages, sendAllowed }) => {
  const [message, setMessage] = useState("");
  const pathParams = useParams();
  const chatSocket = useSelector((state) => state.chatSocket);
  const { id } = useParams();
  const fileInput = useRef();

  const sendMessage = () => {
    if (!sendAllowed) return;
    const userId = JSON.parse(localStorage.getItem("userData")).userId;
    const readyMessage = message.trim();
    if (!readyMessage) return;
    const generatedId = Math.random() * 10;

    axios
      .post(
        "api/messagerie/messages",
        {
          message: readyMessage,
          conversation_id: pathParams.id,
        },
        {
          headers: {
            authorization:
              "Bearer " +
              JSON.parse(localStorage.getItem("userData")).access_token,
          },
        }
      )
      .then((res) => {
        chatSocket.emit("send message", res.data);
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          const index = newMessages.findIndex((message) => {
            return message._id === generatedId;
          });
          newMessages[index] = res.data;
          return newMessages;
        });
      })
      .catch((err) => console.log("err", err));

    setMessages((prevMessages) => {
      const message = {
        _id: generatedId,
        sender: userId,
        message: readyMessage,
        conversation: id,
        temporary: true,
      };
      message.temporary = true;
      const newMessages = [...prevMessages, message];
      return newMessages;
    });
    setMessage("");
  };
  const sendFile = (file) => {
    const data = new FormData();
    data.append("file", file);

    axios
      .post(
        "api/messagerie/file",

        data,
        {
          headers: {
            authorization:
              "Bearer " +
              JSON.parse(localStorage.getItem("userData")).access_token,
          },
        }
      )
      .then((res) => {
        console.log("response", res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className={classes.InputHandler}>
      <div className={classes.InputHolder}>
        <input
          type="file"
          ref={fileInput}
          style={{
            display: "none",
          }}
          onChange={(e) => {
            sendFile(e.target.files[0]);
          }}
        />
        <AttatchmentSvg
          style={{
            rotate: "45deg",
          }}
          onClick={() => {
            fileInput.current.click();
          }}
        />
        <input
          placeholder="Type a message here"
          autoCorrect="false"
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            sendMessage();
          }}
          value={message}
          onChange={(e) => {
            // if (e.target.value.length > 200) return;
            setMessage(e.target.value);
          }}
        />
        <MoodSvg />
        <MicSvg />
        <div className={classes.Sender} onClick={sendMessage}>
          <SendArrowSvg />
        </div>
      </div>
    </div>
  );
};

export default InputHandler;
