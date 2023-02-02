import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Input, Modal, Button, Avatar } from "antd";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import Candidate from "./components/Candidate/Candidate";
import c from "./ContactAdder.module.scss";

const ContactAdder = ({ open, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const userData = useSelector((state) => state.auth.userData);
  const [data, setData] = useState([]);
  const [searchtext, setSearchtext] = useState("");
  const [candidateState, setCandidateState] = useState({});
  const [candidateHolder] = useAutoAnimate();

  useEffect(() => {
    if (open) fetchCandidates();
  }, [open]);

  const fetchCandidates = () => {
    if (isLoading) return;
    setIsLoading(true);

    axios
      .get("/api/userapi/request/candidates?search=" + searchtext.trim(), {
        headers: {
          authorization: "Bearer " + userData.access_token,
        },
      })
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log("candidate error : ", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const sendRequest = (id) => {
    setCandidateState((prevState) => {
      const newState = { ...prevState };
      newState[id] = {
        sendLoading: true,
      };
      return newState;
    });

    axios
      .post(
        "/api/userapi/request",
        {
          destinator: id,
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
        setCandidateState((prevState) => {
          const newState = { ...prevState };
          newState[id] = {
            sendLoading: false,
            sent: true,
            request: res.data._id,
          };
          return newState;
        });
      })
      .catch((err) => {
        setCandidateState((prevState) => {
          const newState = { ...prevState };
          newState[id] = {
            sendLoading: false,
          };
          return newState;
        });
      });

    /*  setCandidateState((prevState) => {
      const newState = { ...candidateState };
      newState[id] = "loading";
      return newState;
    });
    setTimeout(() => {
      setCandidateState((prevState) => {
        const newState = { ...candidateState };
        newState[id] = "sent";
        return newState;
      });
    }, 3000); */
  };
  const cancelRequest = (id) => {
    if (!candidateState[id]) return;
    if (!candidateState[id].request) return;

    setCandidateState((prevState) => {
      if (prevState[id]) {
        if (prevState[id].isCancelLoading) return prevState;
      }
      const newState = { ...prevState };
      newState[id] = {
        ...newState[id],
        isCancelLoading: true,
      };
      return newState;
    });

    axios
      .delete("api/userapi/request/" + candidateState[id].request, {
        headers: {
          authorization: "Bearer " + userData.access_token,
        },
      })
      .then((res) => {
        setCandidateState((prevState) => {
          const newState = { ...prevState };
          newState[id] = {
            request: null,
            sent: false,
            isCancelLoading: false,
          };
          return newState;
        });
      })
      .catch((err) => {
        console.log("cancel request err :", err);
        if (err.response) {
          if (err.response.data) {
            if (err.response.data.servedError) {
              if (err.response.data.code === 404) {
                setCandidateState((prevState) => {
                  const newState = { ...prevState };
                  newState[id] = {
                    request: null,
                    sent: false,
                    isCancelLoading: false,
                  };
                  return newState;
                });
              }
            }
          }
        }
        setCandidateState((prevState) => {
          const newState = { ...prevState };
          newState[id] = {
            ...newState[id],
            isCancelLoading: false,
          };
          return newState;
        });
      });
  };
  return (
    <Modal
      className={c.ContactAdder}
      open={open}
      onCancel={onCancel}
      closable={false}
      footer={[
        <Button key="back" onClick={onCancel} className={c.CancelButton}>
          Return
        </Button>,
      ]}
      afterClose={() => {
        setCandidateState({});
        setData([]);
        setIsLoading(false);
        setSearchtext("");
      }}
    >
      <div
        className={c.Content}
        onTouchStart={(e) => {
          e.stopPropagation();
        }}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        <div className={c.Title}>Add Contact</div>
        <Input.Search
          placeholder="search username / personal name"
          className={c.SearchBar}
          loading={isLoading}
          value={searchtext}
          onChange={(e) => {
            if (e.target.value.length > 40) return;
            setSearchtext(e.target.value);
          }}
          onSearch={fetchCandidates}
        />
        <div className={c.Candidates} ref={candidateHolder}>
          {data.map((candInfo, index) => {
            return (
              <Candidate
                cancelRequest={cancelRequest}
                sendRequest={sendRequest}
                candInfo={candInfo}
                candidateState={candidateState}
                key={candInfo._id}
              />
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

export default ContactAdder;
