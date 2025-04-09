import React, { useEffect, useReducer } from 'react';
import { LuLoader } from 'react-icons/lu';
import { useNavigate, useParams } from 'react-router-dom'; // Added useNavigate
import { toast } from 'react-toastify'; // Added toast
import Topbar from '../../../components/atoms/Topbar/Topbar';
import ProfileConfigurations from '../components/ProfileConfigurations';
import ProfileEditBody from '../components/ProfileEditBody';
import ProfileInput from '../components/ProfileInput';
import { useGetUserByUsername, useUpdateUser } from '../hooks';

// Define action types
type Action =
  | { type: 'SET_NAME'; payload: string }
  | { type: 'SET_USERNAME'; payload: string }
  | { type: 'SET_BIO'; payload: string }
  | { type: 'SET_ABOUT'; payload: string }
  | { type: 'SET_LOCATION'; payload: string }
  | { type: 'SET_ALL'; payload: State }
  | { type: 'RESET' };

interface State {
  name: string;
  username: string;
  bio: string;
  about: string;
  location: string;
}

const profileReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_NAME':
      return { ...state, name: action.payload };
    case 'SET_USERNAME':
      return { ...state, username: action.payload };
    case 'SET_BIO':
      return { ...state, bio: action.payload };
    case 'SET_ABOUT':
      return { ...state, about: action.payload };
    case 'SET_LOCATION':
      return { ...state, location: action.payload };
    case 'SET_ALL':
      return { ...action.payload };
    case 'RESET':
      return { name: '', username: '', bio: '', about: '', location: '' };
    default:
      return state;
  }
};

const EditProfile: React.FC = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user } = useGetUserByUsername(username || '');
  const { mutate, isPending, isError, isSuccess, error } = useUpdateUser();

  const [state, dispatch] = useReducer(profileReducer, {
    name: '',
    username: '',
    bio: '',
    about: '',
    location: '',
  });

  useEffect(() => {
    if (!user) return;
    dispatch({
      type: 'SET_ALL',
      payload: {
        name: user.name || user.username || '', // Use name if available
        username: user.username || '',
        bio: user.bio || '',
        about: user.about || '',
        location: user.address || '',
      },
    });
  }, [user]);

  // Add effect to handle mutation status
  useEffect(() => {
    if (isSuccess) {
      toast.success('Profile updated successfully!');
      navigate(`/profile/${state.username}`);
    }
    if (isError) {
      console.error('Update error:', error);
      toast.error(`Failed to update profile: ${error?.message}`);
    }
  }, [isSuccess, isError, error, navigate, state.username]);

  const handleUpdateProfile = () => {
    console.log('Button clicked, updating with:', state);
    mutate({
      username: state.username,
      name: state.name,
      bio: state.bio,
      about: state.about,
      address: state.location,
    });
  };

  return (
    <div className="lg:grid grid-cols-[4fr_1.66fr]">
      <div className="profile lg:border-r-[1px] min-h-screen border-neutral-500">
        <Topbar>
          <p>Profile</p>
        </Topbar>
        <div className="profile__content sm:px-5 md:px-10 lg:px-20 ">
          <ProfileEditBody user={user!}>
            <div className="flex flex-col w-full mt-8">
              <ProfileInput
                label="Name"
                value={state.name}
                onChange={(e) => dispatch({ type: 'SET_NAME', payload: e.target.value })}
                placeholder="Enter your name"
              />
              <div className="bg-neutral-700 rounded-[5px] px-2 py-1 flex flex-col gap-1 mt-3">
                <label className="text-neutral-400 text-[15px]">{'Username'}</label>
                <div className="flex items-center gap-0">
                  <span className="text-primary-200 text-[15px]">{'reepls.com/profile/'}</span>
                  <input
                    type="text"
                    className="w-full bg-transparent text-primary-400 text-[16px] outline-none"
                    maxLength={40}
                    value={state.username}
                    onChange={(e) =>
                      dispatch({ type: 'SET_USERNAME', payload: e.target.value.replace(/[^a-zA-Z0-9_]/g, '') })
                    }
                    placeholder="change your username"
                  />
                </div>
              </div>
              <ProfileInput
                label="Bio"
                value={state.bio}
                onChange={(e) => dispatch({ type: 'SET_BIO', payload: e.target.value })}
                placeholder="Enter your bio"
              />
              <ProfileInput
                label="About"
                value={state.about}
                onChange={(e) => dispatch({ type: 'SET_ABOUT', payload: e.target.value })}
                placeholder="Tell us about yourself"
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
                {isPending && <LuLoader className="animate-spin text-foreground inline-block mx-4" />}
                {isPending ? 'Saving..' : 'Save'}
              </button>
            </div>
          </ProfileEditBody>
        </div>
      </div>
      <div className="profile__configurationz bg-background hidden lg:block">
        <ProfileConfigurations />
      </div>
    </div>
  );
};

export default EditProfile;
