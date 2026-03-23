import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Button, Empty, Result, Spin } from "antd";
import { useMemo, useState } from "react";

import ContactRequest from "./components/ContactRequest/ContactRequest";
import c from "./NotificationDisplayer.module.scss";
import { getContactRequests } from "../../../../../../client/ApiClient";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../../../../../client/queryKeys";
import { useAppSelector } from "../../../../../../store/ReduxHooks";

type RequestFilter = "all" | "incoming" | "outgoing";
const EMPTY_REQUESTS: Request[] = [];

const NotificationDisplayer = () => {
  const [requestHolder] = useAutoAnimate();
  const [selectedFilter, setSelectedFilter] = useState<RequestFilter>("all");
  const userData = useAppSelector((state) => state.auth.userData);

  const requestsQuery = useQuery({
    queryKey: queryKeys.requests,
    queryFn: async () => {
      const res = await getContactRequests();
      return res.data as Request[];
    },
  });

  const requests = requestsQuery.data ?? EMPTY_REQUESTS;

  const filteredRequests = useMemo(() => {
    if (!userData?.userId) return requests;

    switch (selectedFilter) {
      case "incoming":
        return requests.filter(
          (request) => request.requester._id !== userData.userId,
        );
      case "outgoing":
        return requests.filter(
          (request) => request.requester._id === userData.userId,
        );
      default:
        return requests;
    }
  }, [requests, selectedFilter, userData?.userId]);

  return (
    <div className={c.NotificationDisplayer}>
      <div className={c.FilterRow}>
        <Button
          className={selectedFilter === "all" ? c.ActiveFilter : c.FilterButton}
          type={selectedFilter === "all" ? "primary" : "default"}
          onClick={() => setSelectedFilter("all")}
        >
          All
        </Button>
        <Button
          className={
            selectedFilter === "incoming" ? c.ActiveFilter : c.FilterButton
          }
          type={selectedFilter === "incoming" ? "primary" : "default"}
          onClick={() => setSelectedFilter("incoming")}
        >
          Incoming
        </Button>
        <Button
          className={
            selectedFilter === "outgoing" ? c.ActiveFilter : c.FilterButton
          }
          type={selectedFilter === "outgoing" ? "primary" : "default"}
          onClick={() => setSelectedFilter("outgoing")}
        >
          Outgoing
        </Button>
      </div>

      <div className={c.NotificationFeed} ref={requestHolder}>
        {requestsQuery.isError ? (
          <Result
            status="error"
            title="Could not load notifications"
            icon={null}
            subTitle="Please check your connection and retry."
            extra={[
              <Button
                key="retry-notifications"
                className={c.RetryButton}
                onClick={() => requestsQuery.refetch()}
              >
                Retry
              </Button>,
            ]}
          />
        ) : null}

        {!requestsQuery.isLoading &&
        !requestsQuery.isError &&
        filteredRequests.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              selectedFilter === "all"
                ? "No notifications yet"
                : `No ${selectedFilter} notifications`
            }
          />
        ) : null}

        {filteredRequests.map((requestData) => {
          return (
            <ContactRequest key={requestData._id} requestData={requestData} />
          );
        })}
      </div>
    </div>
  );
};

export default NotificationDisplayer;
