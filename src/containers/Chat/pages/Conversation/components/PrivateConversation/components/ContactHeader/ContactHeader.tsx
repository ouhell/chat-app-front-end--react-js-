import { Avatar, Dropdown, Skeleton } from "antd";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import {
  blackListUser,
  blockContact,
  deleteContact,
  getContactProfileData,
  unblockContact,
} from "../../../../../../../../client/ApiClient";
import {
  MenuSvg,
  MoreDotsSvg,
} from "../../../../../../../../shared/assets/svg/SvgProvider";
import { ChatActions } from "../../../../../../../../store/slices/ChatSlice";
import { ComponentActions } from "../../../../../../../../store/slices/ComponentSlice";
import { NotifActions } from "../../../../../../../../store/slices/NotificationSlice";
import c from "./ContactHeader.module.scss";
import { useAppSelector } from "../../../../../../../../store/ReduxHooks";

const ContactHeader = ({ isBlocked }: { isBlocked: boolean }) => {
  const { conversationId = "undefined", contactId = "undefined" } = useParams();

  const contactData = useAppSelector(
    (state) => state.chat.contacts[conversationId]
  );

  const DropDownItems = [
    {
      key: isBlocked ? "unblock" : "block",
      label: isBlocked ? "unblock user" : "block user",
    },

    {
      key: "remove",
      danger: true,
      label: "remove contact",
    },
    {
      key: "blackList",
      danger: true,
      label: "blacklist user",
    },
  ];

  const [_isLoading, setIsLoading] = useState(false);
  const [_isError, setisError] = useState(false);

  const dispatch = useDispatch();

  const userData = useAppSelector((state) => state.auth.userData);

  const fetchContactData = () => {
    setIsLoading(true);
    setisError(false);
    getContactProfileData(userData?.access_token ?? "undefined", conversationId)
      .then((res) => {
        dispatch(
          ChatActions.addContact({
            newContact: res.data,
          })
        );
      })
      .catch((err) => {
        console.log("fetching contacts error", err);
        setisError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const removeContact = () => {
    console.log("removing :", contactId);
    deleteContact(userData?.access_token ?? "undefined", contactId)
      .then((_res) => {
        dispatch(ChatActions.removeContact({ contactId: conversationId }));
        dispatch(ChatActions.removeConversation({ conversationId }));
      })
      .catch((err) => console.log("remove contact err :", err));
  };
  const blackListContact = () => {
    console.log("removing :", contactId);
    blackListUser(userData?.access_token ?? "undefined", contactId)
      .then((_res) => {
        dispatch(ChatActions.removeContact({ contactId: conversationId }));
        dispatch(ChatActions.removeConversation({ conversationId }));
      })
      .catch((err) => console.log("remove contact err :", err));
  };

  const blockUser = () => {
    blockContact(userData?.access_token ?? "undefined", contactId)
      .then((res) => {
        console.log("blocking res", res);
        dispatch(
          ChatActions.emit({
            event: "block",
            data: {
              conversationId: conversationId,
              blockedUser: contactId,
            },
          })
        );
        dispatch(
          ChatActions.setUserBanned({
            bannedUser: contactId,
            conversationId: conversationId,
          })
        );
        dispatch(
          NotifActions.notify({
            type: "success",
            message: "user blocked",
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const unblockUser = () => {
    unblockContact(userData?.access_token ?? "undefined", contactId)
      .then(() => {
        dispatch(
          NotifActions.notify({
            type: "success",
            message: "user unblocked",
          })
        );
        dispatch(
          ChatActions.setUserUnbanned({
            bannedUser: contactId,
            conversationId: conversationId,
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const dropDownClickHandler = ({ key }: { key: string }) => {
    switch (key) {
      case "remove":
        removeContact();
        break;
      case "block":
        blockUser();
        break;
      case "unblock":
        unblockUser();
        break;
      case "blackList":
        blackListContact();
        break;
    }
  };

  useEffect(() => {
    if (!contactData) fetchContactData();
  }, [conversationId]);

  const isReady = contactData ? true : false;

  return (
    <div className={c.ContactHeader}>
      <MenuSvg
        style={{
          color: "var(--primary-soft)",
          cursor: "pointer",
        }}
        className={c.Menu}
        onClick={() => {
          dispatch(ComponentActions.openNav());
        }}
      />

      {!isReady && (
        <>
          <Skeleton.Avatar size={45} active />
          <div className={c.InfoHolder}>
            <Skeleton.Input active />
          </div>
        </>
      )}
      {isReady && (
        <>
          <Avatar size={45} src={contactData.user.profile_picture}>
            {contactData.user.username[0]}
          </Avatar>
          <div className={c.InfoHolder}>
            <div className={c.UsernameHolder}>{contactData.user.username}</div>
            <div className={c.PersonalnameHolder}>
              {contactData.user.personal_name}
            </div>
          </div>
          <Dropdown
            menu={{ items: DropDownItems, onClick: dropDownClickHandler }}
            trigger={["click"]}
          >
            <MoreDotsSvg className={c.Options} />
          </Dropdown>
        </>
      )}
    </div>
  );
};

export default ContactHeader;
