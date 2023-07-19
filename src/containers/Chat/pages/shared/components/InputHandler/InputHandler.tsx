import classes from "./InputHandler.module.scss";
import {
  MoodSvg,
  SendArrowSvg,
  AttatchmentSvg,
} from "../../../../../../shared/assets/svg/SvgProvider";
import { useState } from "react";

import { useDispatch } from "react-redux";
import { useRef } from "react";
import { ChatActions } from "../../../../../../store/slices/ChatSlice";
import { Popover } from "antd";
import EmojiPicker from "emoji-picker-react";
import VoiceRecorder from "./components/VoiceRecorder/VoiceRecorder";
import { sendImage, sendTextMessage } from "../../../../../../client/ApiClient";
import { useAppSelector } from "../../../../../../store/ReduxHooks";

const InputHandler = ({
  sendAllowed,

  conversationId,
}: {
  sendAllowed: boolean;
  conversationId: string;
}) => {
  const [message, setMessage] = useState("");

  const fileInput = useRef<HTMLInputElement>(null);
  const textInput = useRef<HTMLInputElement>(null);
  const userData = useAppSelector((state) => state.auth.userData);
  const dispatch = useDispatch();

  const sendMessage = () => {
    if (!sendAllowed) return;

    const readyMessage = message.trim();
    if (!readyMessage) return;
    const generatedId = Math.random() * 10 + "t";

    const senderInfo = {
      _id: userData?.userId,
      username: userData?.username,
      profile_picture: userData?.profile_picture,
    };

    sendTextMessage(
      readyMessage,
      conversationId,
      userData?.access_token ?? "undefined"
    )
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

    const tempMessage: Message = {
      _id: generatedId,
      sender: senderInfo,
      message: readyMessage,
      content_type: "text",
      conversation: conversationId,
      sent_date: new Date(),
      temporary: true,
      edited_date: undefined,
      content: "",
      hidden: false,
    };

    dispatch(
      ChatActions.addMessage({
        conversation_id: conversationId,
        newMessage: tempMessage,
      })
    );

    setMessage("");
  };
  const sendFile = (file: File) => {
    const generatedId = Math.random() * 10 + "t";

    const data = new FormData();
    data.append("file", file);

    const senderInfo = {
      _id: userData?.userId,
      username: userData?.username,
      profile_picture: userData?.profile_picture,
    };

    sendImage(data, conversationId, userData?.access_token ?? "undefined")
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
      .catch((_) => {
        dispatch(
          ChatActions.deleteMessage({
            conversation_id: conversationId,
            id: generatedId,
          })
        );
      });

    const message: Message = {
      _id: generatedId,
      sender: senderInfo,
      content: URL.createObjectURL(file),
      conversation: conversationId,
      content_type: "image",
      sent_date: new Date(),
      temporary: true,
      edited_date: undefined,
      hidden: false,
      message: "",
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
            sendFile(e.target.files?.[0] as File);
          }}
        />
        <AttatchmentSvg
          style={{
            rotate: "45deg",
          }}
          onClick={() => {
            fileInput.current?.click();
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
              // @ts-ignore
              emojiStyle="facebook"
              onEmojiClick={(emoji) => {
                setMessage((prevMassage) => {
                  return prevMassage + emoji.emoji;
                });
                textInput.current?.focus();
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
            textInput.current?.focus();
          }}
        >
          <SendArrowSvg />
        </div>
      </div>
    </div>
  );
};

export default InputHandler;
