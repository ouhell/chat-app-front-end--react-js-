import classes from "./ContactDisplayer.module.scss";
import { SearchSvg } from "../../../../../../../../shared/assets/svg/SvgProvider";
import { useState } from "react";
import { Button, Empty, Result } from "antd";
import { AnimatePresence, motion } from "framer-motion";

import BasicSpinner from "../../../../../../../../shared/components/BasicSpinner/BasicSpinner";
import Contact from "./components/Contact";
import { getContacts } from "../../../../../../../../client/ApiClient";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../../../../../../../client/queryKeys";

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
  const contactsQuery = useQuery({
    queryKey: queryKeys.contacts,
    queryFn: async () => {
      const res = await getContacts();
      return res.data as Contact[];
    },
  });
  const contacts = contactsQuery.data ?? [];

  const filterContact = () => {
    return contacts.filter((contact) => {
      const filtertext = seachtext.trim().toLowerCase();
      return (
        contact.user.username.toLowerCase().includes(filtertext) ||
        contact.user.personal_name.toLowerCase().includes(filtertext)
      );
    });
  };

  const filteredContacts = filterContact();

  return (
    <div className={classes.ContactDisplayer}>
      <div className={classes.SearchBarContainer}>
        <div className={classes.SearchBarHolder}>
          <SearchSvg />
          <input
            placeholder="Search by username or name"
            onChange={(e) => {
              if (e.target.value.length > 25) return;
              setSearchtext(e.target.value);
            }}
            value={seachtext}
            className={classes.SearchBar}
          ></input>
        </div>
      </div>
      <BasicSpinner size="default" spinning={contactsQuery.isLoading} />

      {contactsQuery.isError ? (
        <Result
          status={"error"}
          title="Error"
          icon={null}
          subTitle="couldn' t load contacts"
          extra={[
            <Button className={classes.Button} onClick={() => contactsQuery.refetch()}>
              retry
            </Button>,
          ]}
        />
      ) : null}

      {!contactsQuery.isLoading && !contactsQuery.isError && contacts.length === 0 ? (
        <Empty description="No contact" />
      ) : null}
      {!contactsQuery.isLoading &&
      !contactsQuery.isError &&
      contacts.length > 0 &&
      filteredContacts.length === 0 ? (
        <Empty description="No matching contacts" />
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
          {filteredContacts.map((contact) => {
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
                <Contact contactInfo={contact} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ContactDisplayer;
