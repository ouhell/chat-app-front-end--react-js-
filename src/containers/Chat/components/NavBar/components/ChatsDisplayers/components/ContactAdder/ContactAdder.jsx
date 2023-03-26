import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Input, Modal, Button, Avatar } from "antd";

import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addContactRequest,
  deleteContactRequest,
  getContactCandidates,
} from "../../../../../../../../client/ApiClient";
import { ChatActions } from "../../../../../../../../store/slices/ChatSlice";
import Candidate from "./components/Candidate/Candidate";
import c from "./ContactAdder.module.scss";

const ContactAdder = ({ open, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const userData = useSelector((state) => state.auth.userData);
  const [data, setData] = useState([]);
  const [searchtext, setSearchtext] = useState("");
  const [candidateState, setCandidateState] = useState({});

  const dispatch = useDispatch();

  const [candidateHolder] = useAutoAnimate();

  useEffect(() => {
    if (open) fetchCandidates();
  }, [open]);

  const fetchCandidates = () => {
    if (isLoading) return;
    setIsLoading(true);

    getContactCandidates(userData.access_token, searchtext)
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

    addContactRequest(userData.access_token, id)
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
        dispatch(ChatActions.addRequest(res.data));
        dispatch(
          ChatActions.emit({
            event: "send request",
            data: res.data,
          })
        );
      })
      .catch((err) => {
        console.log("add request error :", err);
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

    deleteContactRequest(userData.access_token, candidateState[id].request)
      .then((res) => {
        dispatch(ChatActions.removeRequest(candidateState[id].request));

        dispatch(
          ChatActions.emit({
            event: "cancel request",
            data: res.data,
          })
        );
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
        console.log("cancel request error", err);
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
