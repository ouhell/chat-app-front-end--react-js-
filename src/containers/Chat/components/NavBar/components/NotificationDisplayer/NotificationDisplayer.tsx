import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Avatar, Button, Collapse, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import BasicSpinner from "../../../../../../shared/components/BasicSpinner/BasicSpinner";
import { ChatActions } from "../../../../../../store/slices/ChatSlice";
import ContactRequest from "./components/ContactRequest/ContactRequest";
import c from "./NotificationDisplayer.module.scss";
import { getContactRequests } from "../../../../../../client/ApiClient";
import { useAppSelector } from "../../../../../../store/ReduxHooks";

const NotificationDisplayer = () => {
  let { loaded, data: requests } = useAppSelector(
    (state) => state.chat.requests
  );

  const [isLoading, setIsLoading] = useState(false);

  const userData = useAppSelector((state) => state.auth.userData);
  const dispatch = useDispatch();

  const [requestHolder] = useAutoAnimate();

  const fetchNotifications = () => {
    if (isLoading) return;
    setIsLoading(true);

    getContactRequests(userData?.access_token ?? "undefined")
      .then((res) => {
        dispatch(ChatActions.setRequests(res.data));
        dispatch(
          ChatActions.on({
            event: "receive request",
            callback: (request) => {
              dispatch(ChatActions.addRequest(request));
            },
          })
        );
        dispatch(
          ChatActions.on({
            event: "canceled request",
            callback: (requestId) => {
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

  const requestNumber = !isLoading ? ` (${requests.length})` : "";
  return (
    <div className={c.NotificationDisplayer}>
      <Collapse
        className={c.Collapse}
        bordered
        style={{
          backgroundColor: "#f8fafc",
          border: "none",
        }}
      >
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
                  removeRequest={(id: string) => {}}
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
