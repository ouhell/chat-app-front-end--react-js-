import { Avatar, Dropdown, Skeleton } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import {
  MenuSvg,
  MoreDotsSvg,
} from "../../../../../../shared/assets/svg/SvgProvider";
import { ChatActions } from "../../../../../../store/slices/ChatSlice";
import { ComponentActions } from "../../../../../../store/slices/ComponentSlice";

import c from "./ContactHeader.module.scss";

const ContactHeader = () => {
  const { conversationId } = useParams();
  const contactData = useSelector(
    (state) => state.chat.contacts[conversationId]
  );
  console.log("contact data :", contactData);

  const DropDownItems = [
    {
      key: "block",
      label: "block user",
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

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setisError] = useState(false);

  const dispatch = useDispatch();

  const userData = useSelector((state) => state.auth.userData);

  const fetchContactData = () => {
    setIsLoading(true);
    setisError(false);
    axios
      .get("/api/userapi/contact/" + conversationId, {
        headers: {
          authorization: "Bearer " + userData.access_token,
        },
      })
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
          <Dropdown menu={{ items: DropDownItems }} trigger={["click"]}>
            <MoreDotsSvg className={c.Options} />
          </Dropdown>
        </>
      )}
    </div>
  );
};

export default ContactHeader;
