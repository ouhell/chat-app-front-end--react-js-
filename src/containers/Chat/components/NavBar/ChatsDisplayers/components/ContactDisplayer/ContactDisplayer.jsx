import classes from "./ContactDisplayer.module.scss";
import { SearchSvg } from "../../../../../../../shared/assets/svg/SvgProvider";
import { useCallback, useEffect, useState } from "react";
import { Avatar } from "antd";
import { motion } from "framer-motion";
import axios from "axios";
import { NavLink } from "react-router-dom";
const ContactDisplayer = () => {
  const [seachtext, setSearchtext] = useState("");
  const [contactData, setContactData] = useState([]);
  const [isloading, setIsLoading] = useState(false);

  const filterContact = () => {
    return contactData.filter(
      (contact) =>
        contact.username.includes(seachtext) ||
        contact.personal_name.includes(seachtext)
    );
  };

  const fetchContacts = useCallback(() => {
    setIsLoading(true);
    axios
      .get("api/userapi/user-contact", {
        headers: {
          authorization:
            "Bearer " +
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzhiMjM0ZjQ4YmE2ZDFhMzFlNGZiMjMiLCJyb2xlIjoiVVNFUiIsImlhdCI6MTY3MDA3MjMxNH0.sNjev8TgIJCALw_gzTH0jrIO97q5cy48R00D4H2gvzw",
        },
      })
      .then((res) => {
        console.log("fetched contact data :", res.data);
        setContactData(res.data);
      })
      .catch((err) => {
        console.log("contact fetch error :", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchContacts();
  }, []);
  console.log(contactData.length);
  return (
    <div className={classes.ContactDisplayer}>
      <div className={classes.SearchBarContainer}>
        <div className={classes.SearchBarHolder}>
          <SearchSvg onClick={fetchContacts} />
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

      <div className={classes.ContactList}>
        {filterContact().map((contact, i) => {
          return (
            <motion.div
              key={contact._id}
              initial={{ y: "50%", opacity: 0 }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              transition={{
                duration: 0.5 + 0.2 * i,
              }}
            >
              <NavLink
                to={"/chats/private/" + contact._id}
                className={({ isActive }) =>
                  classes.ContactLink + (isActive ? ` ${classes.active}` : "")
                }
              >
                <motion.div className={classes.Contact}>
                  <Avatar
                    size={40}
                    style={{
                      fontSize: "1rem",
                    }}
                  >
                    {contact.username[0]}
                  </Avatar>
                  <div>
                    <div className={classes.UsernameHolder}>
                      {contact.username}
                    </div>
                    <div className={classes.PersonalnameHolder}>
                      {contact.personal_name}
                    </div>
                  </div>
                </motion.div>
              </NavLink>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ContactDisplayer;
