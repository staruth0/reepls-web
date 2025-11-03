import React, { useEffect, useReducer } from 'react';
import { LuArrowLeft, LuLoader } from 'react-icons/lu';
import { useNavigate, useParams } from 'react-router-dom'; // Added useNavigate
import { toast } from 'react-toastify'; // Added toast
import Topbar from '../../../components/atoms/Topbar/Topbar';
import ProfileConfigurations from '../components/ProfileConfigurations';
import ProfileEditBody from '../components/ProfileEditBody';
import ProfileInput from '../components/ProfileInput';
import { useGetUserByUsername, useUpdateUser } from '../hooks';
import { useTranslation } from 'react-i18next';
import { updateUsernameInStorage } from '../../Auth/api/Encryption';
import MainContent from '../../../components/molecules/MainContent';
import { UserRole } from '../../../models/datamodels';
import { 
  validateProfileName, 
  validateProfileUsername, 
  validateProfileBio, 
  validateProfileAbout, 
  validateProfileLocation,
  LIMITS
} from '../../../utils/validation';
// import { profile } from '../../../assets/icons';

// Define action types
type Action =
  | { type: 'SET_NAME'; payload: string }
  | { type: 'SET_USERNAME'; payload: string }
  | { type: 'SET_BIO'; payload: string }
  | { type: 'SET_ABOUT'; payload: string }
  | { type: 'SET_LOCATION'; payload: string }
  | { type: 'SET_ROLE'; payload: UserRole }
  | { type: 'SET_ALL'; payload: State }
  | { type: 'RESET' };

interface State {
  name: string;
  username: string;
  bio: string;
  about: string;
  location: string;
  role: UserRole;
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
    case 'SET_ROLE':
      return { ...state, role: action.payload };
    case 'SET_ALL':
      return { ...action.payload };
    case 'RESET':
      return { name: '', username: '', bio: '', about: '', location: '', role: UserRole.Reader };
    default:
      return state;
  }
};

