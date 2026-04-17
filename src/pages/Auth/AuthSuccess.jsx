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
        // The cookie 'token' is already set by the backend
        // We call /auth/profile to get the user data
        const { data } = await api.get('/auth/profile', { withCredentials: true });
        
        // Update local state
        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
        
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
