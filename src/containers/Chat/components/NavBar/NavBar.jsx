import { useState } from "react";
import ChatsDisplayer from "./components/ChatsDisplayers/ChatsDisplayer";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ChatSvg,
  NotificationBellSvg,
  MenuSvg,
  ArrowBackSvg,
} from "../../../../shared/assets/svg/SvgProvider.jsx";
import classes from "./NavBar.module.scss";
import NotificationDisplayer from "./components/NotificationDisplayer/NotificationDisplayer";
import { Avatar, Dropdown } from "antd";
import { AuthActions } from "../../../../store/slices/authenticationSlice";
import { ChatActions } from "../../../../store/slices/ChatSlice";

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
  const isOpen = useSelector((state) => state.chat.isNavOpen);
  const userData = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const menuOnClick = ({ key }) => {
    switch (key) {
      case "logout":
        dispatch(AuthActions.logout());
        navigate("/");
    }
  };

  return (
    <div className={classes.NavBar} isopen={isOpen}>
      <div className={classes.TopNavigation}>
        <div
          className={classes.TopNavigationItem + " " + classes.CloseArrow}
          style={{
            /* position: "fixed", */
            color: "var(--primary-soft)",
          }}
          onClick={() => {
            dispatch(ChatActions.OpenNav());
          }}
        >
          <ArrowBackSvg />
        </div>
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
            trigger={"click"}
            menu={{
              items: DropDownItems,
              onClick: menuOnClick,
            }}
          >
            <Avatar
              className="util-pointer util-capitalized"
              src={userData.profile_picture}
            >
              {userData.username[0]}
            </Avatar>
          </Dropdown>
        </div>
      </div>
      <div className={classes.Content}>{selectedNavigation.render}</div>
    </div>
  );
}

export default NavBar;
