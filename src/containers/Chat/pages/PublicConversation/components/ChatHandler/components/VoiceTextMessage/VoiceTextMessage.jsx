import { useEffect, useRef, useState } from "react";
import c from "./VoiceTextMessage.module.scss";
import song from "../../../../../../../../shared/assets/audio/liln.mp3";
import { LoadingOutlined } from "@ant-design/icons";
import {
  PlayCircleSvg,
  PauseCircleSvg,
} from "../../../../../../../../shared/assets/svg/SvgProvider";
import { Button, Spin } from "antd";

function formatTime(time) {
  const secs = `${parseInt(`${time % 60}`)}`.padStart(2, "0");
  const mins = `${parseInt(`${(time / 60) % 60}`)}`;

  return `${mins}:${secs}`;
}

const VoiceTextMessage = ({ message, userId }) => {
  /* const audioContext = useRef(new AudioContext());
  const track = useRef(); */
  const audio = useRef();

  const [metaDataConfig, setMetaDataConfig] = useState({
    currentTiming: 0,
    full_duration: 100,
    loaded: false,
  });

  const [isAllSet, setIsAllSet] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    /* console.log("audio", audio);
    track.current = audioContext.current.createMediaElementSource(
      audio.current
    );

    track.current.connect(audioContext.current.destination); */
  }, []);

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

  return (
    <div
      className={
        c.VoiceTextMessage +
        (userId === message.sender ? ` ${c.SelfSent}` : "") +
        (message.temporary ? " " + c.Temporary : "") +
        (message.error ? " " + c.Error : "")
      }
    >
      <audio
        style={{
          display: "none",
        }}
        ref={audio}
        src={message.content}
        onLoadedMetadata={async (e) => {
          console.log(e);

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
          e.target.currentTime = 0;
          e.target.volume = 1;
        }}
      />

      <span onClick={togglePlay}>
        {isPlaying ? <PauseCircleSvg /> : <PlayCircleSvg />}
      </span>

      <input
        style={{
          height: "100%",
          width: "100%",
        }}
        type={"range"}
        max={metaDataConfig.full_duration}
        value={metaDataConfig.currentTiming}
        onInput={(e) => {
          console.log("chosen val :", e.target.value);
          audio.current.currentTime = e.target.value;
        }}
      />
      <span>
        {metaDataConfig.loaded
          ? formatTime(
              metaDataConfig.full_duration - metaDataConfig.currentTiming
            )
          : "00:00"}
      </span>
    </div>
  );
};

export default VoiceTextMessage;
