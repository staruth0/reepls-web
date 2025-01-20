import React, { useReducer, useEffect } from "react";
import ProfileBody from "../components/ProfileBody";
import ProfileInput from "../components/ProfileInput";
import Topbar from "../../../components/atoms/Topbar/Topbar";
import ProfileConfigurations from "../components/ProfileConfigurations";
import { useGetUserById, useUpdateUser } from "../hooks";
import { useParams } from "react-router-dom";

// Define action types
type Action =
  | { type: "SET_NAME"; payload: string }
  | { type: "SET_BIO"; payload: string }
  | { type: "SET_OCCUPATION"; payload: string }
  | { type: "SET_LOCATION"; payload: string }
  | { type: "SET_ALL"; payload: State }
  | { type: "RESET" };

// Define state structure
interface State {
  name: string;
  bio: string;
  job: string;
  location: string;
}

// Reducer function
const profileReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_BIO":
      return { ...state, bio: action.payload };
    case "SET_OCCUPATION":
      return { ...state, job: action.payload };
    case "SET_LOCATION":
      return { ...state, location: action.payload };
    case "SET_ALL":
      return { ...action.payload };
    case "RESET":
      return { name: "", bio: "", job: "", location: "" };
    default:
      return state;
  }
};

const EditProfile: React.FC = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useGetUserById(id || "");
  const { mutate, isPending, isError, isSuccess } = useUpdateUser();

  // Initialize reducer
  const [state, dispatch] = useReducer(profileReducer, {
    name: "",
    bio: "",
    job: "",
    location: "",
  });

  // Update state when data is fetched
  useEffect(() => {
    if (data) {
      dispatch({
        type: "SET_ALL",
        payload: {
          name: data.username || "",
          bio: data.bio || "",
          job: data.job || "",
          location: data.address || "",
        },
      });
    }
  }, [data]);

  // Handle profile update
  const handleUpdateProfile = () => {
    mutate({
      username: state.name,
      bio: state.bio,
      Job: state.job,
      address: state.location,
    });
  };

  if (isLoading) return <p>Loading profile...</p>;
  if (error) return <p>Error fetching profile</p>;

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
                value={state.job}
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
