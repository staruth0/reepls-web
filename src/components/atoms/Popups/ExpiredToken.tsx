import React from 'react'
import { useNavigate } from 'react-router-dom'
import './ExpiredToken.scss'
import { t } from 'i18next'

const ExpiredToken: React.FC = () => {
    const navigate = useNavigate()

    function handleLogin() { 
        navigate('/login/email')
    }

  return (
      <div className='expired__container'>
          <h2> {t("Token has Expired")} </h2>
          <button onClick={handleLogin}> {t("Login")}</button>
     </div>
  )
}

export default ExpiredToken