import React, { useState } from 'react';
import { LuBadgeCheck, LuEllipsisVertical } from 'react-icons/lu';
import { UserPlus, EyeOff,  Flag, X } from 'lucide-react'; 
import { profileAvatar } from '../../../assets/icons';
import { User } from '../../../models/datamodels';

interface AuthorComponentProps {
  user: User;
}

const AuthorComponent: React.FC<AuthorComponentProps> = ({ user }) => {
  const [showMenu, setShowMenu] = useState(false); 


  const handleFollow = () => {
    console.log(`Follow ${user.username}`);
    setShowMenu(false); 
  };

  const handleBlock = () => {
    console.log(`Block ${user.username}`);
    setShowMenu(false);
  };

  const handleViewProfile = () => {
    console.log(`View profile of ${user.username}`);
    setShowMenu(false);
  };

  const handleReport = () => {
    console.log(`Report ${user.username}`);
    setShowMenu(false);
  };

  return (
    <div className="flex items-center gap-2 relative"> 
      <div>
        <img src={profileAvatar} alt="profiles" />
      </div>
      <div className="text-neutral-50 w-full flex items-center justify-between">
        <div>
          <div className="text-[16px] flex items-center font-semibold">
            {user?.username}
            <span>
              {user?.is_verified_writer && <LuBadgeCheck className="size-4 text-primary-400" />}
            </span>
          </div>
          <div className="text-[13px] line-clamp-1">{user?.bio}</div>
        </div>
     
        {showMenu ? (
          <X className="size-4 cursor-pointer" onClick={() => setShowMenu(false)} />
        ) : (
          <LuEllipsisVertical className="size-4 cursor-pointer" onClick={() => setShowMenu(true)} />
        )}
      </div>

      {/* Dropdown Menu */}
      {showMenu && (
        <>
          {/* Overlay to close menu when clicking outside */}
          <div
            className="fixed inset-0 bg-black opacity-0 z-40"
            onClick={() => setShowMenu(false)}
          ></div>
          {/* Menu content */}
          <div className="absolute right-0 top-10 bg-neutral-800 shadow-md rounded-md p-2 w-52 text-neutral-50 z-50">
            <div
              className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-700 cursor-pointer"
              onClick={handleFollow}
            >
              <UserPlus size={18} className="text-neutral-500" />
              <div>Follow</div>
            </div>
            <div
              className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-700 cursor-pointer"
              onClick={handleBlock}
            >
              <EyeOff size={18} className="text-neutral-500" />
              <div>Block</div>
            </div>
            <div
              className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-700 cursor-pointer"
              onClick={handleViewProfile}
            >
              <UserPlus size={18} className="text-neutral-500" />
              <div>View Profile</div>
            </div>
            <div
              className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-700 cursor-pointer"
              onClick={handleReport}
            >
              <Flag size={18} className="text-neutral-500" />
              <div>Report User</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AuthorComponent;