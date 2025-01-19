import React, { useReducer } from "react";
import ProfileBody from "../components/ProfileBody";
import ProfileInput from "../components/ProfileInput";
import Topbar from "../../../components/atoms/Topbar/Topbar";
import ProfileConfigurations from "../components/ProfileConfigurations";
import { useUpdateUser } from "../hooks";

type Action =
  | { type: "SET_NAME"; payload: string }
  | { type: "SET_BIO"; payload: string }
  | { type: "SET_OCCUPATION"; payload: string }
  | { type: "SET_LOCATION"; payload: string }
  | { type: "RESET" };


interface State {
  name: string;
  bio: string;
  Job: string;
  location: string;
}

// Reducer function to handle state updates
const profileReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_BIO":
      return { ...state, bio: action.payload };
    case "SET_OCCUPATION":
      return { ...state, Job: action.payload };
    case "SET_LOCATION":
      return { ...state, location: action.payload };
    case "RESET":
      return { name: "", bio: "", Job: "", location: "" };
    default:
      return state;
  }
};

const EditProfile: React.FC = () => {
  // Initialize reducer
  const [state, dispatch] = useReducer(profileReducer, {
    name: "",
    bio: "",
    Job: "",
    location: "",
  });

  const { mutate, isPending, isError, isSuccess } = useUpdateUser();

  
  const handleUpdateProfile = () => {
    mutate({
      username: state.name,
      bio: state.bio,
      Job: state.Job,
      address: state.location,
    });
  };

  return (
    <div className="grid grid-cols-[4fr_1.66fr]">
      {/* Profile Section */}
      <div className="profile border-r-[1px] border-neutral-500">
        <Topbar>
          <p>Profile</p>
        </Topbar>

        {/* Profile Content */}
        <div className="profile__content px-20">
          <ProfileBody>
            <div className="flex flex-col w-full mt-8">
              <ProfileInput
                label="Name"
                value={state.name}
                onChange={(e) =>
                  dispatch({ type: "SET_NAME", payload: e.target.value })
                }
                placeholder="Enter your name"
              />
              <ProfileInput
                label="Bio"
                value={state.bio}
                onChange={(e) =>
                  dispatch({ type: "SET_BIO", payload: e.target.value })
                }
                placeholder="Enter your bio"
              />
              <ProfileInput
                label="Occupation"
                value={state.Job}
                onChange={(e) =>
                  dispatch({ type: "SET_OCCUPATION", payload: e.target.value })
                }
                placeholder="Enter your occupation"
              />
              <ProfileInput
                label="Location"
                value={state.location}
                onChange={(e) =>
                  dispatch({ type: "SET_LOCATION", payload: e.target.value })
                }
                placeholder="Enter your location"
              />

              <button
                className="outline-none border-none bg-primary-400 text-white px-4 py-2 mt-8 rounded-full self-center cursor-pointer w-[320px] h-[40px] flex justify-center items-center"
                onClick={handleUpdateProfile}
                disabled={isPending}
              >
                {isPending ? "Saving..." : "Save"}
              </button>

              {isSuccess && (
                <p className="text-green-500 mt-2">
                  Profile updated successfully!
                </p>
              )}
              {isError && (
                <p className="text-red-500 mt-2">
                  Failed to update profile. Try again.
                </p>
              )}
            </div>
          </ProfileBody>
        </div>
      </div>

      {/* Configurations Section */}
      <div className="profile__configurationz">
        <ProfileConfigurations />
      </div>
    </div>
  );
};

export default EditProfile;
