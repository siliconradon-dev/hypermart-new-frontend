import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const isJwtExpired = (token) => {
      if (!token || typeof token !== 'string') return true;
      const parts = token.split('.');
      if (parts.length !== 3) return true;

      try {
        const payloadJson = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
        const payload = JSON.parse(payloadJson);
        if (payload?.exp === undefined || payload?.exp === null) return false;

        const nowSec = Math.floor(Date.now() / 1000);
        return Number(payload.exp) <= nowSec;
      } catch {
        return true;
      }
    };

    let user = null;
    try {
      user = JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      user = null;
    }

    if (token && !isJwtExpired(token)) {
      const isDeactivated = Number(user?.status_id ?? 1) === 0;
      navigate(isDeactivated ? '/dashboard/dashboard' : '/dashboard', { replace: true });
    } else {
      // Clear stale/invalid tokens so the app doesn't "auto-login" incorrectly.
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Login failed');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      const isDeactivated = Number(data?.user?.status_id ?? 1) === 0;
      navigate(isDeactivated ? '/dashboard/dashboard' : '/dashboard');
    } catch (err) {
      setError(err?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="flex flex-col justify-center items-center min-h-screen p-4">
        <div className="w-full max-w-6xl flex max-lg:flex-col items-center justify-center gap-8">
          <div className="flex items-center justify-center w-1/2 max-lg:w-full fade-in">
            <div className="p-8 rounded-2xl border-1 border-black/10 shadow-2xl aspect-square flex justify-center items-center">
            <img
              className="object-contain w-full h-full max-h-64"
              src="/images/logo.png"
              alt="logo"
            />
          </div>
        </div>

          <div className="w-1/2 max-lg:w-full fade-in" style={{ animationDelay: '0.2s' }}>
          <form
            className="bg-slate-800 rounded-2xl shadow-2xl p-8 space-y-6 border border-slate-700"
            onSubmit={handleSubmit}
          >

              <div className="text-center space-y-2">
                <h1 className="text-4xl max-sm:text-3xl text-white font-bold">Welcome Back</h1>
                <p className="text-slate-400 text-sm">Please login to your account</p>
            </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-300 block">
                Email Address
              </label>
                <div className={`relative ${focusedInput === 'email' ? 'ring-2 ring-blue-500 rounded-lg' : ''}`}>
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                      className="w-5 h-5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                    className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-3 placeholder-slate-400 transition-all duration-200"
                />
              </div>
            </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-slate-300 block">
                Password
              </label>
                <div className={`relative ${focusedInput === 'password' ? 'ring-2 ring-blue-500 rounded-lg' : ''}`}>
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                      className="w-5 h-5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                    className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-10 p-3 placeholder-slate-400 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-blue-400 transition-colors"
                  id="togglePassword"
                >
                  <svg
                    id="eyeIcon"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    {showPassword ? (
                      <>
                        <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z" />
                        <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829" />
                        <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z" />
                      </>
                    ) : (
                      <>
                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer group" htmlFor="remember_user">
                <input
                  type="checkbox"
                  id="remember_user"
                  name="remember_user"
                    className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                />
                  <span className="text-slate-300 group-hover:text-white transition-colors">Remember Me</span>
              </label>
                <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                Forgot Password?
              </a>
            </div>

            {error && (
              <div className="text-sm text-red-300 bg-red-900/30 border border-red-800 rounded-lg p-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              id="loginBtn"
              disabled={isLoading}
                className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 ${
                  isLoading ? 'animate-pulse' : ''
                }`}
            >
              <span id="btnText">{isLoading ? 'Logging in...' : 'Login'}</span>
              <svg
                id="btnSpinner"
                  className={`${isLoading ? '' : 'hidden'} animate-spin h-5 w-5 text-white`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </button>
          </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-400">
              Powered by{' '}
                <span className="text-blue-400 font-medium">Silicon Radon Networks (Pvt) Ltd.</span>
            </p>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;