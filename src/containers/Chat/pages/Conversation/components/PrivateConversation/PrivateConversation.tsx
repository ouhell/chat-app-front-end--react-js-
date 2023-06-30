import classes from "./PrivateCoversation.module.scss";
import ChatHandler from "../../../shared/components/ChatHandler/ChatHandler";
import ContactHeader from "./components/ContactHeader/ContactHeader";
import { motion } from "framer-motion";

type PrivateConversationProps = {
  isLoading: boolean;
  isError: boolean;
  data: Message[];
  fetchMessages: () => void;
};

function PrivateConversation({
  isLoading,
  isError,
  data,
  fetchMessages,
}: PrivateConversationProps) {
  return (
    <motion.div
      /* variants={conversationAnimationVariants}
      initial="hide"
      animate="show"
      exit="exit" */
      className={classes.PrivateConversation}
    >
      <ContactHeader isBlocked={false} />
      <ChatHandler
        isLoading={isLoading}
        isError={isError}
        data={data}
        fetchMessages={fetchMessages}
      />
    </motion.div>
  );
}

export default PrivateConversation;
