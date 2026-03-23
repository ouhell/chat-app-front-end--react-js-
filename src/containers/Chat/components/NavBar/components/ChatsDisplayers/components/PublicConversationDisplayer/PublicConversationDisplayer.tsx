import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Result, Button, Empty } from "antd";

import { useState } from "react";
import { getPublicConversations } from "../../../../../../../../client/ApiClient";
import { SearchSvg } from "../../../../../../../../shared/assets/svg/SvgProvider";
import BasicSpinner from "../../../../../../../../shared/components/BasicSpinner/BasicSpinner";
import Conversation from "./Conversation/Conversation";
import c from "./PublicConversationDisplayer.module.scss";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../../../../../../../client/queryKeys";

const PublicConversationDisplayer = () => {
  const [searchtext, setSearchtext] = useState("");
  const publicConversationQuery = useQuery({
    queryKey: queryKeys.publicConversations,
    queryFn: async () => {
      const res = await getPublicConversations();
      return res.data as Conversation[];
    },
  });
  const publicConversations = publicConversationQuery.data ?? [];

  const [animationParent] = useAutoAnimate();

  function applySearch() {
    return publicConversations.filter((conv) =>
      conv.name.includes(searchtext.toLowerCase().trim()),
    );
  }

  const filteredConversations = applySearch();

  return (
    <div className={c.PublicConversationDisplayer}>
      <div className={c.SearchBarContainer}>
        <div className={c.SearchBarHolder}>
          <SearchSvg />
          <input
            placeholder="Search public chats"
            onChange={(e) => {
              if (e.target.value.length > 25) return;
              setSearchtext(e.target.value);
            }}
            value={searchtext}
            className={c.SearchBar}
          ></input>
        </div>
      </div>
      <BasicSpinner size="default" spinning={publicConversationQuery.isLoading} />
      {publicConversationQuery.isError ? (
        <Result
          status={"error"}
          title="Error"
          icon={null}
          subTitle="couldn' t load public chats"
          extra={[
            <Button
              className={c.Button}
              onClick={() => publicConversationQuery.refetch()}
              key={"public conv refetch"}
            >
              retry
            </Button>,
          ]}
        />
      ) : null}
      {!publicConversationQuery.isLoading &&
      !publicConversationQuery.isError &&
      publicConversations.length === 0 ? (
        <Empty description="No public chats available" />
      ) : null}
      {!publicConversationQuery.isLoading &&
      !publicConversationQuery.isError &&
      publicConversations.length > 0 &&
      filteredConversations.length === 0 ? (
        <Empty description="No matching public chats" />
      ) : null}
      <div className={c.Conversations} ref={animationParent}>
        {filteredConversations.map((conv) => {
          return <Conversation data={conv} key={conv._id} />;
        })}
      </div>
    </div>
  );
};
export default PublicConversationDisplayer;
