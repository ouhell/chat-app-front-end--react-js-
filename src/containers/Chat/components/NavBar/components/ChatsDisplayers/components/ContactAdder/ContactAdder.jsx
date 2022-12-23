import { Input, Modal, Button, Avatar } from "antd";
import axios from "axios";
import { useState } from "react";
import c from "./ContactAdder.module.scss";

const ContactAdder = ({ open, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState([]);
  const [searchtext, setSearchtext] = useState("");
  const [candidateState, setCandidateState] = useState({});
  const fetchCandidates = () => {
    if (isLoading) return;
    setIsLoading(true);

    axios
      .get("/api/userapi/request/candidates?search=" + searchtext.trim(), {
        headers: {
          authorization:
            "Bearer " +
            JSON.parse(localStorage.getItem("userData")).access_token,
        },
      })
      .then((res) => {
        console.log("cadidate data : ", res.data);
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
        console.log("send request res :", res.data);
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
        console.log("sending request error :", err);

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
    console.log("canceling ", id);
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
          authorization:
            "Bearer " +
            JSON.parse(localStorage.getItem("userData")).access_token,
        },
      })
      .then((res) => {
        console.log("cancel request res :", res.data);
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
      <div className={c.Content}>
        <div className={c.Title}>Add Contact</div>
        <Input.Search
          placeholder="search username / personal name"
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
            }, 1000);
          }}
          className={c.SearchBar}
          loading={isLoading}
          value={searchtext}
          onChange={(e) => {
            if (e.target.value.length > 40) return;
            setSearchtext(e.target.value);
          }}
          onSearch={fetchCandidates}
        />
        <div className={c.Candidates}>
          {data.map((cand, index) => {
            let buttonLoading = false;
            let isCancelLoading = false;
            let isSent = false;

            if (candidateState[cand._id]) {
              buttonLoading = candidateState[cand._id].sendLoading;
              isSent = candidateState[cand._id].sent;
              isCancelLoading = candidateState[cand._id].isCancelLoading;
            }

            return (
              <div className={c.Candidate} key={cand._id}>
                <Avatar src={cand.profile_picture}>{cand.username[0]}</Avatar>
                <div className={c.NameHolder}>
                  <div className={c.UserName}>{cand.username}</div>
                  <div className={c.PersonalName}>{cand.personal_name}</div>
                </div>
                <div className={c.ActionHolder}>
                  {!isCancelLoading ? (
                    <Button
                      type={isSent ? "ghost" : "default"}
                      className={isSent ? c.SentButton : c.ActionButton}
                      onClick={() => {
                        if (isSent) return;
                        sendRequest(cand._id);
                      }}
                      loading={buttonLoading}
                    >
                      {isSent ? "Sent!" : "Send Request"}
                    </Button>
                  ) : null}
                  {isSent ? (
                    <Button
                      danger
                      type="dashed"
                      style={{
                        fontSize: "0.9rem",
                      }}
                      loading={isCancelLoading}
                      onClick={() => {
                        cancelRequest(cand._id);
                      }}
                    >
                      Cancel
                    </Button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

export default ContactAdder;
