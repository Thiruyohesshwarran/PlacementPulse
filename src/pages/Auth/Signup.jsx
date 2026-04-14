import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/authContextState';
import GoogleSignInButton from '../../components/auth/GoogleSignInButton';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', college: '', targetRole: '' });
  const [error, setError] = useState('');
  const [googleError, setGoogleError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const result = await register(
      formData.name,
      formData.email,
      formData.password,
      formData.college,
      formData.targetRole
    );

    setSubmitting(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message || 'Signup failed');
    }
  };

  const handleGoogleCredential = async (credential) => {
    setError('');
    setGoogleError('');
    const result = await googleLogin(credential);

    if (result.success) {
      navigate('/');
    } else {
      setGoogleError(result.message || 'Google sign-in failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4 py-12">
      <div className="max-w-md w-full card p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-100 text-primary-600 mb-4">
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create an account</h2>
          <p className="text-slate-500 mt-2">Start your preparation journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
            <input type="text" name="name" required className="input-field" onChange={handleChange} placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
            <input type="email" name="email" required className="input-field" onChange={handleChange} placeholder="student@college.edu" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
            <input type="password" name="password" required className="input-field" onChange={handleChange} placeholder="••••••••" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">College</label>
              <input type="text" name="college" className="input-field" onChange={handleChange} placeholder="XYZ Inst" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Target Role</label>
              <input type="text" name="targetRole" className="input-field" onChange={handleChange} placeholder="SDE" />
            </div>
          </div>
          
          <button type="submit" className="w-full btn-primary mt-2" disabled={submitting}>
            {submitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-4 text-xs uppercase tracking-[0.28em] text-slate-400">
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          <span>or</span>
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        </div>

        {googleError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              <span>{googleError}</span>
            </div>
          </div>
        )}

        <GoogleSignInButton onCredential={handleGoogleCredential} label="Sign up with Google" />
        
        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-500 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
