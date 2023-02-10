import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Result, Button } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SearchSvg } from "../../../../../../../../shared/assets/svg/SvgProvider";
import BasicSpinner from "../../../../../../../../shared/components/BasicSpinner/BasicSpinner";
import { ChatActions } from "../../../../../../../../store/slices/ChatSlice";
import Conversation from "./Conversation/Conversation";
import c from "./PublicConversationDisplayer.module.scss";

const PublicConversationDisplayer = () => {
  const [searchtext, setSearchtext] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const publicConversations = useSelector((state) => state.chat.publicConvos);

  const userData = useSelector((state) => state.auth.userData);

  const dispatch = useDispatch();

  const [animationParent] = useAutoAnimate();

  function applySearch() {
    return publicConversations.filter((conv) =>
      conv.name.includes(searchtext.toLowerCase().trim())
    );
  }

  function fetchPublicConversation() {
    setIsLoading(true);
    setIsError(false);
    axios
      .get("api/messagerie/public/conversations", {
        headers: {
          authorization: "Bearer " + userData.access_token,
        },
      })
      .then((res) => {
        dispatch(ChatActions.setPublicConvos(res.data));
      })
      .catch((err) => {
        console.log("fetching public conversations error", err);
        setIsError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }
  useEffect(() => {
    fetchPublicConversation();
  }, []);

  return (
    <div className={c.PublicConversationDisplayer}>
      <div className={c.SearchBarContainer}>
        <div className={c.SearchBarHolder}>
          <SearchSvg />
          <input
            onChange={(e) => {
              if (e.target.value.length > 25) return;
              setSearchtext(e.target.value);
            }}
            value={searchtext}
            className={c.SearchBar}
          ></input>
        </div>
      </div>
      <BasicSpinner spinning={isLoading} />
      {isError ? (
        <Result
          status={"error"}
          title="Error"
          icon={null}
          subTitle="couldn' t load public chats"
          extra={[
            <Button
              className={c.Button}
              onClick={fetchPublicConversation}
              key={"public conv refetch"}
            >
              retry
            </Button>,
          ]}
        />
      ) : null}
      <div className={c.Conversations} ref={animationParent}>
        {applySearch().map((conv) => {
          return <Conversation data={conv} key={conv._id} />;
        })}
      </div>
    </div>
  );
};
export default PublicConversationDisplayer;
