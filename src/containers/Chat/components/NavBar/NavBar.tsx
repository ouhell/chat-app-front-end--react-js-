import { useMemo, useRef, useState } from "react";
import ChatsDisplayer from "./components/ChatsDisplayers/ChatsDisplayer";
import { NavLink, useNavigate } from "react-router-dom";
import {
  ChatSvg,
  NotificationBellSvg,
  ArrowBackSvg,
} from "../../../../shared/assets/svg/SvgProvider";
import classes from "./NavBar.module.scss";
import NotificationDisplayer from "./components/NotificationDisplayer/NotificationDisplayer";
import { Avatar, Dropdown } from "antd";
import { AuthActions } from "../../../../store/slices/AuthSlice";
import { ComponentActions } from "../../../../store/slices/ComponentSlice";
import { NotifActions } from "../../../../store/slices/NotificationSlice";
import { ChatActions } from "../../../../store/slices/ChatSlice";
import useResize from "../../../../helpers/hooks/useResize";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { navigationHide } from "../../../../helpers/scss/variables.module.scss";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../../../store/ReduxHooks";
import { useQuery } from "@tanstack/react-query";
import {
  apiLogout,
  getContactRequests,
  getContacts,
} from "../../../../client/ApiClient";
import { queryKeys } from "../../../../client/queryKeys";
import { queryClient } from "../../../../client/queryClient";
const navbarBreakPoint = Number.parseInt(navigationHide);

const DropDownItems = [
  {
    key: "profile",
    label: <NavLink to="/settings">Edit profile</NavLink>,
  },

  {
    key: "logout",
    danger: true,
    label: "Logout",
  },
];

type NavSection = "chats" | "notifications";

function NavBar() {
  const [selectedNavigation, setSelectedNavigation] =
    useState<NavSection>("chats");
  const startY = useRef(0);
  const startX = useRef(0);

  const isOpen = useAppSelector((state) => state.component.isNavOpen);
  const userData = useAppSelector((state) => state.auth.userData);
  const contactsQuery = useQuery({
    queryKey: queryKeys.contacts,
    queryFn: async () => {
      const res = await getContacts();
      return res.data as Contact[];
    },
  });
  const requestsQuery = useQuery({
    queryKey: queryKeys.requests,
    queryFn: async () => {
      const res = await getContactRequests();
      return res.data as Request[];
    },
  });
  const requestCount = requestsQuery.data?.length ?? 0;
  const contactCount = contactsQuery.data?.length ?? 0;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { windowWidth } = useResize();

  const topNavigationItems = useMemo(
    () => [
      {
        key: "chats" as NavSection,
        title: "Chats",
        helperText: `${contactCount} contact${contactCount === 1 ? "" : "s"}`,
        icon: ChatSvg,
        badge: contactCount,
        render: <ChatsDisplayer />,
      },
      {
        key: "notifications" as NavSection,
        title: "Notifications",
        helperText: `${requestCount} request${requestCount === 1 ? "" : "s"}`,
        icon: NotificationBellSvg,
        badge: requestCount,
        render: <NotificationDisplayer />,
      },
    ],
    [contactCount, requestCount],
  );

  const selectedTab =
    topNavigationItems.find((item) => item.key === selectedNavigation) ??
    topNavigationItems[0];

  const menuOnClick = ({ key }: { key: string }) => {
    switch (key) {
      case "logout":
        apiLogout().then(() => {
          dispatch(ChatActions.resetState());
          dispatch(NotifActions.resetState());
          dispatch(ComponentActions.resetState());
          dispatch(AuthActions.resetState());
          dispatch(AuthActions.logout());
          queryClient.clear();
          navigate("/");
        });

        break;
      case "profile":
        dispatch(ComponentActions.closeNav());
        break;
      default:
        break;
    }
  };

  const isMobileSize = windowWidth <= navbarBreakPoint;

  return (
    <>
      {isMobileSize && isOpen ? (
        <motion.button
          type="button"
          aria-label="Close sidebar"
          className={classes.Backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => dispatch(ComponentActions.closeNav())}
        />
      ) : null}

      <motion.aside
        className={classes.NavBar}
        initial={{
          x: -50,
          opacity: 0,
        }}
        animate={
          isMobileSize && isOpen
            ? {
                position: "fixed",
                width: "min(94vw, 24rem)",
                x: 0,
                opacity: 1,
                transition: {
                  duration: 0.28,
                  ease: "easeOut",
                },
              }
            : isMobileSize
              ? {
                  position: "fixed",
                  width: "min(94vw, 24rem)",
                  x: "-110%",
                  opacity: 0,
                  transition: {
                    opacity: { duration: 0.1 },
                    duration: 0.42,
                    ease: "easeInOut",
                  },
                }
              : {
                  position: "relative",
                  width: "22.5rem",
                  x: 0,
                  opacity: 1,
                  transition: {
                    duration: 0.45,
                    ease: "easeOut",
                  },
                }
        }
      >
        <div className={classes.TopHeader}>
          <div className={classes.BrandSection}>
            <button
              type="button"
              className={classes.CloseArrow}
              onClick={() => {
                dispatch(ComponentActions.closeNav());
              }}
            >
              <ArrowBackSvg />
            </button>
            <div>
              <div className={classes.BrandLabel}>Workspace</div>
              <div className={classes.BrandTitle}>Messages</div>
            </div>
          </div>
          <Dropdown
            trigger={["click"]}
            menu={{
              items: DropDownItems,
              onClick: menuOnClick,
            }}
          >
            <Avatar
              className="util-pointer util-capitalized"
              src={userData?.profile_picture}
            >
              {userData?.username?.[0]?.toUpperCase() ?? "U"}
            </Avatar>
          </Dropdown>
        </div>

        <div className={classes.TopNavigation}>
          {topNavigationItems.map((topNavItem) => {
            const isSelected = selectedNavigation === topNavItem.key;
            return (
              <button
                key={topNavItem.key}
                type="button"
                className={`${classes.TopNavigationItem} ${
                  isSelected ? classes.active : ""
                }`}
                onClick={() => setSelectedNavigation(topNavItem.key)}
                data-title={topNavItem.title}
              >
                <span className={classes.IconHolder}>
                  <topNavItem.icon />
                </span>
                <span className={classes.NavLabel}>{topNavItem.title}</span>
                {topNavItem.badge > 0 ? (
                  <span className={classes.Badge}>{topNavItem.badge}</span>
                ) : null}
              </button>
            );
          })}
        </div>

        <div className={classes.SectionHeader}>
          <h2 className={classes.SectionTitle}>{selectedTab.title}</h2>
          <span className={classes.SectionMeta}>{selectedTab.helperText}</span>
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
          {selectedTab.render}
        </div>
      </motion.aside>
    </>
  );
}

export default NavBar;
