import React from 'react';
import { LuBadgeCheck, LuEllipsisVertical } from 'react-icons/lu';
import { profileAvatar } from '../../../assets/icons';
import { User } from '../../../models/datamodels';

interface AuthorComponentprobs{
  user: User;
}

const AuthorComponent: React.FC<AuthorComponentprobs> = ({ user }) => {
  return (
    <div className="flex items-center gap-2">
      <div>
        <img src={profileAvatar} alt="pprofiles" />
      </div>
      <div className=" text-neutral-50 w-full flex items-center justify-between">
        <div>
          <div className="text-[16px] flex items-center font-semibold">
            {user?.username}
            <span>
             { user?.is_verified_writer && <LuBadgeCheck className="size-4 text-primary-400" />}
            </span>
          </div>
          <div className="text-[13px] line-clamp-1">{user?.bio}</div>
        </div>
        <LuEllipsisVertical className="size-4" />
      </div>
    </div>
  );
};

export default AuthorComponent;
