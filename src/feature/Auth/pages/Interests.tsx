import Interestbtn from '../components/Interestbtn';
import '../styles/interest.scss';
// import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { interests } from '../../../data';
import { RootState } from '../../../store';
import { cn } from '../../../utils';
import { useUpdateUser } from '../hooks/AuthHooks';

function Interests() {
  const { t } = useTranslation();
  //   const navigate = useNavigate();
  const { username } = useSelector((state: RootState) => state.user);
  const updateUser = useUpdateUser();

  const [interest, setInterest] = useState<string[]>([]);

  const handleInterest = (value: string) => {
    setInterest((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  };

  const handleComplete = () => {
    if (interest.length === 0) {
      // toast.error('Please select at least one interest');
      window.alert('Please select at least one interest');
      return;
    }
    updateUser.mutate({ interests: interest, username });
  };

  return (
    <div className="interest__container">
      <div className="head__interests">
        <div>{t('Enow, you’re in! Select your interests')}</div>
        <p>{t('Last! Pick at least one topic that you are interested in')}</p>
      </div>
      <div className={cn(`counter__interests`, { green: interest.length > 0 })}>{interest.length} Selected</div>
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
        <div>Skip</div>
      </div>
    </div>
  );
}

export default Interests;
