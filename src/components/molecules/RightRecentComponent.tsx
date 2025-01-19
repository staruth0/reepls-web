import React from 'react';
import MessageList from './MessageList';
import './index.scss';

interface RightRecentProps {
  isExpandedMode: boolean;
}

const RightRecentComponent: React.FC<RightRecentProps> = ({ isExpandedMode }) => {
  return <MessageList type="recent" isExpandedMode={isExpandedMode} />;
};

export default RightRecentComponent;
