import { Document, Page } from "react-pdf";
import { useRef, useState } from "react";
import { useEffect } from "react";
import pdf from "../../../../shared/assets/pdf/chap4.pdf";
import axios from "axios";
import lilN from "../../../../shared/assets/audio/liln.mp3";
import VoiceTextMessage from "../PublicConversation/components/ChatHandler/components/VoiceTextMessage/VoiceTextMessage";
import { useSelector } from "react-redux";
const PDFReader = () => {
  const [mediaRecorder, setMediaRecorder] = useState();
  const [isRocordReady, setIsRecordReady] = useState(false);
  const [isRocording, setisRecording] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const audioChunks = useRef([]);

  return (
    <div
      style={{
        height: "100%",
      }}
    ></div>
  );
};

export default PDFReader;
