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
import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";
import { ChatActions } from "../../../../../../store/slices/ChatSlice";
import { Popover } from "antd";
import EmojiPicker from "emoji-picker-react";
import VoiceRecorder from "./components/VoiceRecorder/VoiceRecorder";

const InputHandler = ({ setMessages, sendAllowed }) => {
  const [message, setMessage] = useState("");
  const pathParams = useParams();

  const { id } = useParams();
  const fileInput = useRef();
  const userData = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();
  const sendMessage = () => {
    if (!sendAllowed) return;
    const userId = userData.userId;
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
            authorization: "Bearer " + userData.access_token,
          },
        }
      )
      .then((res) => {
        dispatch(
          ChatActions.emit({
            event: "send message",
            data: res.data,
          })
        );

        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          const index = newMessages.findIndex((message) => {
            return message._id === generatedId;
          });
          if (index < 0) return prevMessages;
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
        content_type: "text",
        conversation: id,
        temporary: true,
      };
      message.temporary = true;
      const newMessages = [...prevMessages, message];
      return newMessages;
    });
    setMessage("");
  };
  const sendFile = (file, value) => {
    const userId = userData.userId;

    const generatedId = Math.random() * 10;

    const data = new FormData();
    data.append("file", file);

    axios
      .post(
        "api/messagerie/image/" + id,

        data,
        {
          headers: {
            authorization: "Bearer " + userData.access_token,
          },
        }
      )
      .then((res) => {
        /* chatSocket.emit("send message", res.data); */
        dispatch(
          ChatActions.emit({
            event: "send message",
            data: res.data,
          })
        );
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          const index = newMessages.findIndex((message) => {
            return message._id === generatedId;
          });
          res.data.content = newMessages[index].content;
          newMessages[index] = res.data;

          return newMessages;
        });
      })
      .catch((err) => {
        console.log(err);
      });

    setMessages((prevMessages) => {
      const message = {
        _id: generatedId,
        sender: userId,
        content: URL.createObjectURL(file),
        conversation: id,
        content_type: "image",
        temporary: true,
      };
      message.temporary = true;
      const newMessages = [...prevMessages, message];
      return newMessages;
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
            sendFile(e.target.files[0], e.target.value);
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

        <Popover
          content={
            <EmojiPicker
              lazyLoadEmojis={true}
              searchDisabled
              skinTonesDisabled
              previewConfig={{
                showPreview: false,
              }}
              emojiStyle="facebook"
              onEmojiClick={(emoji) => {
                setMessage((prevMassage) => {
                  return prevMassage + emoji.emoji;
                });
              }}
            />
          }
          trigger={"click"} /* open={isPickerVisible} */
        >
          <MoodSvg />
        </Popover>
        <VoiceRecorder setMessages={setMessages} />
        <div className={classes.Sender} onClick={sendMessage}>
          <SendArrowSvg />
        </div>
      </div>
    </div>
  );
};

export default InputHandler;
