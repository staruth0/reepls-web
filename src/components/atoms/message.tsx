import "./rightNav.scss";
import checkMarkIcon from "../../assets/icons/checkmark.svg";
import { useNavigate } from "react-router-dom";

interface messageTypes {
  profile: string;
  Name: string;
  description: string;
  messageDate: string;
  messageText: string;

  isExpandedMode: boolean;

}

const Message = (props: messageTypes) => {
  const navigate = useNavigate();

  const handleClick = () => { 
    navigate('/posts/communique')
  }
  return (
    <div className="message-atom cursor-pointer" onClick={handleClick} >
      <header>
        <span className="header-profile"> {props.profile} </span>
        <div className="header-content">
          <div>
            <h2>{props.Name}</h2>
            <img src={checkMarkIcon} alt="check-mark" />
          </div>
          <p className={` ${props.isExpandedMode ? "single__line__text" : null}`}>
            {props.description}
          </p>
          <span className="message-date">{props.messageDate}</span>
        </div>
      </header>

      {!props.isExpandedMode && (
        <div className="message-text">{props.messageText}</div>
      )}
    </div>
  );
};

export default Message;
