import Message from '../../atoms/Message';
import './rightNav.scss';

const RightNav = () => {
  return (
    <div>
      <Message
        profile={'E'}
        Name={'ENEO'}
        description={'Writer @ CMR FA magazine...'}
        messageDate={'20 Oct'}
        messageText={'Urgent notice regarding power outage this week.'}
        isExpandedMode={false}
      />
    </div>
  );
};

export default RightNav;
