import React from "react";
import Message from "../atoms/message";
// import { useTranslation } from "react-i18next";
import "./index.scss";
import { Article } from "../../models/datamodels";
import { formatDateWithMonth } from "../../utils/dateFormater";
import SeeMore from "../../feature/Feed/components/SeeMore";
import { t } from "i18next";

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
         {communiques.length !== 0?      <>
           <div className="message-list space-y-3">
        {communiques?.slice(0, 2).map(
          (communique, index ) => (
            <Message
              key={index}
              author={communique.author_id!}
              messageDate={formatDateWithMonth(communique.createdAt!)}
              messageText={communique.content!}
              postID={communique._id!}
              slug={communique.slug!}
              isArticle={communique.isArticle!}
            
            />
          )
        )}
      </div>
      <SeeMore/>
      </>: <p className="px-4 text-[13px]">{t("No Comminiques avaliable")}</p>}
 
    </div>
  );
};

export default MessageList;
