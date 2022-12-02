import { useState } from "react";
import ChatsDisplayer from "./ChatsDisplayers/ChatsDisplayer.jsx";
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
    icon: ChatSvg,
    render: <ChatsDisplayer />,
  },
  {
    title: "calls",
    icon: PhoneSvg,
  },
  {
    title: "mails",
    icon: MailSvg,
  },
  {
    title: "groups",
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
    </div>
  );
}

export default NavBar;
