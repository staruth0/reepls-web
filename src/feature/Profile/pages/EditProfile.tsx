import React, { useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import Topbar from "../../../components/atoms/Topbar/Topbar";
import ProfileConfigurations from "../components/ProfileConfigurations";
import ProfileInput from "../components/ProfileInput";
import { useGetUserByUsername, useUpdateUser } from "../hooks";
import { toast } from "react-toastify"; // Import toast
import ProfileEditBody from "../components/ProfileEditBody";
import { LuLoader } from 'react-icons/lu';

// Define action types
type Action =
  | { type: "SET_NAME"; payload: string }
  | { type: "SET_BIO"; payload: string }
  | { type: "SET_ABOUT"; payload: string }
  | { type: "SET_LOCATION"; payload: string }
  | { type: "SET_ALL"; payload: State }
  | { type: "RESET" };

// Define state structure
interface State {
  name: string;
  bio: string;
  about: string;
  location: string;
}

// Reducer function
const profileReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_BIO":
      return { ...state, bio: action.payload };
    case "SET_ABOUT":
      return { ...state, about: action.payload };
    case "SET_LOCATION":
      return { ...state, location: action.payload };
    case "SET_ALL":
      return { ...action.payload };
    case "RESET":
      return { name: "", bio: "", about: "", location: "" };
    default:
      return state;
  }
};

const EditProfile: React.FC = () => {
  const { username } = useParams();
  const { user } = useGetUserByUsername(username || "");
  const { mutate, isPending, isError, isSuccess } = useUpdateUser();

  // Initialize reducer
  const [state, dispatch] = useReducer(profileReducer, {
    name: "",
    bio: "",
    about: "",
    location: "",
  });

  // Update state when data is fetched
  useEffect(() => {
    if (!user) return;
    dispatch({
      type: "SET_ALL",
      payload: {
        name: user.username || "",
        bio: user.bio || "",
        about: user.about || "", // Updated from title to about
        location: user.address || "",
      },
    });
  }, [user]);

  // Show toast notifications on success or error
  useEffect(() => {
    if (isSuccess) {
      toast.success("Profile updated successfully!");
    }
    if (isError) {
      toast.error("Failed to update profile. Try again.");
    }
  }, [isSuccess, isError]);

  // Handle profile update
  const handleUpdateProfile = () => {
    mutate({
      username: state.name,
      bio: state.bio,
      about: state.about, // Updated from title to about
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
          <ProfileEditBody>
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
                label="About" // Updated from Occupation to About
                value={state.about}
                onChange={
                  (e) =>
                    dispatch({ type: "SET_ABOUT", payload: e.target.value }) // Updated from SET_OCCUPATION to SET_ABOUT
                }
                placeholder="Tell us about yourself"
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
                {isPending && <LuLoader className="animate-spin text-foreground inline-block mx-4" /> }
                {isPending ? "Saving.." : "Save"}

              </button>
            </div>
          </ProfileEditBody>
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
