import classes from "./ContactDisplayer.module.scss";
import { SearchSvg } from "../../../../../../../shared/assets/svg/SvgProvider";
import { useEffect, useState } from "react";
import axios from "axios";
const ContactDisplayer = () => {
  const [seachtext, setSearchtext] = useState(null);
  const [contactData, setContactData] = useState([]);

  useEffect(() => {
    axios
      .get("api/userapi/user-contact", {
        headers: {
          authorization:
            "Bearer " +
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzODkxOGM4NjFmMGRmNjg3MWYzZDBlNiIsImlhdCI6MTY3MDAwMTg5M30.NclMNPVLvotoeUXXOOqiBkDZY1Wz8NGtB_u0jMI51tU",
        },
      })
      .then((res) => {
        console.log("fetched contact data :", res.data);
      })
      .catch((err) => {
        console.log("contact fetch error :", err);
      });
  }, []);

  return (
    <div className={classes.ContactDisplayer}>
      <div className={classes.SearchBarHolder}>
        <SearchSvg />
        <input className={classes.SearchBar}></input>
      </div>
    </div>
  );
};

export default ContactDisplayer;
