import { AnimatePresence } from "framer-motion";
import c from "./PublicConversation.module.scss";

const PublicConversation = () => {
  return (
    <AnimatePresence>
      <div className={c.PublicConversation}></div>
    </AnimatePresence>
  );
};

export default PublicConversation;
