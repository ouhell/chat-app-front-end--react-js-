import ChatHandler from "../../../shared/components/ChatHandler/ChatHandler";
import ChatHeader from "./components/ChatHeader/ChatHeader";
import c from "./PublicConversation.module.scss";
import { motion } from "framer-motion";
type PublicConversationProps = {
  isLoading: boolean;
  isError: boolean;
  data: Message[];
  fetchMessages: () => void;
  hasMore: boolean;
  onToggleAi: () => void;
};
const PublicConversation = ({
  isLoading,
  isError,
  data,
  fetchMessages,
  hasMore,
  onToggleAi,
}: PublicConversationProps) => {
  return (
    <motion.div
      /* variants={conversationAnimationVariants}
      initial="hide"
      animate="show"
      exit="exit" */
      className={c.PublicConversation}
    >
      <ChatHeader onToggleAi={onToggleAi} />
      <ChatHandler
        data={data}
        isLoading={isLoading}
        isError={isError}
        fetchMessages={fetchMessages}
        hasMore={hasMore}
      />
    </motion.div>
  );
};

export default PublicConversation;
