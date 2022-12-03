import { useState } from "react";
import ChatsDisplayer from "./ChatsDisplayers/ChatsDisplayer.jsx";
import { Route, Routes, NavLink } from "react-router-dom";
import {
  PhoneSvg,
  GroupSvg,
  ChatSvg,
  MailSvg,
} from "../../../../shared/assets/svg/SvgProvider.jsx";
import classes from "./NavBar.module.scss";

const topNavigationItems = [
  {
    title: "chats",
    path: "/chats",
    icon: ChatSvg,
  },
  {
    title: "calls",
    path: "/calls",
    icon: PhoneSvg,
  },
  {
    title: "mails",
    path: "/mails",
    icon: MailSvg,
  },
  {
    title: "groups",
    path: "/groups",
    icon: GroupSvg,
  },
];

function NavBar() {
  const [selectedNavigation, setSelectedNavigation] = useState(
    topNavigationItems[0]
  );
  return (
    <div className={classes.NavBar}>
      <div className={classes.TopNavigation}>
        {topNavigationItems.map((topNavItem) => {
          return (
            <NavLink key={topNavItem.title} end to={topNavItem.path}>
              <div
                key={topNavItem.title}
                className={
                  classes.TopNavigationItem +
                  (selectedNavigation.title === topNavItem.title
                    ? ` ${classes.active}`
                    : "")
                }
                onClick={() => setSelectedNavigation(topNavItem)}
                data-title={topNavItem.title}
              >
                {<topNavItem.icon />}
              </div>
            </NavLink>
          );
        })}
      </div>
      <div className={classes.Content}>
        <Routes>
          {["/", "/chats/*"].map((path) => (
            <Route path={path} key={path} element={<ChatsDisplayer />} />
          ))}
        </Routes>
      </div>
    </div>
  );
}

export default NavBar;
