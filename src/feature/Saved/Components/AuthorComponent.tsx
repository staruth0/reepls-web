import React from 'react';
import { LuBadgeCheck, LuEllipsisVertical } from 'react-icons/lu';
import { profileAvatar } from '../../../assets/icons';

const AuthorComponent: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <div>
        <img src={profileAvatar} alt="pprofiles" />
      </div>
      <div className=" text-neutral-50 w-full flex items-center justify-between">
        <div>
          <div className="text-[16px] flex items-center font-semibold">
            Thiago ALcantara{' '}
            <span>
              {' '}
              <LuBadgeCheck className="size-4" />
            </span>
          </div>
          <div className="text-[13px] ">Writer@ CMR magazine....</div>
        </div>
        <LuEllipsisVertical className="size-4" />
      </div>
    </div>
  );
};

export default AuthorComponent;
