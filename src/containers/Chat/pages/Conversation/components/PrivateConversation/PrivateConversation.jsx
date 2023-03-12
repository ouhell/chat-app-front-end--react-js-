import axios from "axios";
import { useCallback } from "react";
import { useEffect } from "react";
import { conversationAnimationVariants } from "../../shared/conversationAnimation";
import classes from "./PrivateCoversation.module.scss";
import ChatHandler from "../../../shared/components/ChatHandler/ChatHandler";
import ContactHeader from "./components/ContactHeader/ContactHeader";
import { motion } from "framer-motion";
import { pageAnimation } from "../../../shared/animation/animationHandler";
import InputHandler from "../../../shared/components/InputHandler/InputHandler";
function PrivateConversation({ isLoading, isError, data, fetchMessages }) {
  /* console.log("conversation :", conversation);
  const isContactBlocked = conversation
    ? conversation.conversation.blocked.find((user) => user === contactId)
      ? true
      : false
    : false;
  const isUserBlocked = conversation
    ? conversation.conversation.blocked.find((user) => user === userData.userid)
      ? true
      : false
    : false; */

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
