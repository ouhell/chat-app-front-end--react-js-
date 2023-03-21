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

const contactContainerAnimation = {
  hidden: {
    opacity: 0,
  },
  shown: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
  },
};

const contactAnimations = {
  hidden: {
    opacity: 0,
    y: "20%",
  },
  shown: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: "20%",
  },
};

const ContactDisplayer = () => {
  const [seachtext, setSearchtext] = useState("");
  const contactData = useSelector((state) => state.chat.contacts);
  const contacts = Object.keys(contactData).map((key) => contactData[key]);
  const [isloading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const userData = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();
  const [parent, enableAnimate] = useAutoAnimate();

  const filterContact = () => {
    return contacts.filter((contact, i) => {
      const filtertext = seachtext.trim().toLowerCase();
      return (
        contact.user.username.toLowerCase().includes(filtertext) ||
        contact.user.personal_name.toLowerCase().includes(filtertext)
      );
    });
  };

  const fetchContacts = useCallback(() => {
    setIsLoading(true);
    setIsError(false);
    axios
      .get("api/userapi/contact", {
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
    if (contacts.length === 0) fetchContacts();
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

      {!isloading && !isError && contacts.length === 0 ? (
        <Empty description="No contact" />
      ) : null}

      <motion.div
        className={classes.ContactList}
        variants={contactContainerAnimation}
        initial="hidden"
        animate="shown"
        exit="exit"
        /*   ref={parent} */
      >
        <AnimatePresence mode="popLayout">
          {filterContact().map((contact, i) => {
            return (
              <motion.div
                variants={contactAnimations}
                exit={{
                  opacity: 0,
                  y: "-20%",
                }}
                layout
                key={contact._id}
              >
                <Contact contactInfo={contact} userData={userData} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ContactDisplayer;
