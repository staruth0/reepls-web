import React from "react";
import { ellipsisVertical, profileAvatar, VerifiedIcon } from "../../../assets/icons";

const AuthorComponent: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <div>
        <img src={profileAvatar} alt="pprofiles" />
      </div>
      <div className=" text-neutral-50 w-full flex items-center justify-between">
        <div>
          <div className="text-[16px] flex items-center font-semibold">
            Thiago ALcantara{" "}
            <span>
              {" "}
              <img src={VerifiedIcon} alt="v_icon" />
            </span>
          </div>
          <div className="text-[13px] ">Writer@ CMR magazine....</div>
              </div>
              <img src={ellipsisVertical} alt="ellipses" />
      </div>
    </div>
  );
};

export default AuthorComponent;
