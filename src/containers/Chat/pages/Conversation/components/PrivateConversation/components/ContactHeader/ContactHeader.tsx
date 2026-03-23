import { Avatar, Dropdown, Skeleton } from "antd";

import { useMemo } from "react";
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
import { useAppDispatch } from "../../../../../../../../store/ReduxHooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../../../../../../../client/queryKeys";
import { setConversationBlockedUser } from "../../../../../../../../client/queryHelpers";

const ContactHeader = ({ isBlocked }: { isBlocked: boolean }) => {
  const { conversationId = "undefined", contactId = "undefined" } = useParams();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const contactDataQuery = useQuery({
    queryKey: queryKeys.contactProfile(conversationId),
    queryFn: async () => {
      const res = await getContactProfileData(conversationId);
      return res.data as Contact;
    },
  });
  const contactData = contactDataQuery.data;

  const removeContactMutation = useMutation({
    mutationFn: () => deleteContact(contactId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts });
      queryClient.removeQueries({
        queryKey: queryKeys.conversation(conversationId),
      });
    },
  });

  const blacklistMutation = useMutation({
    mutationFn: () => blackListUser(contactId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts });
      queryClient.removeQueries({
        queryKey: queryKeys.conversation(conversationId),
      });
    },
  });

  const blockMutation = useMutation({
    mutationFn: () => blockContact(contactId),
    onSuccess: () => {
      dispatch(
        ChatActions.emit({
          event: "block",
          data: {
            conversationId: conversationId,
            blockedUser: contactId,
          },
        }),
      );
      setConversationBlockedUser(queryClient, conversationId, contactId, true);
      dispatch(
        NotifActions.notify({
          type: "success",
          message: "user blocked",
        }),
      );
    },
  });

  const unblockMutation = useMutation({
    mutationFn: () => unblockContact(contactId),
    onSuccess: () => {
      dispatch(
        NotifActions.notify({
          type: "success",
          message: "user unblocked",
        }),
      );
      setConversationBlockedUser(queryClient, conversationId, contactId, false);
    },
  });

  const DropDownItems = useMemo(
    () => [
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
    ],
    [isBlocked],
  );

  const removeContact = () => {
    removeContactMutation
      .mutateAsync()
      .catch((err) => console.log("remove contact err :", err));
  };
  const blackListContact = () => {
    blacklistMutation
      .mutateAsync()
      .catch((err) => console.log("remove contact err :", err));
  };

  const blockUser = () => {
    blockMutation.mutateAsync().catch((err) => {
      console.log(err);
    });
  };

  const unblockUser = () => {
    unblockMutation
      .mutateAsync()
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

  const isReady = !!contactData;

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
