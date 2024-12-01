import React from "react";
import Message from "../atoms/message";
import "./index.scss";

const RightOlderComponent: React.FC = () => {
  return (
    <div className="right__recent older">
      <p className="recent">Older</p>
      <div className="message-list">
        <Message
          profile={"E"}
          Name={"ENEO"}
          description={"Writer @ CMR FA magazine..."}
          messageDate={"20 Oct"}
          messageText={"Urgent notice regarding power outage this week."}
        />
        <Message
          profile={"M"}
          Name={"MINPOSTEL"}
          description={"Writer @ Cybersecurity Updates..."}
          messageDate={"19 Oct"}
          messageText={
            "Join us for a workshop on combating online fraud and securing your digital presence."
          }
        />
        <Message
          profile={"H"}
          Name={"Health Ministry"}
          description={"Writer @ Public Health Bulletins..."}
          messageDate={"18 Oct"}
          messageText={
            "Vaccination campaigns are ongoing. Visit your nearest health center for free immunization."
          }
        />
      </div>
    </div>
  );
};

export default RightOlderComponent;
