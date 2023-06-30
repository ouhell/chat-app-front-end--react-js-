import { forwardRef, useRef, useState } from "react";
import c from "./VoiceTextMessage.module.scss";

import {
  PlayCircleSvg,
  PauseCircleSvg,
  MoreDotsSvg,
} from "../../../../../../../../shared/assets/svg/SvgProvider";
import { Dropdown, Slider, Spin, Avatar } from "antd";
import { motion } from "framer-motion";
function formatTime(time: number) {
  if (Number.isNaN(time) || time === Infinity) return "00:00";
  const secs = `${parseInt(`${time % 60}`)}`.padStart(2, "0");
  const mins = `${parseInt(`${(time / 60) % 60}`)}`;

  return `${mins}:${secs}`;
}

const formatDate = (date: Date) => {
  const hours = (date.getHours() + "").padStart(2, "0");
  const minutes = (date.getMinutes() + "").padStart(2, "0");

  return hours + ":" + minutes;
};

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
const VoiceTextMessage = (
  { message, userId, deleteMessage }: MessageProps,
  ref: any
) => {
  /* const audioContext = useRef(new AudioContext());
  const track = useRef(); */
  const audio = useRef<HTMLAudioElement>(null);
  const sentDate = new Date(message.sent_date);

  const [metaDataConfig, setMetaDataConfig] = useState({
    currentTiming: 0,
    full_duration: 100,
    loaded: false,
  });

  const [isPlaying, setIsPlaying] = useState(false);

  const menuOnClick = ({ key }: { key: string }) => {
    switch (key) {
      case "delete":
        deleteMessage(message);
    }
  };

  async function togglePlay() {
    /* if (audioContext.current.state === "suspended") {
      await audioContext.current.resume();
    } */

    if (isPlaying) {
      await audio.current?.pause();
    } else {
      await audio.current?.play();
    }
  }
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
        layout: {},
      }}
      style={{
        originX: isSender ? 1 : 0,
      }}
      className={
        c.VoiceTextMessage +
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

        <span
          onClick={togglePlay}
          style={{
            height: "max-content",
            display: "flex",
            alignItems: "center",
          }}
        >
          {isPlaying ? <PauseCircleSvg /> : <PlayCircleSvg />}
        </span>

        <Slider
          min={0}
          max={metaDataConfig.full_duration}
          onChange={(value) => {
            if (!metaDataConfig.loaded) return;
            if (audio.current) audio.current.currentTime = value;
          }}
          value={metaDataConfig.currentTiming}
          style={{
            width: "100%",
          }}
          handleStyle={{
            transform: "scale(0.8)",
          }}
          tooltip={{
            open: false,
          }}
        />
        <div className={c.Footer}>
          {message.temporary ? (
            <Spin
              className={c.Spinner}
              spinning
              size="small"
              style={{
                color: "var(--primary-soft)",
              }}
            />
          ) : metaDataConfig.loaded ? (
            formatTime(
              metaDataConfig.full_duration - metaDataConfig.currentTiming
            )
          ) : (
            "00:00"
          )}
        </div>
        <div className={c.SentDateHolder}>{formatDate(sentDate)}</div>
      </div>
      <audio
        style={{
          display: "none",
        }}
        ref={audio}
        src={message.content}
        onLoadedMetadata={async (e: React.ChangeEvent<HTMLAudioElement>) => {
          if (e.target.duration === Infinity) {
            setTimeout(() => {
              e.target.currentTime = 0;
              setMetaDataConfig({
                ...metaDataConfig,
                full_duration: e.target.duration,
                loaded: true,
              });
            }, 500);
          }

          setMetaDataConfig({
            ...metaDataConfig,
            full_duration: e.target.duration,
            loaded: true,
          });
        }}
        onTimeUpdate={(e: React.ChangeEvent<HTMLAudioElement>) => {
          setMetaDataConfig({
            ...metaDataConfig,
            currentTiming: e.target.currentTime,
            full_duration: e.target.duration,
          });
        }}
        onPause={() => {
          setIsPlaying(false);
        }}
        onPlay={() => {
          setIsPlaying(true);
        }}
        onEnded={async (e: React.ChangeEvent<HTMLAudioElement>) => {
          await e.target.pause();
          if (e.target.duration !== 0) e.target.currentTime = 0;
          e.target.volume = 1;
        }}
      />
    </motion.div>
  );
};

export default forwardRef(VoiceTextMessage);
