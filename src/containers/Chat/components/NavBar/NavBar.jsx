import { useState } from "react";
import ChatsDisplayer from "./components/ChatsDisplayers/ChatsDisplayer";
import { Route, Routes, NavLink, useNavigate } from "react-router-dom";
import {
  PhoneSvg,
  GroupSvg,
  ChatSvg,
  NotificationBellSvg,
} from "../../../../shared/assets/svg/SvgProvider.jsx";
import classes from "./NavBar.module.scss";
import NotificationDisplayer from "./components/NotificationDisplayer/NotificationDisplayer";

const topNavigationItems = [
  {
    title: "chats",
    path: "/chats",
    icon: ChatSvg,
    render: <ChatsDisplayer />,
  },
  {
    title: "calls",
    path: "/calls",
    icon: PhoneSvg,
  },
  {
    title: "notifications",
    path: "/notifications",
    icon: NotificationBellSvg,
    render: <NotificationDisplayer />,
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
  const navigate = useNavigate();
  return (
    <div className={classes.NavBar}>
      <div className={classes.TopNavigation}>
        {topNavigationItems.map((topNavItem) => {
          return (
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
          );
        })}
      </div>
      <div className={classes.Content}>{selectedNavigation.render}</div>
      <div
        className={classes.Logout}
        onClick={() => {
          localStorage.removeItem("userData");
          navigate("/signin");
          navigate(0);
        }}
      >
        logout
      </div>
    </div>
  );
}

export default NavBar;
