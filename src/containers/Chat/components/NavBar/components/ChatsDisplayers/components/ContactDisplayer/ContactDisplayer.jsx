import classes from "./ContactDisplayer.module.scss";
import { SearchSvg } from "../../../../../../../../shared/assets/svg/SvgProvider";
import { useCallback, useEffect, useState } from "react";
import { Button, Empty, Result } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import BasicSpinner from "../../../../../../../../shared/components/BasicSpinner/BasicSpinner";
import { useDispatch, useSelector } from "react-redux";
import Contact from "./components/Contact";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { ChatActions } from "../../../../../../../../store/slices/ChatSlice";

const ContactDisplayer = () => {
  const [seachtext, setSearchtext] = useState("");
  const contactData = useSelector((state) => state.chat.contacts);
  const [isloading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const userData = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();
  const [parent, enableAnimate] = useAutoAnimate();

  const filterContact = () => {
    return contactData.filter((contact, i) => {
      return (
        contact.user.username.includes(seachtext) ||
        contact.user.personal_name.includes(seachtext)
      );
    });
  };

  const fetchContacts = useCallback(() => {
    setIsLoading(true);
    setIsError(false);
    axios
      .get("api/userapi/user-contact", {
        headers: {
          authorization: "Bearer " + userData.access_token,
        },
      })
      .then((res) => {
        dispatch(ChatActions.setContacts(res.data));
      })
      .catch((err) => {
        setIsError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (contactData.length === 0) fetchContacts();
  }, []);

  return (
    <div className={classes.ContactDisplayer}>
      <div className={classes.SearchBarContainer}>
        <div className={classes.SearchBarHolder}>
          <SearchSvg />
          <input
            onChange={(e) => {
              if (e.target.value.length > 25) return;
              setSearchtext(e.target.value);
            }}
            value={seachtext}
            className={classes.SearchBar}
          ></input>
        </div>
      </div>
      <BasicSpinner spinning={isloading} />

      {isError ? (
        <Result
          status={"error"}
          title="Error"
          icon={null}
          subTitle="couldn' t load contacts"
          extra={[
            <Button className={classes.Button} onClick={fetchContacts}>
              retry
            </Button>,
          ]}
        />
      ) : null}

      {!isloading && !isError && contactData.length === 0 ? (
        <Empty description="No contact" />
      ) : null}

      <div className={classes.ContactList} ref={parent}>
        {filterContact().map((contact, i) => {
          return (
            <div key={contact._id}>
              <Contact
                contactInfo={contact}
                userData={userData}
                key={contact._id}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContactDisplayer;
