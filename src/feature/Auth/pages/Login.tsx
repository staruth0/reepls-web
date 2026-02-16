import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to email login immediately
    navigate('/auth/login/email', { replace: true });
  }, [navigate]);

  return null; // This component will redirect, so no UI needed
}

export default Login;