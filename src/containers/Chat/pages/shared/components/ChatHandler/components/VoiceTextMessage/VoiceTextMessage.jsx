import { useEffect, useRef, useState } from "react";
import c from "./VoiceTextMessage.module.scss";

import { LoadingOutlined } from "@ant-design/icons";
import {
  PlayCircleSvg,
  PauseCircleSvg,
  MoreDotsSvg,
} from "../../../../../../../../shared/assets/svg/SvgProvider";
import { Dropdown, Slider, Spin, Avatar } from "antd";

function formatTime(time) {
  const secs = `${parseInt(`${time % 60}`)}`.padStart(2, "0");
  const mins = `${parseInt(`${(time / 60) % 60}`)}`;

  return `${mins}:${secs}`;
}

const formatDate = (date) => {
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

const VoiceTextMessage = ({ message, userId, deleteMessage }) => {
  /* const audioContext = useRef(new AudioContext());
  const track = useRef(); */
  const audio = useRef();
  const sentDate = new Date(message.sent_date);

  const [metaDataConfig, setMetaDataConfig] = useState({
    currentTiming: 0,
    full_duration: 100,
    loaded: false,
  });

  const [isAllSet, setIsAllSet] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const menuOnClick = ({ key }) => {
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
      await audio.current.pause();
    } else {
      await audio.current.play();
    }
  }
  const isSender = userId === message.sender._id;
  return (
    <div
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
            audio.current.currentTime = value;
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
        onLoadedMetadata={async (e) => {
          if (e.target.duration === Infinity) {
            e.target.currentTime = 1e101;
            e.target.volume = 0;
            await e.target.play();
          }
          setMetaDataConfig({
            ...metaDataConfig,
            full_duration: e.target.duration,
            loaded: true,
          });
        }}
        onTimeUpdate={(e) => {
          setMetaDataConfig({
            currentTiming: e.target.currentTime,
            loaded: true,
            full_duration: e.target.duration,
          });
        }}
        onPause={() => {
          setIsPlaying(false);
        }}
        onPlay={() => {
          setIsPlaying(true);
        }}
        onEnded={async (e) => {
          await e.target.pause();
          if (e.target.duration !== 0) e.target.currentTime = 0;
          e.target.volume = 1;
        }}
      />
    </div>
  );
};

export default VoiceTextMessage;
