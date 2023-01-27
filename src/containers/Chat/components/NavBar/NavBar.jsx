import { useState, useRef } from "react";
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
import { ComponentActions } from "../../../../store/slices/ComponentSlice";

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
  const startY = useRef(0);
  const startX = useRef(0);
  const isOpen = useSelector((state) => state.component.isNavOpen);
  const userData = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const menuOnClick = ({ key }) => {
    switch (key) {
      case "logout":
        dispatch(AuthActions.logout());
        navigate("/");
      case "settings":
        dispatch(ComponentActions.closeNav());
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
            dispatch(ComponentActions.closeNav());
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
      <div
        className={classes.Content}
        onTouchStart={(e) => {
          startX.current = e.touches[0].clientX;
          startY.current = e.touches[0].clientY;
        }}
        onTouchEnd={(e) => {
          const endX = e.changedTouches[0].clientX;
          const endY = e.changedTouches[0].clientY;
          const diffX = endX - startX.current;
          const diffY = endY - startY.current;
          if (Math.abs(diffX) > Math.abs(diffY) && diffX < -40) {
            dispatch(ComponentActions.closeNav());
          }
        }}
      >
        {selectedNavigation.render}
      </div>
    </div>
  );
}

export default NavBar;
