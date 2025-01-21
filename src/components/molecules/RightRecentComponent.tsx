import React from 'react';
import MessageList from './MessageList';
import './index.scss';
import { Article } from '../../models/datamodels';

interface RightRecentProps {
  isExpandedMode: boolean;
  communiqueList:Article[];
}

const RightRecentComponent: React.FC<RightRecentProps> = ({ isExpandedMode , communiqueList}) => {
  return <MessageList type="recent" isExpandedMode={isExpandedMode} communiques={communiqueList} />;
};

export default RightRecentComponent;
