import { Avatar, Button, Spin } from "antd";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import BasicSpinner from "../../../../../../shared/components/BasicSpinner/BasicSpinner";
import c from "./NotificationDisplayer.module.scss";

const NotificationDisplayer = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [requestStates, setRequestStates] = useState({});
  const userData = useSelector((state) => state.auth.userData);
  const userId = JSON.parse(localStorage.getItem("userData")).userId;

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
      })
      .catch((err) => {
        console.log("accept reqq err", err);
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
      <div className={c.RequestList}>
        <BasicSpinner spinning={isLoading} />

        {requests.map((req) => {
          const userIsSender = req.requester._id === userId;
          const opponent = userIsSender ? req.destinator : req.requester;
          let isCancelLoading = false;
          let isAcceptLoading = false;
          if (requestStates[req._id]) {
            isCancelLoading = requestStates[req._id].isCancelLoading;
            isAcceptLoading = requestStates[req._id].isAcceptLoading;
          }
          return (
            <div className={c.Request} key={req._id}>
              <Avatar src={opponent.profile_picture}>
                {opponent.username[0]}
              </Avatar>
              <div className={c.IdentityHolder}>
                <div className={c.Username}>{opponent.username}</div>
                <div className={c.Personalname}>{opponent.personal_name}</div>
              </div>
              <div className={c.ActionHolder}>
                {!userIsSender && !isCancelLoading ? (
                  <Button
                    disabled={isCancelLoading}
                    type="default"
                    className={c.AcceptButton}
                    onClick={() => acceptRequest(req._id)}
                    loading={isAcceptLoading}
                  >
                    Accept
                  </Button>
                ) : null}
                <Button
                  className={c.CancelButton}
                  disabled={isAcceptLoading}
                  danger
                  type="dashed"
                  onClick={() => cancelRequest(req._id)}
                  loading={isCancelLoading}
                >
                  {userIsSender ? "Cancel" : "Refuse"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationDisplayer;
