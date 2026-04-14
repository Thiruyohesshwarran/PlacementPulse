import { useEffect, useRef, useState } from 'react';

const GoogleSignInButton = ({ onCredential, label = 'Continue with Google' }) => {
  const containerRef = useRef(null);
  const handlerRef = useRef(onCredential);
  const [error, setError] = useState('');
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    handlerRef.current = onCredential;
  }, [onCredential]);

  useEffect(() => {
    if (!clientId) {
      return undefined;
    }

    const renderButton = () => {
      if (!containerRef.current || !window.google?.accounts?.id) {
        return;
      }

      const width = Math.max(280, Math.min(360, containerRef.current.getBoundingClientRect().width || 360));

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          setError('');
          if (response?.credential && handlerRef.current) {
            await handlerRef.current(response.credential);
          }
        },
      });

      window.google.accounts.id.renderButton(containerRef.current, {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        text: 'continue_with',
        shape: 'pill',
        width,
      });
    };

    if (window.google?.accounts?.id) {
      renderButton();
      return undefined;
    }

    const script = document.getElementById('google-identity-services');
    if (script) {
      const onLoad = () => renderButton();
      script.addEventListener('load', onLoad, { once: true });

      return () => {
        script.removeEventListener('load', onLoad);
      };
    }

    setError('Google sign-in script is unavailable.');
    return undefined;
  }, [clientId]);

  if (!clientId) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-400">
        Set VITE_GOOGLE_CLIENT_ID to enable {label.toLowerCase()}.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div ref={containerRef} className="w-full overflow-hidden rounded-full" aria-label={label} />
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};

export default GoogleSignInButton;