import React, { useState } from 'react';
import '../styles/notifications.scss';

const Notifications: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All');

  const tabs = ['All', 'Mentions', 'Comments'];
  const notifications = {
    All: ['You have a new follower', 'Your post was liked', 'New comment on your post'],
    Mentions: ['@user mentioned you in a comment'],
    Comments: ['New comment on your post'],
  };

  const getSliderStyle = () => {
    const index = tabs.indexOf(activeTab);
    return {
      left: `${index * 33.33}%`,
    };
  };

  return (
    <div className="notifications-container">
      <div className="tabs">
        {tabs.map((tab) => (
          <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab}
          </button>
        ))}
        <div className="slider" style={getSliderStyle()}></div>
      </div>

      <div className="content">
        {notifications[activeTab as keyof typeof notifications].map((notification, index) => (
          <p key={index} className="notification">
            {notification}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
