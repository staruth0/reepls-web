import React from 'react';
import MessageList from './MessageList';
import './index.scss';

interface RightOlderProps {
  isExpandedMode: boolean;
}

const RightOlderComponent: React.FC<RightOlderProps> = ({ isExpandedMode }) => {
  return <MessageList type="older" isExpandedMode={isExpandedMode} />;
};

export default RightOlderComponent;
