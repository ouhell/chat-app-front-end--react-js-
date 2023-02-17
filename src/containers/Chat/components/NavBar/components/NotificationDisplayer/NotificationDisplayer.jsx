import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Avatar, Button, Collapse, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import BasicSpinner from "../../../../../../shared/components/BasicSpinner/BasicSpinner";
import { ChatActions } from "../../../../../../store/slices/ChatSlice";
import ContactRequest from "./components/ContactRequest/ContactRequest";
import c from "./NotificationDisplayer.module.scss";

const NotificationDisplayer = () => {
  const { loaded, data: requests } = useSelector(
    (state) => state.chat.requests
  );

  const [isLoading, setIsLoading] = useState(false);

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
        dispatch(ChatActions.setRequests(res.data));
        dispatch(
          ChatActions.on({
            event: "receive request",
            callbacl: (request) => {
              dispatch(ChatActions.addRequest(request));
            },
          })
        );
        dispatch(
          ChatActions.on({
            event: "canceled request",
            callbacl: (requestId) => {
              dispatch(ChatActions.removeRequest(requestId));
            },
          })
        );
      })
      .catch((err) => {
        console.log("fetch request error :", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (!loaded) fetchNotifications();
  }, []);

  const { Panel } = Collapse;
  const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

  const requestNumber = !isLoading ? ` (${requests.length})` : "";
  return (
    <div className={c.NotificationDisplayer}>
      <Collapse className={c.Collapse} bordered>
        <Panel
          header={"Requests" + requestNumber}
          key="requests"
          extra={
            <Spin
              indicator={
                <LoadingOutlined
                  style={{
                    color: "var(--primary-blank)",
                  }}
                />
              }
              spinning={isLoading}
            />
          }
        >
          <div className={c.RequestList} ref={requestHolder}>
            {requests.map((requestData) => {
              return (
                <ContactRequest
                  key={requestData._id}
                  requestData={requestData}
                  userData={userData}
                />
              );
            })}
          </div>
        </Panel>
      </Collapse>
    </div>
  );
};

export default NotificationDisplayer;
