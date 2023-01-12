import c from "./Contact.module.scss";
import { NavLink } from "react-router-dom";
import { Avatar } from "antd";
import { ChatActions } from "../../../../../../../../../store/slices/ChatSlice";
import { useDispatch } from "react-redux";
const Contact = ({ contactInfo }) => {
  const dispatch = useDispatch();

  return (
    <NavLink
      to={"/chats/private/" + contactInfo._id}
      className={({ isActive }) =>
        c.ContactLink + (isActive ? ` ${c.active}` : "")
      }
      onClick={() => {
        dispatch(ChatActions.OpenNav());
      }}
    >
      <div className={c.Contact}>
        <Avatar
          src={contactInfo.user.profile_picture}
          size={40}
          style={{
            fontSize: "1rem",
          }}
        >
          {contactInfo.user.username[0]}
        </Avatar>
        <div>
          <div className={c.UsernameHolder}>{contactInfo.user.username}</div>
          <div className={c.PersonalnameHolder}>
            {contactInfo.user.personal_name}
          </div>
        </div>
      </div>
    </NavLink>
  );
};

export default Contact;
