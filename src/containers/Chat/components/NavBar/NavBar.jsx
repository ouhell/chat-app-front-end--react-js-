import { useState } from "react";
import ChatsDisplayer from "./components/ChatsDisplayers/ChatsDisplayer";
import { Route, Routes, NavLink, useNavigate } from "react-router-dom";
import { DownOutlined, SmileOutlined } from "@ant-design/icons";
import {
  PhoneSvg,
  GroupSvg,
  ChatSvg,
  NotificationBellSvg,
} from "../../../../shared/assets/svg/SvgProvider.jsx";
import classes from "./NavBar.module.scss";
import NotificationDisplayer from "./components/NotificationDisplayer/NotificationDisplayer";
import { Avatar, Dropdown } from "antd";

const DropDownItems = [
  {
    key: "settings",
    label: <NavLink to="/settings">edit settings</NavLink>,
  },

  {
    key: "logout",
    danger: true,
    label: "logout",
  },
];

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
];

function NavBar() {
  const [selectedNavigation, setSelectedNavigation] = useState(
    topNavigationItems[0]
  );
  const navigate = useNavigate();

  const menuOnClick = ({ key }) => {
    switch (key) {
      case "logout":
        localStorage.removeItem("userData");
        navigate("/");
        navigate(0);
    }
  };

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
        <div className={classes.topNavItem}>
          <Dropdown
            menu={{
              items: DropDownItems,
              onClick: menuOnClick,
            }}
          >
            <Avatar className="util-pointer">U</Avatar>
          </Dropdown>
        </div>
      </div>
      <div className={classes.Content}>{selectedNavigation.render}</div>
    </div>
  );
}

export default NavBar;
