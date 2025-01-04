import { useState } from 'react';
import { LuBrain, LuSearch } from 'react-icons/lu';
import { useLocation } from 'react-router-dom';
import './topNav.scss';

const TopbarAtom = () => {
  const [activeTab, setActiveTab] = useState('forYou');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const location = useLocation();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    console.log('Search Term:', event.target.value);
  };

  const getSliderStyle = () => {
    return activeTab === 'forYou' ? { left: '2.5%', width: '36%' } : { left: '52%', width: '45%' };
  };

  return (
    <>
      {location.pathname === '/feed/search' ? (
        <div className="top-bar-atom">
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Search..."
            className="search-input"
          />
          <div className="search-icon">
            <LuSearch className="h-6 w-6" />
          </div>
        </div>
      ) : (
        <div className="top-bar-atom">
          <div className="tabs">
            <button className={`tab ${activeTab === 'forYou' ? 'active' : ''}`} onClick={() => setActiveTab('forYou')}>
              For you
            </button>
            <button
              className={`tab ${activeTab === 'following' ? 'active' : ''}`}
              onClick={() => setActiveTab('following')}>
              Following
            </button>

            <div className="slider" style={getSliderStyle()}></div>
          </div>
          <button className="icon hover:text-primary-400 transition-all duration-300">
            <LuBrain className="h-6 w-6" />
          </button>
        </div>
      )}
    </>
  );
};

export default TopbarAtom;
