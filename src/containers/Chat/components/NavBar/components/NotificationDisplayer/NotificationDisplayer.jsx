import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Avatar, Button, Spin } from "antd";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import BasicSpinner from "../../../../../../shared/components/BasicSpinner/BasicSpinner";
import { ChatActions } from "../../../../../../store/slices/ChatSlice";
import ContactRequest from "./components/ContactRequest/ContactRequest";
import c from "./NotificationDisplayer.module.scss";

const NotificationDisplayer = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [requestStates, setRequestStates] = useState({});
  const userData = useSelector((state) => state.auth.userData);

  const dispatch = useDispatch();

  const [requestHolder] = useAutoAnimate();

  const fetchNotifications = () => {
    if (isLoading) return;
    setIsLoading(true);

    axios
      .get("/api/userapi/request", {
        headers: {
          authorization: "Bearer " + userData.access_token,
        },
      })
      .then((res) => {
        setRequests(res.data);
      })
      .catch((err) => {
        console.log("fetch request error :", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const cancelRequest = (id) => {
    if (
      requestStates[id] &&
      (requestStates[id].isCancelLoading || requestStates[id].isAcceptLoading)
    )
      return;

    setRequestStates((prevStates) => {
      const newStates = { ...prevStates };
      newStates[id] = {
        isCancelLoading: true,
      };
      return newStates;
    });

    axios
      .delete("api/userapi/request/" + id, {
        headers: {
          authorization: "Bearer " + userData.access_token,
        },
      })
      .then((res) => {
        removerequest(id);
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.data) {
            if (err.response.data.servedError) {
              if (err.response.data.code === 404) {
                removerequest(id);
                return;
              }
            }
          }
        }

        setRequestStates((prevState) => {
          const newState = { ...prevState };
          newState[id] = {
            ...newState[id],
            isCancelLoading: false,
          };
          return newState;
        });
      });
  };
  const acceptRequest = (id) => {
    if (
      requestStates[id] &&
      (requestStates[id].isCancelLoading || requestStates[id].isAcceptLoading)
    )
      return;

    setRequestStates((prevStates) => {
      const newStates = { ...prevStates };
      newStates[id] = {
        isAcceptLoading: true,
      };
      return newStates;
    });

    axios
      .post("api/userapi/user-contact/" + id, null, {
        headers: {
          authorization: "Bearer " + userData.access_token,
        },
      })
      .then((res) => {
        removerequest(id);
        const newContact = res.data.users.find(
          (user) => user._id !== userData.userId
        );
        if (newContact) {
          dispatch(
            ChatActions.addContact({
              newContact,
            })
          );
        }
      })
      .catch((err) => {
        console.log("accept req err", err);
        setRequestStates((prevState) => {
          const newState = { ...prevState };
          newState[id] = {
            ...newState[id],
            isAcceptLoading: false,
          };
          return newState;
        });
      });
  };

  function removerequest(id) {
    setRequests((prevRequests) => {
      const newRequests = [...prevRequests];
      const index = newRequests.findIndex((req) => req._id === id);
      if (index < 0) return prevRequests;
      newRequests.splice(index, 1);
      return newRequests;
    });
  }

  return (
    <div className={c.NotificationDisplayer}>
      <div className={c.RequestList} ref={requestHolder}>
        <BasicSpinner spinning={isLoading} />

        {requests.map((requestData) => {
          return (
            <ContactRequest
              key={requestData._id}
              requestData={requestData}
              requestStates={requestStates}
              acceptRequest={acceptRequest}
              cancelRequest={cancelRequest}
              userId={userData.userId}
            />
          );
        })}
      </div>
    </div>
  );
};

export default NotificationDisplayer;
