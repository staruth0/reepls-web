import React from "react";
import {
  heart,
  sadface,
  smile,
  thumb,
  clap,
} from "../../../assets/icons/index";

type ReactionType = "heart" | "smile" | "clap" | "thumb" | "sad";

interface UserReactionProps {
  name: string;
    image: string;
    title: string;
  reaction: ReactionType;
}

const UserReactionContainer: React.FC<UserReactionProps> = ({
  name,
  image,
  reaction,
  title
}) => {
  return (
    <div className="flex items-center justify-between border-b gap-3 px-2 py-4 hover:bg-neutral-600 rounded-md">
      <div className="flex items-center gap-3">
        <img src={image} alt={name} className="w-10 h-10 rounded-full" />
        <div>
          <span className="flex-1 font-bold text-sm">{name}</span>
          <div>{ title}</div>
        </div>
      </div>

      {reaction === "heart" && <img src={heart} className="w-5 h-5" />}
      {reaction === "thumb" && <img src={thumb} className="w-5 h-5" />}
      {reaction === "clap" && <img src={clap} className="w-5 h-5" />}
      {reaction === "sad" && <img src={sadface} className="w-5 h-5" />}
      {reaction === "smile" && <img src={smile} className="w-5 h-5" />}
    </div>
  );
};

export default UserReactionContainer;
