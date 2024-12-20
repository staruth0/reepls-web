import React from 'react'
import { useNavigate } from 'react-router-dom'
import './ExpiredToken.scss'

const ExpiredToken: React.FC = () => {
    const navigate = useNavigate()

    function handleLogin() { 
        navigate('/login/email')
    }

  return (
      <div className='expired__container'>
          <h2> Token has Expired </h2>
          <button onClick={handleLogin}> Login</button>
     </div>
  )
}

export default ExpiredToken