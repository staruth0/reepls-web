import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuLoader } from 'react-icons/lu';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { validatePassword } from '../../../../utils/validatePassword';
import InputField from '../../components/InputField';
import { usePhoneRegisterUser } from '../../hooks/AuthHooks';
import { useStoreCredential } from '../../hooks/useStoreCredential';
import '../../styles/authpages.scss';

function RegisterWithPhone1() {
  const { t } = useTranslation();
  //custom-hooks
  const { storePassword } = useStoreCredential();
  const { mutate, isPending, error } = usePhoneRegisterUser();

  const { phone, password, username } = useSelector((state: RootState) => state.user);

  //states
  const [passwords, setPassword] = useState<string>('');
  const [passwordInputError, setPasswordInputError] = useState<boolean>(false);

  //functions to handle DOM events

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const passwordValue = e.target.value;
    setPassword(passwordValue);
    storePassword(passwordValue);

    if (validatePassword(passwordValue) || passwordValue === '') {
      setPasswordInputError(false);
    } else {
      setPasswordInputError(true);
    }
  };

  const handlePasswordBlur = () => {
    if (passwords === '') {
      setPasswordInputError(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    e.preventDefault();
    console.log('password stored', {
      phone: `+237${phone}`,
      password,
      name:username,
    });

    mutate({ phone: `+237${phone}`, password,name:username });
  };

  return (
    <div className="register__phone__container">
      <div className="insightful__texts">
        <div>{t('Create your password')}</div>
        <p>{t('Create your password - description')}</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <InputField
            textValue={passwords}
            label={t('PasswordLabel')}
            type="password"
            placeholder={t('PasswordPlaceholder')}
            handleInputChange={handlePasswordChange}
            handleBlur={handlePasswordBlur}
            isInputError={passwordInputError}
            inputErrorMessage={t('PasswordErrorMessage')}
          />
        </div>

        {error && <div>{error.message}</div>}
        <button type="submit">
          {isPending && <LuLoader className="animate-spin inline-block mx-4" />}
          {t('ContinueButton')}
        </button>
      </form>
    </div>
  );
}

export default RegisterWithPhone1;
