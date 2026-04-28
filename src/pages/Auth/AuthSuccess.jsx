import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContextState';
import api from '../../services/api';

const AuthSuccess = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const urlToken = params.get('token');

        if (!urlToken) {
          throw new Error('No token found in URL');
        }

        // Temporarily store token so the API interceptor uses it for the profile request
        localStorage.setItem('userInfo', JSON.stringify({ token: urlToken }));

        // Fetch user profile using the token (which is automatically attached by the interceptor)
        const { data } = await api.get('/auth/profile');
        
        // Construct final user object including the token
        const finalData = { ...data, token: urlToken };
        
        // Update local state
        setUser(finalData);
        localStorage.setItem('userInfo', JSON.stringify(finalData));
        
        // Redirect to dashboard/home
        navigate('/');
      } catch (error) {
        console.error('Failed to fetch user after Google login:', error);
        navigate('/login?error=fetch_failed');
      }
    };

    fetchUser();
  }, [setUser, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Completing sign in...</h2>
        <p className="text-slate-500 mt-2">Please wait while we set up your session.</p>
      </div>
    </div>
  );
};

export default AuthSuccess;
