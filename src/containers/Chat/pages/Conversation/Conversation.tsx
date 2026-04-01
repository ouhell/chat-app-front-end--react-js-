import { useEffect, useMemo, useState } from "react";
import { Route, Routes, useParams } from "react-router-dom";
import { getConversation } from "../../../../client/ApiClient";
import { ChatActions } from "../../../../store/slices/ChatSlice";
import { motion } from "framer-motion";
import InputHandler from "../shared/components/InputHandler/InputHandler";
import PrivateConversation from "./components/PrivateConversation/PrivateConversation";
import PublicConversation from "./components/PublicConversation/PublicConversation";
import C from "./Conversation.module.scss";
import { pageAnimation } from "../shared/animation/animationHandler";
import GroupConversation from "./components/GroupConversation/GroupConversation";
import { useAppDispatch } from "../../../../store/ReduxHooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { queryKeys } from "../../../../client/queryKeys";
import { flattenConversationMessages } from "../../../../client/queryHelpers";
import AiChatBox from "../../components/AiChatBox/AiChatBox";
const Conversation = () => {
  const { conversationId = "undefined" } = useParams();
  const dispatch = useAppDispatch();
  const [showAiPanel, setShowAiPanel] = useState(false);
  const toggleAiPanel = () => setShowAiPanel((v) => !v);

  const conversationQuery = useInfiniteQuery({
    queryKey: queryKeys.conversation(conversationId),
    queryFn: async ({ pageParam = 0 }) => {
      const res = await getConversation(conversationId, {
        skip: pageParam,
      });
      return res.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.messages.isLastPage) return undefined;

      const loadedCount = allPages.reduce((total, page) => {
        return total + page.messages.data.length;
      }, 0);

      return loadedCount;
    },
  });

  const messages = useMemo(
    () => flattenConversationMessages(conversationQuery.data),
    [conversationQuery.data],
  );

  const fetchMessages = () => {
    if (conversationQuery.isError || !conversationQuery.data) {
      return conversationQuery.refetch();
    }
    if (
      conversationQuery.hasNextPage &&
      !conversationQuery.isFetchingNextPage
    ) {
      return conversationQuery.fetchNextPage();
    }
    return Promise.resolve();
  };

  useEffect(() => {
    dispatch(ChatActions.emit({ event: "chat", data: conversationId }));
  }, [conversationId, dispatch]);

  return (
    <motion.div {...pageAnimation} className={C.Conversation}>
      <Routes>
        <Route
          element={
            <PublicConversation
              data={messages}
              fetchMessages={fetchMessages}
              isError={conversationQuery.isError}
              isLoading={
                conversationQuery.isLoading ||
                conversationQuery.isFetchingNextPage
              }
              hasMore={!!conversationQuery.hasNextPage}
              onToggleAi={toggleAiPanel}
            />
          }
          path="/"
        />
        <Route
          element={
            <GroupConversation
              data={messages}
              fetchMessages={fetchMessages}
              isError={conversationQuery.isError}
              isLoading={
                conversationQuery.isLoading ||
                conversationQuery.isFetchingNextPage
              }
              hasMore={!!conversationQuery.hasNextPage}
              onToggleAi={toggleAiPanel}
            />
          }
          path="/group"
        />
        <Route
          element={
            <PrivateConversation
              data={messages}
              fetchMessages={fetchMessages}
              isError={conversationQuery.isError}
              isLoading={
                conversationQuery.isLoading ||
                conversationQuery.isFetchingNextPage
              }
              hasMore={!!conversationQuery.hasNextPage}
              conversation={conversationQuery.data?.pages?.[0]?.conversation}
              onToggleAi={toggleAiPanel}
            />
          }
          path="/:contactId/private"
        />
      </Routes>

      <InputHandler
        sendAllowed={!conversationQuery.isError}
        conversationId={conversationId}
      />
      {showAiPanel && (
        <div className={C.AiPanelOverlay}>
          <AiChatBox onClose={() => setShowAiPanel(false)} />
        </div>
      )}
    </motion.div>
  );
};

export default Conversation;