const EditProfile: React.FC = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user } = useGetUserByUsername(username || '');
  const { mutate, isPending, isError, isSuccess, error } = useUpdateUser();

  const {t} = useTranslation();

  const [state, dispatch] = useReducer(profileReducer, {
    name: '',
    username: '',
    bio: '',
    about: '',
    location: '',
    role: UserRole.Reader,
  });

  useEffect(() => {
    if (!user) return;
    dispatch({
      type: 'SET_ALL',
      payload: {
        name: user.name || '', // Use name if available
        username: user.username || '',
        bio: user.bio || '',
        about: user.about || '',
        location: user.address || '',
        role: user.role || UserRole.Reader,
      },
    });
  }, [user]);

  useEffect(() => {
    if (isSuccess) {
    
      const updateSuccess = updateUsernameInStorage(state.username);
      if (!updateSuccess) {
        void error;
     
      }
      
      toast.success(t("profile.alerts.profileSuccess"));
      navigate(`/profile/${state.username}`);
    }
    if (isError) {
      void error;
      toast.error(`${t("profile.alerts.profileFailed")}: ${error?.message}`);
    }
  }, [isSuccess, isError, error, navigate, state.username, t]);

  const handleUpdateProfile = () => {
    // Validate all fields
    const nameValidation = validateProfileName(state.name);
    if (!nameValidation.isValid) {
      toast.error(nameValidation.message, { autoClose: 3000 });
      return;
    }

    const usernameValidation = validateProfileUsername(state.username);
    if (!usernameValidation.isValid) {
      toast.error(usernameValidation.message, { autoClose: 3000 });
      return;
    }

    const bioValidation = validateProfileBio(state.bio);
    if (!bioValidation.isValid) {
      toast.error(bioValidation.message, { autoClose: 3000 });
      return;
    }

    const aboutValidation = validateProfileAbout(state.about);
    if (!aboutValidation.isValid) {
      toast.error(aboutValidation.message, { autoClose: 3000 });
      return;
    }

    const locationValidation = validateProfileLocation(state.location);
    if (!locationValidation.isValid) {
      toast.error(locationValidation.message, { autoClose: 3000 });
      return;
    }

    mutate({
      username: state.username,
      name: state.name,
      bio: state.bio,
      about: state.about,
      address: state.location,
      role: state.role,
    });
  };

  return (
    <MainContent> 
    <div className="lg:grid grid-cols-[4fr_1.66fr]">
      <div className="profile lg:border-r-[1px] min-h-screen border-neutral-500">
        <Topbar>
          <div className="flex items-center gap-2"><button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-neutral-700 rounded-full transition-colors"
            >
              <LuArrowLeft className="size-5 text-neutral-300" />
            </button>
          <p className="text-neutral-50 font-semibold">{t("Profile Edit")}</p>

          </div>
        
        </Topbar>
        <div className="profile__content sm:px-5 md:px-10 lg:px-20 ">
          <ProfileEditBody user={user!}>
            <div className="flex flex-col w-full mt-8">
              <ProfileInput
                label={t("profile.name")}
                value={state.name}
                onChange={(e) => dispatch({ type: 'SET_NAME', payload: e.target.value })}
                placeholder={t("profile.enterName")}
                maxLength={LIMITS.PROFILE.NAME_MAX_CHARS}
                showCharCount={true}
              />
              <div className="bg-neutral-700 rounded-[5px] px-2 py-1 flex flex-col gap-1 mt-3">
                <div className="flex justify-between items-center">
                  <label className="text-neutral-400 text-[15px]">{'Username'}</label>
                  <span className={`text-xs ${state.username.length > LIMITS.PROFILE.USERNAME_MAX_CHARS ? 'text-red-500' : state.username.length > LIMITS.PROFILE.USERNAME_MAX_CHARS * 0.8 ? 'text-yellow-500' : 'text-gray-400'}`}>
                    {state.username.length}/{LIMITS.PROFILE.USERNAME_MAX_CHARS}
                  </span>
                </div>
                <div className="flex items-center gap-0">
                  <span className="text-primary-200 text-[15px]">{'reepls.com/profile/'}</span>
                  <input
                    type="text"
                    className="w-full bg-transparent text-primary-400 text-[16px] outline-none"
                    maxLength={LIMITS.PROFILE.USERNAME_MAX_CHARS}
                    value={state.username}
                    onChange={(e) => {
                      const filteredValue = e.target.value.replace(/[^a-zA-Z0-9_]/g, '');
                      if (filteredValue.length <= LIMITS.PROFILE.USERNAME_MAX_CHARS) {
                        dispatch({ type: 'SET_USERNAME', payload: filteredValue });
                      }
                    }}
                    placeholder={t("profile.changeUsername")}
                  />
                </div>
              </div>
              <ProfileInput
                label={t("profile.bio")}
                value={state.bio}
                onChange={(e) => dispatch({ type: 'SET_BIO', payload: e.target.value })}
                placeholder={t("profile.enterBio")}
                maxLength={LIMITS.PROFILE.BIO_MAX_CHARS}
                showCharCount={true}
              />
              <ProfileInput
                label={t("profile.about")}
                value={state.about}
                onChange={(e) => dispatch({ type: 'SET_ABOUT', payload: e.target.value })}
                placeholder={t("profile.aboutYou")}
                maxLength={LIMITS.PROFILE.ABOUT_MAX_CHARS}
                showCharCount={true}
                isTextarea={true}
              />
              <ProfileInput
                label={t("profile.location")}
                value={state.location}
                onChange={(e) => dispatch({ type: 'SET_LOCATION', payload: e.target.value })}
                placeholder={t("profile.enterLocation")}
                maxLength={LIMITS.PROFILE.LOCATION_MAX_CHARS}
                showCharCount={true}
              />
              <div className="bg-neutral-700 rounded-[5px] px-2 py-1 flex flex-col gap-1 mt-3">
                <div className="flex justify-between items-center">
                  <label className="text-neutral-400 text-[15px]">{t("profile.role") || "Role"}</label>
                </div>
                <div className="flex flex-col gap-3 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value={UserRole.Reader}
                      checked={state.role === UserRole.Reader}
                      onChange={(e) => dispatch({ type: 'SET_ROLE', payload: e.target.value as UserRole })}
                      className="w-4 h-4 accent-primary-400 cursor-pointer"
                    />
                    <span className="text-neutral-100 text-[14px]">{t("profile.reader") || "Reader"}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value={UserRole.Writer}
                      checked={state.role === UserRole.Writer}
                      onChange={(e) => dispatch({ type: 'SET_ROLE', payload: e.target.value as UserRole })}
                      className="w-4 h-4 accent-primary-400 cursor-pointer"
                    />
                    <span className="text-neutral-100 text-[14px]">{t("profile.writer") || "Writer"}</span>
                  </label>
                </div>
              </div>
              <button
                className="outline-none border-none bg-primary-400 text-white px-4 py-2 mt-8 rounded-full self-center cursor-pointer w-[320px] h-[40px] flex justify-center items-center"
                onClick={handleUpdateProfile}
                disabled={isPending}>
                {isPending && <LuLoader className="animate-spin text-foreground inline-block mx-4" />}
                {isPending ? t("profile.saving") : t("profile.save")}
              </button>
            </div>
          </ProfileEditBody>
        </div>
      </div>
      <div className="profile__configurationz bg-background hidden lg:block">
        <ProfileConfigurations />
      </div>
    </div>
    </MainContent>
  );
};

export default EditProfile;
