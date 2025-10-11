import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext/authContext';
import { LoginResponse } from '../../../models/datamodels';
import { toast } from 'react-hot-toast';

/**
 * Google Auth Callback Handler Component
 * This component handles the callback from Google OAuth and processes the authentication
 * It extracts tokens and user data from URL parameters and logs the user in
 */
function GoogleAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        // Extract parameters from URL
        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get('refreshToken');
        const userId = searchParams.get('userId');
        const userEmail = searchParams.get('userEmail');
        const userName = searchParams.get('userName');
        const success = searchParams.get('success');
        const error = searchParams.get('error');

        // Handle authentication failure
        if (error || success === 'false') {
          toast.error('Google authentication failed. Please try again.');
          navigate('/auth');
          return;
        }

        // Check if we have the required tokens
        if (!accessToken || !refreshToken || !userId) {
          toast.error('Authentication data incomplete. Please try again.');
          navigate('/auth');
          return;
        }

        // Create LoginResponse object following your existing pattern
        const loginData: LoginResponse = {
          user: {
            id: userId,
            _id: userId,
            email: userEmail || '',
            username: userName || '',
            name: userName || '',
            is_email_verified: true, // Google users have verified emails
        
            // Note: We'll fetch complete user data from backend if needed
          },
          tokens: {
            access: {
              token: accessToken,
              expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
            },
            refresh: {
              token: refreshToken,
              expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
            },
          },
        };

        // Log the user in using your existing auth system
        login(loginData);
        
        toast.success('Successfully logged in with Google!');
        navigate('/feed');
      } catch (error) {
        console.error('Google auth callback error:', error);
        toast.error('An error occurred during authentication. Please try again.');
        navigate('/auth');
      }
    };

    handleGoogleCallback();
  }, [searchParams, navigate, login]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400 mx-auto mb-4"></div>
        <p className="text-gray-600">Processing Google authentication...</p>
      </div>
    </div>
  );
}

export default GoogleAuthCallback;
