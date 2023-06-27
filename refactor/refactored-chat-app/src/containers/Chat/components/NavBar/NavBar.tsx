import { useState, useRef } from "react";
import ChatsDisplayer from "./components/ChatsDisplayers/ChatsDisplayer.jsx";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ChatSvg,
  NotificationBellSvg,
  MenuSvg,
  ArrowBackSvg,
} from "../../../../shared/assets/svg/SvgProvider.js";
import classes from "./NavBar.module.scss";
import NotificationDisplayer from "./components/NotificationDisplayer/NotificationDisplayer.jsx";
import { Avatar, Dropdown } from "antd";
import { AuthActions } from "../../../../store/slices/AuthSlice.js";
import { ComponentActions } from "../../../../store/slices/ComponentSlice.js";
import { NotifActions } from "../../../../store/slices/NotificationSlice.js";
import { ChatActions } from "../../../../store/slices/ChatSlice.js";
import useResize from "../../../../helpers/hooks/useResize.jsx";
import { navigationHide } from "../../../../helpers/scss/variables.module.scss";
import { motion } from "framer-motion";
const navbarBreakPoint = Number.parseInt(navigationHide);

const DropDownItems = [
  {
    key: "profile",
    label: <NavLink to="/settings">edit profile</NavLink>,
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
  const { windowHeigth, windowWidth } = useResize();

  const menuOnClick = ({ key }) => {
    switch (key) {
      case "logout":
        dispatch(ChatActions.resetState());
        dispatch(NotifActions.resetState());
        dispatch(ComponentActions.resetState());
        dispatch(AuthActions.resetState());
        dispatch(AuthActions.logout());
        navigate("/");
      case "profile":
        dispatch(ComponentActions.closeNav());
    }
  };

  const isMobileSize = windowWidth <= navbarBreakPoint;

  return (
    <motion.div
      className={classes.NavBar}
      initial={{
        x: "-100%",
        opacity: 0,
      }}
      animate={
        isMobileSize && isOpen
          ? {
              position: "fixed",
              width: "100vw",
              x: 0,
              opacity: 1,
              transition: {
                type: "spring",
                stiffness: "900",
                damping: 55,
              },
            }
          : isMobileSize
          ? {
              position: "fixed",
              width: "100vw",
              x: "-100%",
              opacity: 0,
              transition: {
                opacity: { duration: 0.1 },
                type: "spring",
                stiffness: "300",
                damping: 30,
              },
            }
          : {
              position: "relative",
              width: "25rem",
              x: 0,
              opacity: 1,
              transition: {
                type: "spring",
                stiffness: "500",
                damping: 30,
              },
            }
      }

      /* isopen={isOpen} */
    >
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
    </motion.div>
  );
}

export default NavBar;
