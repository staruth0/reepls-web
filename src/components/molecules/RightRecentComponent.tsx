import React from 'react';
import MessageList from './MessageList';
import './index.scss';
import { Article } from '../../models/datamodels';

interface RightRecentProps {

  communiqueList:Article[];
}

const RightRecentComponent: React.FC<RightRecentProps> = ({ communiqueList}) => {
  return <MessageList type="recent"  communiques={communiqueList} />;
};

export default RightRecentComponent;
