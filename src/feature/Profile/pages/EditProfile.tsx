import React, { useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import Topbar from '../../../components/atoms/Topbar/Topbar';
import ProfileBody from '../components/ProfileBody';
import ProfileConfigurations from '../components/ProfileConfigurations';
import ProfileInput from '../components/ProfileInput';
import { useGetUserById, useUpdateUser } from '../hooks';

// Define action types
type Action =
  | { type: 'SET_NAME'; payload: string }
  | { type: 'SET_BIO'; payload: string }
  | { type: 'SET_OCCUPATION'; payload: string }
  | { type: 'SET_LOCATION'; payload: string }
  | { type: 'SET_ALL'; payload: State }
  | { type: 'RESET' };

// Define state structure
interface State {
  name: string;
  bio: string;
  title: string;
  location: string;
}

// Reducer function
const profileReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_NAME':
      return { ...state, name: action.payload };
    case 'SET_BIO':
      return { ...state, bio: action.payload };
    case 'SET_OCCUPATION':
      return { ...state, title: action.payload };
    case 'SET_LOCATION':
      return { ...state, location: action.payload };
    case 'SET_ALL':
      return { ...action.payload };
    case 'RESET':
      return { name: '', bio: '', title: '', location: '' };
    default:
      return state;
  }
};

const EditProfile: React.FC = () => {
  const { userUid } = useParams();
  const { user } = useGetUserById(userUid || '');
  const { mutate, isPending, error, isError, isSuccess } = useUpdateUser();

  // Initialize reducer
  const [state, dispatch] = useReducer(profileReducer, {
    name: '',
    bio: '',
    title: '',
    location: '',
  });

  // Update state when data is fetched
  useEffect(() => {
    if (!user) return;
    dispatch({
      type: 'SET_ALL',
      payload: {
        name: user.username || '',
        bio: user.bio || '',
        title: user.title || '',
        location: user.address || '',
      },
    });
  }, [user]);

  // Handle profile update
  const handleUpdateProfile = () => {
    mutate({
      username: state.name,
      bio: state.bio,
      title: state.title,
      address: state.location,
    });
  };

  if (isPending) return <p>Loading profile...</p>;
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
                onChange={(e) => dispatch({ type: 'SET_NAME', payload: e.target.value })}
                placeholder="Enter your name"
              />
              <ProfileInput
                label="Bio"
                value={state.bio}
                onChange={(e) => dispatch({ type: 'SET_BIO', payload: e.target.value })}
                placeholder="Enter your bio"
              />
              <ProfileInput
                label="Occupation"
                value={state.title}
                onChange={(e) => dispatch({ type: 'SET_OCCUPATION', payload: e.target.value })}
                placeholder="Enter your occupation"
              />
              <ProfileInput
                label="Location"
                value={state.location}
                onChange={(e) => dispatch({ type: 'SET_LOCATION', payload: e.target.value })}
                placeholder="Enter your location"
              />

              <button
                className="outline-none border-none bg-primary-400 text-white px-4 py-2 mt-8 rounded-full self-center cursor-pointer w-[320px] h-[40px] flex justify-center items-center"
                onClick={handleUpdateProfile}
                disabled={isPending}>
                {isPending ? 'Saving...' : 'Save'}
              </button>

              {isSuccess && <p className="text-green-500 mt-2">Profile updated successfully!</p>}
              {isError && <p className="text-red-500 mt-2">Failed to update profile. Try again.</p>}
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
