import { LogIn } from 'lucide-react';

const GoogleSignInButton = ({ label = 'Continue with Google' }) => {
  const handleLogin = () => {
    const envBase = import.meta.env.VITE_API_URL;
    // Local fallback (disabled for deployment-first flow):
    const fallbackBase = 'http://localhost:5000';
    // const fallbackBase = 'https://placementpulse-backend.onrender.com';
    const resolvedBase = (envBase || fallbackBase).replace(/\/$/, '');
    const target = `${resolvedBase}/api/auth/google`;

    if (!envBase) {
      console.warn('VITE_API_URL missing, using deployment fallback for Google auth:', fallbackBase);
    }

    console.info('Google auth redirect target:', target);
    window.location.href = target;
  };

  return (
    <button
      onClick={handleLogin}
      className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-medium py-2.5 px-4 rounded-xl transition-all duration-200 shadow-sm active:scale-[0.98]"
    >
      <img
        src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
        alt="Google logo"
        className="w-5 h-5"
      />
      <span>{label}</span>
      <LogIn className="w-4 h-4 text-slate-400" />
    </button>
  );
};

export default GoogleSignInButton;
