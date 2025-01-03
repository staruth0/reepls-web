import React from 'react';
import Message from '../atoms/Message';
import './index.scss';

interface rightTopProbs {
  isExpandedMode: boolean;
}

const RightOlderComponent: React.FC<rightTopProbs> = ({ isExpandedMode }) => {
  return (
    <div className="right__recent older">
      <p className="recent">Older</p>
      <div className="message-list">
        <Message
          profile={'E'}
          Name={'ENEO'}
          description={'Writer @ CMR FA magazine...'}
          messageDate={'20 Oct'}
          messageText={'Urgent notice regarding power outage this week.'}
          isExpandedMode={isExpandedMode}
        />
        <Message
          profile={'M'}
          Name={'MINPOSTEL'}
          description={'Writer @ Cybersecurity Updates...'}
          messageDate={'19 Oct'}
          messageText={'Join us for a workshop on combating online fraud and securing your digital presence.'}
          isExpandedMode={isExpandedMode}
        />
        <Message
          profile={'H'}
          Name={'Health Ministry'}
          description={'Writer @ Public Health Bulletins...'}
          messageDate={'18 Oct'}
          messageText={'Vaccination campaigns are ongoing. Visit your nearest health center for free immunization.'}
          isExpandedMode={isExpandedMode}
        />
      </div>
    </div>
  );
};

export default RightOlderComponent;
