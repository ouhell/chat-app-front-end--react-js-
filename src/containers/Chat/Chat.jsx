import { Route, Routes } from "react-router-dom";
import classes from "./Chat.module.scss";
import NavBar from "./components/NavBar/NavBar";
import PublicConversation from "./pages/PublicConversation/PublicConverdation";

export default function Chat() {
  return (
    <div className={classes.Chat}>
      <section className={classes.MainSection}>
        <NavBar />
        <div className={classes.MainContent}>
          <Routes>
            <Route path="/chats/private/:id" element={<PublicConversation />} />
          </Routes>
        </div>
        <div className={classes.SideContent}></div>
      </section>
    </div>
  );
}
