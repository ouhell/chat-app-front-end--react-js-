import ChatHandler from "../../../shared/components/ChatHandler/ChatHandler";
import ChatHeader from "./components/ChatHeader/ChatHeader";
import c from "./PublicConversation.module.scss";
import { motion } from "framer-motion";
import { conversationAnimationVariants } from "../../shared/conversationAnimation";
const PublicConversation = ({ isLoading, isError, data, fetchMessages }) => {
  return (
    <motion.div
      /* variants={conversationAnimationVariants}
      initial="hide"
      animate="show"
      exit="exit" */
      className={c.PublicConversation}
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

export default PublicConversation;
