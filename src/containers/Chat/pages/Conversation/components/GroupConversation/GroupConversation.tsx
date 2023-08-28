import ChatHandler from "../../../shared/components/ChatHandler/ChatHandler";
import ChatHeader from "./components/ChatHeader/ChatHeader";
import c from "./GroupConversation.module.scss";
import { motion } from "framer-motion";
type GroupConversationProps = {
  isLoading: boolean;
  isError: boolean;
  data: Message[];
  fetchMessages: () => void;
};
const GroupConversation = ({
  isLoading,
  isError,
  data,
  fetchMessages,
}: GroupConversationProps) => {
  return (
    <motion.div
      /* variants={conversationAnimationVariants}
      initial="hide"
      animate="show"
      exit="exit" */
      className={c.GroupConversation}
    >
      <ChatHeader />
      <ChatHandler
        data={data}
        isLoading={isLoading}
        isError={isError}
        fetchMessages={fetchMessages}
      />
    </motion.div>
  );
};

export default GroupConversation;
