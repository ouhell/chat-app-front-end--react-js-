import classes from "./PrivateCoversation.module.scss";
import ChatHandler from "../../../shared/components/ChatHandler/ChatHandler";
import ContactHeader from "./components/ContactHeader/ContactHeader";
import { motion } from "framer-motion";
import { useAppSelector } from "../../../../../../store/ReduxHooks";
import { useParams } from "react-router-dom";

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
  const { conversationId, contactId } = useParams();
  const conversation = useAppSelector(
    (state) =>
      state.chat.conversations[conversationId ?? "undefined"]?.conversation
  );
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
      />
    </motion.div>
  );
}

export default PrivateConversation;
