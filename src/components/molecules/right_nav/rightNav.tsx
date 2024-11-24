import React from 'react';
import './rightNav.scss';
import Message from '../../atoms/message';

const RightNav = () => {
  return (
    <div>
      <Message
       profile={'E'}
       Name={'ENEO'}
       description={'Writer @ CMR FA magazine...'} 
       messageDate={'20 Oct'}
       messageText={'Urgent notice regarding power outage this week.'}/>
    </div>
  )
}

export default RightNav
