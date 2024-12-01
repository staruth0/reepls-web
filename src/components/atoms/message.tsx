import "./rightNav.scss";
import checkMarkIcon from "../../assets/icons/checkmark.svg";

interface messageTypes {
  profile: string;
  Name: string;
  description: string;
  messageDate: string;
  messageText: string;
}

const Message = (props: messageTypes) => {
  return (
    <div className="message-atom">
      <header>
          <span className="header-profile"> {props.profile} </span>
          <div className="header-content">
            <div>
              <h2>{props.Name}</h2>
              <img src={checkMarkIcon} alt="check-mark" />
            </div>
            <p>{props.description}</p>
            <span className="message-date">{props.messageDate}</span>
          </div>
      </header>

      <div className="message-text">{props.messageText}</div>
    </div>
  );
};

export default Message;
