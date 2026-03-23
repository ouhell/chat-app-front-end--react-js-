import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import type { MessagesPayload } from "./responseTypes/messageResponses";
import { queryKeys } from "./queryKeys";

const dedupeById = (messages: Message[]) => {
  const ids = new Set<string>();
  const deduped: Message[] = [];

  for (const message of messages) {
    if (ids.has(message._id)) continue;
    ids.add(message._id);
    deduped.push(message);
  }

  return deduped;
};

export const flattenConversationMessages = (
  data?: InfiniteData<MessagesPayload>,
): Message[] => {
  if (!data?.pages?.length) return [];

  const ordered = [...data.pages]
    .reverse()
    .flatMap((page) => page.messages.data ?? []);

  return dedupeById(ordered);
};

const updateConversationCache = (
  queryClient: QueryClient,
  conversationId: string,
  updater: (messages: Message[]) => Message[],
) => {
  queryClient.setQueryData<InfiniteData<MessagesPayload>>(
    queryKeys.conversation(conversationId),
    (oldData) => {
      if (!oldData?.pages?.length) return oldData;

      const mergedMessages = updater(flattenConversationMessages(oldData));

      const firstPage = oldData.pages[0];
      return {
        ...oldData,
        pages: [
          {
            ...firstPage,
            messages: {
              ...firstPage.messages,
              data: mergedMessages,
            },
          },
        ],
        pageParams: [0],
      };
    },
  );
};

export const appendMessageToConversation = (
  queryClient: QueryClient,
  conversationId: string,
  message: Message,
) => {
  updateConversationCache(queryClient, conversationId, (messages) => {
    return dedupeById([...messages, message]);
  });
};

export const replaceMessageInConversation = (
  queryClient: QueryClient,
  conversationId: string,
  tempId: string,
  message: Message,
) => {
  updateConversationCache(queryClient, conversationId, (messages) => {
    const index = messages.findIndex((msg) => msg._id === tempId);
    if (index < 0) return messages;

    const nextMessages = [...messages];
    const nextMessage = {
      ...message,
      trueId: message._id,
      _id: tempId,
    };

    nextMessages[index] = nextMessage;

    return nextMessages;
  });
};

export const removeMessageFromConversation = (
  queryClient: QueryClient,
  conversationId: string,
  messageId: string,
) => {
  updateConversationCache(queryClient, conversationId, (messages) =>
    messages.filter((msg) => msg._id !== messageId),
  );
};

export const setConversationBlockedUser = (
  queryClient: QueryClient,
  conversationId: string,
  blockedUser: string,
  blocked: boolean,
) => {
  queryClient.setQueryData<InfiniteData<MessagesPayload>>(
    queryKeys.conversation(conversationId),
    (oldData) => {
      if (!oldData?.pages?.length) return oldData;

      const firstPage = oldData.pages[0];
      const blockList = firstPage.conversation.blocked ?? [];

      const nextBlocked = blocked
        ? Array.from(new Set([...blockList, blockedUser]))
        : blockList.filter((id) => id !== blockedUser);

      return {
        ...oldData,
        pages: [
          {
            ...firstPage,
            conversation: {
              ...firstPage.conversation,
              blocked: nextBlocked,
            },
          },
          ...oldData.pages.slice(1),
        ],
      };
    },
  );
};
