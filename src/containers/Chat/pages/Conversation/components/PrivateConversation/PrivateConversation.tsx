import classes from "./PrivateCoversation.module.scss";
import ChatHandler from "../../../shared/components/ChatHandler/ChatHandler";
import ContactHeader from "./components/ContactHeader/ContactHeader";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";

type PrivateConversationProps = {
  isLoading: boolean;
  isError: boolean;
  data: Message[];
  fetchMessages: () => void;
  hasMore: boolean;
  conversation?: Conversation;
};

function PrivateConversation({
  isLoading,
  isError,
  data,
  fetchMessages,
  hasMore,
  conversation,
}: PrivateConversationProps) {
  const { contactId } = useParams();
  const isBlocked = !!conversation?.blocked.find((user) => user === contactId);
  return (
    <motion.div
      /* variants={conversationAnimationVariants}
      initial="hide"
      animate="show"
      exit="exit" */
      className={classes.PrivateConversation}
    >
      <ContactHeader isBlocked={isBlocked} />
      <ChatHandler
        isLoading={isLoading}
        isError={isError}
        data={data}
        fetchMessages={fetchMessages}
        hasMore={hasMore}
      />
    </motion.div>
  );
}

export default PrivateConversation;
