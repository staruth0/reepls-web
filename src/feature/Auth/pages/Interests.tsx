import Interestbtn from '../components/Interestbtn';
import '../styles/interest.scss';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { interests } from '../../../data';
import { cn } from '../../../utils';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUpdateUser } from '../../Profile/hooks';

function Interests() {
  const { t } = useTranslation();
  const updateUser = useUpdateUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [interest, setInterest] = useState<string[]>([]);

  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // State for popup

  const handleInterest = (value: string) => {
    setInterest((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handleComplete = () => {
    if (interest.length === 0) {
      window.alert('Please select at least one interest');
      return;
    }
    updateUser.mutate({ interests: interest});
  };

  const handleSkip = () => {
    updateUser.mutate({ interests: interest});
  };

  // Show popup on successful update and redirect logic
  if (updateUser.isSuccess && !showSuccessPopup) {
    setShowSuccessPopup(true);
    // Optionally, you could delay navigation here if you want the user to click the button instead
  }

  const handleLoginRedirect = () => {
    setShowSuccessPopup(false);
    navigate('/auth/login/phone');
  };

  return (
    <div className="interest__container">
      <div className="head__interests">
        <div>{t(`${location.state}, you’re in! Select your interests`)}</div>
        <p>{t('Last! Pick at least one topic that you are interested in')}</p>
      </div>
      <div className={cn(`counter__interests`, { green: interest.length > 0 })}>
        {interest.length} Selected
      </div>
      <div className="interest__wrapper">
        {interests.map((interest) => (
          <Interestbtn key={interest} interest={interest} handleInterest={handleInterest} />
        ))}
      </div>
      {updateUser.error && <div>{updateUser.error.message}</div>}

      <div className="interest_btns">
        {updateUser.isPending ? (
          <button className={cn(`interest_btn`, { green: interest.length > 0 })}>
            Completing Account Creation.......
          </button>
        ) : (
          <button className={cn(`interest_btn`, { green: interest.length > 0 })} onClick={handleComplete}>
            {interest.length > 0 ? 'Done' : 'Sign up'}
          </button>
        )}
        <div className="cursor-pointer hover:underline" onClick={handleSkip}>
          Skip
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowSuccessPopup(false)} 
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-neutral-800 rounded-md p-6 z-50 text-neutral-50 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Success!</h3>
            <p className="mb-6">You’ve successfully created you account ! Now proceed to log in.</p>
            <div className="flex justify-end">
              <button
                className="py-2 px-6 bg-main-green text-neutral-50 rounded-full hover:bg-primary-700 transition-colors"
                onClick={handleLoginRedirect}
              >
                Go to Login
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Interests;