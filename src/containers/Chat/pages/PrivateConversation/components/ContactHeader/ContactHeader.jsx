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
const ContactHeader = () => {
  const [contactData, setContactData] = useState({
    username: " ",
    personal_name: "",
    profile_picture: undefined,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setisError] = useState(false);

  const dispatch = useDispatch();

  const userData = useSelector((state) => state.auth.userData);
  const { id: contactId } = useParams();

  const fetchContactData = () => {
    setIsLoading(true);
    setisError(false);
    axios
      .get("/api/userapi/contact_profile/" + contactId, {
        headers: {
          authorization: "Bearer " + userData.access_token,
        },
      })
      .then((res) => {
        setContactData(res.data);
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
    fetchContactData();
  }, [contactId]);

  const isReady = !isLoading && !isError;

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

      {isLoading && (
        <>
          <Skeleton.Avatar size={45} active />
          <div className={c.InfoHolder}>
            <Skeleton.Input active />
          </div>
        </>
      )}
      {isReady && (
        <>
          <Avatar size={45} src={contactData.profile_picture}>
            {contactData.username[0]}
          </Avatar>
          <div className={c.InfoHolder}>
            <div className={c.UsernameHolder}>{contactData.username}</div>
            <div className={c.PersonalnameHolder}>
              {contactData.personal_name}
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
