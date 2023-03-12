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
import { sendImage, sendTextMessage } from "../../../../../../client/ApiClient";

const InputHandler = ({
  sendAllowed,

  conversationId,
}) => {
  const [message, setMessage] = useState("");

  const fileInput = useRef();
  const textInput = useRef();
  const userData = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();

  const sendMessage = () => {
    if (!sendAllowed) return;

    const readyMessage = message.trim();
    if (!readyMessage) return;
    const generatedId = Math.random() * 10;

    const senderInfo = {
      _id: userData.userId,
      username: userData.username,
      profile_picture: userData.profile_picture,
    };

    sendTextMessage(readyMessage, conversationId, userData.access_token)
      .then((res) => {
        const newMessage = { ...res.data, sender: senderInfo };
        dispatch(
          ChatActions.emit({
            event: "send message",
            data: newMessage,
          })
        );
        dispatch(
          ChatActions.replaceMessage({
            conversation_id: conversationId,
            id: generatedId,
            newMessage: newMessage,
          })
        );
      })
      .catch((err) => {
        console.log("send message error", err);
        dispatch(
          ChatActions.deleteMessage({
            conversation_id: conversationId,
            id: generatedId,
          })
        );
      });

    const tempMessage = {
      _id: generatedId,
      sender: senderInfo,
      message: readyMessage,
      content_type: "text",
      conversation: conversationId,
      sent_date: Date.now(),
      temporary: true,
    };

    dispatch(
      ChatActions.addMessage({
        conversation_id: conversationId,
        newMessage: tempMessage,
      })
    );

    setMessage("");
  };
  const sendFile = (file, value) => {
    const userId = userData.userId;

    const generatedId = Math.random() * 10;

    const data = new FormData();
    data.append("file", file);

    const senderInfo = {
      _id: userData.userId,
      username: userData.username,
      profile_picture: userData.profile_picture,
    };

    sendImage(data, conversationId, userData.access_token)
      .then((res) => {
        /* chatSocket.emit("send message", res.data); */
        const newMessage = { ...res.data, sender: senderInfo };
        dispatch(
          ChatActions.emit({
            event: "send message",
            data: newMessage,
          })
        );
        dispatch(
          ChatActions.replaceMessage({
            conversation_id: conversationId,
            id: generatedId,
            newMessage: newMessage,
          })
        );
      })
      .catch((err) => {
        dispatch(
          ChatActions.deleteMessage({
            conversation_id: conversationId,
            id: generatedId,
          })
        );
      });

    const message = {
      _id: generatedId,
      sender: senderInfo,
      content: URL.createObjectURL(file),
      conversation: conversationId,
      content_type: "image",
      sent_date: Date.now(),
      temporary: true,
    };

    dispatch(
      ChatActions.addMessage({
        conversation_id: conversationId,
        newMessage: message,
      })
    );
  };

  return (
    <div className={classes.InputHandler}>
      <div className={classes.InputHolder}>
        <input
          type="file"
          ref={fileInput}
          accept="image/png, image/gif, image/jpeg"
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
          ref={textInput}
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
                textInput.current.focus();
              }}
            />
          }
          trigger={"click"} /* open={isPickerVisible} */
        >
          <MoodSvg />
        </Popover>
        <VoiceRecorder conversationId={conversationId} />
        <div
          className={classes.Sender}
          onClick={() => {
            sendMessage();
            textInput.current.focus();
          }}
        >
          <SendArrowSvg />
        </div>
      </div>
    </div>
  );
};

export default InputHandler;
