import React from "react";
import Message from "../atoms/message";
import { useTranslation } from "react-i18next";
import "./index.scss";
import { Article } from "../../models/datamodels";
import { formatDateWithMonth } from "../../utils/dateFormater";

interface MessageListProps {
  type: "recent" | "older";
  isExpandedMode: boolean;
  communiques: Article[];
}

const MessageList: React.FC<MessageListProps> = ({
  type,
  isExpandedMode,
  communiques,
}) => {
  const { t } = useTranslation();

  return (
    <div className={`right__recent ${type === "recent" ? "sticky top-0" : ""}`}>
      <p className="recent">{t(type === "recent" ? "Recent" : "Older")}</p>
      <div className="message-list">
        {communiques?.slice(0, 3).map(
          (communique, index ) => (
            <Message
              key={index}
              author={communique.author_id!}
              messageDate={formatDateWithMonth(communique.createdAt!)}
              messageText={communique.content!}
              isExpandedMode={isExpandedMode}
            />
          )
        )}
      </div>
    </div>
  );
};

export default MessageList;
