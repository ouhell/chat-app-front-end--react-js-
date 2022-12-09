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
    let auth = "Bearer " + JSON.parse(localStorage.getItem("token"));
    console.log("authorization : ", auth);
    axios
      .get("api/userapi/user-contact", {
        headers: {
          authorization: "Bearer " + JSON.parse(localStorage.getItem("token")),
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
                to={"/chats/private/" + contact.conversation_id}
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
