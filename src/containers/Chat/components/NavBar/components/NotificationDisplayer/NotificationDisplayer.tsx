import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Collapse, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import ContactRequest from "./components/ContactRequest/ContactRequest";
import c from "./NotificationDisplayer.module.scss";
import { getContactRequests } from "../../../../../../client/ApiClient";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../../../../../client/queryKeys";

const NotificationDisplayer = () => {
  const [requestHolder] = useAutoAnimate();
  const requestsQuery = useQuery({
    queryKey: queryKeys.requests,
    queryFn: async () => {
      const res = await getContactRequests();
      return res.data as Request[];
    },
  });
  const requests = requestsQuery.data ?? [];

  const { Panel } = Collapse;

  const requestNumber = !requestsQuery.isLoading ? ` (${requests.length})` : "";
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
              spinning={requestsQuery.isLoading}
            />
          }
        >
          <div className={c.RequestList} ref={requestHolder}>
            {requests.map((requestData) => {
              return (
                <ContactRequest
                  key={requestData._id}
                  requestData={requestData}
                  removeRequest={() => {
                    console.log("remove");
                  }}
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
