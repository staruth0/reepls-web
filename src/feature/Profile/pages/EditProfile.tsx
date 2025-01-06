import React, { useState } from "react";
import ProfileBody from "../components/ProfileBody";
import ProfileInput from "../components/ProfileInput";
import Topbar from "../../../components/atoms/Topbar/Topbar";
import ProfileConfigurations from "../components/ProfileConfigurations";

const EditProfile: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [occupation, setOccupation] = useState<string>("");
  const [location, setLocation] = useState<string>("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBio(e.target.value);
  };

  const handleOccupationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOccupation(e.target.value);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  };

  return (
    <div className={`grid grid-cols-[4fr_1.66fr] `}>
      {/* profile Section */}
      <div className="profile border-r-[1px] border-neutral-500 ">
        <Topbar>
          <p>Profile</p>
        </Topbar>

        {/* profile content */}
        <div className="profile__content px-20">
          <ProfileBody>
            <div
              className="flex flex-col  w-full mt-8ǀ
"
            >
              <ProfileInput
                label="Name"
                value={name}
                onChange={handleNameChange}
                placeholder="Enter your name"
              />
              <ProfileInput
                label="Bio"
                value={bio}
                onChange={handleBioChange}
                placeholder="Enter your bio"
              />
              <ProfileInput
                label="Occupation"
                value={occupation}
                onChange={handleOccupationChange}
                placeholder="Enter your occupation"
              />
              <ProfileInput
                label="Location"
                value={location}
                onChange={handleLocationChange}
                placeholder="Enter your location"
              />

              <button
                className="outline-none border-none bg-primary-400 text-white px-4 py-2 mt-8 rounded-full self-center cursor-pointer w-[320px] h-[40px] flex justify-center items-centerǀ
 "
              >
                Save
              </button>
            </div>
          </ProfileBody>
        </div>
      </div>

      {/*configurations Section */}
      <div className="profile__configurationz">
        <ProfileConfigurations />
      </div>
    </div>
  );
};

export default EditProfile;
