import React from "react";
import Message from "../atoms/message";
// import { useTranslation } from "react-i18next";
import "./index.scss";
import { Article } from "../../models/datamodels";
import { formatDateWithMonth } from "../../utils/dateFormater";
import SeeMore from "../../feature/Feed/components/SeeMore";

interface MessageListProps {
  type: "recent" | "older";
  communiques: Article[];
}

const MessageList: React.FC<MessageListProps> = ({
  communiques,
}) => {
  // const { t } = useTranslation();



  return (
    <div className={`right__recent`}>
      {/* <p className="recent">{t("recent")}</p> */}
      <div className="message-list">
        {communiques?.slice(0, 2).map(
          (communique, index ) => (
            <Message
              key={index}
              author={communique.author_id!}
              messageDate={formatDateWithMonth(communique.createdAt!)}
              messageText={communique.content!}
              postID={communique._id!}
            
            />
          )
        )}
      </div>
      <SeeMore/>
    </div>
  );
};

export default MessageList;
