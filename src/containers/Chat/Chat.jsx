import classes from "./Chat.module.scss";
import NavBar from "./components/NavBar/NavBar";

export default function Chat() {
  return (
    <div className={classes.Chat}>
      <section className={classes.MainSection}>
        <NavBar />
        <div className={classes.MainContent}></div>
        <div className={classes.SideContent}></div>
      </section>
    </div>
  );
}
