import React from "react";
import { heart,sadface,smile,thumb,clap} from "../../../assets/icons/index";
import { User } from "../../../models/datamodels";



interface UserReactionProps {
    user: User ;
    type: string;
}

const UserReactionContainer: React.FC<UserReactionProps> = ({ user, type }) => {

  return (
    <div className="flex items-center justify-between border-b gap-3 px-2 py-4 hover:bg-neutral-600 rounded-md">
      <div className="flex items-center gap-3">
        <div className="size-9 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-[13px]">
          {user?.username?.charAt(0)}
        </div>
        <div>
          <span className="flex-1 font-bold text-sm">{user?.username}</span>
          <div>{user?.bio}</div>
        </div>
      </div>

      {type === "love" && <img src={heart} className="w-5 h-5" />}
      {type === "like" && <img src={thumb} className="w-5 h-5" />}
      {type === "clap" && <img src={clap} className="w-5 h-5" />}
      {type === "cry" && <img src={sadface} className="w-5 h-5" />}
      {type === "smile" && <img src={smile} className="w-5 h-5" />}
    </div>
  );
};

export default UserReactionContainer;
