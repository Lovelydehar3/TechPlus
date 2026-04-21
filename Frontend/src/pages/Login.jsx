import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';

// Real tech/coding photos for the login page scrolling grid
// Professional tech/coding photos for the login page scrolling grid
const TILE_URLS_1 = [
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&q=80', // dark coding laptop
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80', // team collaboration
  'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&q=80', // futuristic tech
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80', // code editor
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80', // tech team
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&q=80', // macbook coding
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80', // laptop monitor
  'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&q=80', // code on screen
];

const TILE_URLS_2 = [
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=80', // circuit board
  'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=400&q=80', // cyber security
  'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&q=80', // productive desk setup
  'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400&q=80', // minimalist workspace
  'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&q=80', // mobile app dev
  'https://images.unsplash.com/photo-1568952433726-3896e3881c65?w=400&q=80', // neon coding
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80', // programming abstract
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&q=80', // digital matrix
];

const TILE_URLS_3 = [
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&q=80', // robot interaction
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&q=80', // encryption/matrix
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80', // processor chip
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80', // global network
  'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=400&q=80', // deep learning
  'https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&q=80', // software engineering
  'https://images.unsplash.com/photo-1550439062-609e1531270e?w=400&q=80', // modern programming
  'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&q=80', // code wallpaper
];


export default function Login() {
  const [step, setStep] = useState('login'); // 'login' | 'signup' | 'verify-otp'
  const [form, setForm] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    otp: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register, verifyOtp, resendOtp, loginWithCredentials } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const FALLBACK_TILE =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400'%3E%3Crect width='300' height='400' fill='%230b0b0f'/%3E%3C/svg%3E";

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      addToast('Please fill all fields', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await loginWithCredentials(form.email, form.password);
      if (response.success) {
        addToast('Login successful!', 'success');
        setTimeout(() => navigate('/'), 500);
      }
    } catch (error) {
      addToast(error.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!form.email || !form.username || !form.password || !form.confirmPassword) {
      addToast('Please fill all fields', 'error');
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(form.password)) {
      addToast('Password must be 8+ chars with uppercase, lowercase, number, and special character', 'error');
      return;
    }
    if (form.password !== form.confirmPassword) {
      addToast('Passwords do not match', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await register(form.email, form.username, form.password, form.confirmPassword);
      addToast(
        response?.devOtp
          ? `Development OTP: ${response.devOtp}`
          : 'OTP sent to your email! Please verify.',
        'success'
      );
      setStep('verify-otp');
    } catch (error) {
      addToast(error?.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!form.otp) {
      addToast('Please enter OTP', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await verifyOtp(form.email, form.otp);
      if (response.success) {
        addToast('Email verified! Logging you in...', 'success');
        setTimeout(() => navigate('/'), 500);
      }
    } catch (error) {
      addToast(error.message || 'OTP verification failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const response = await resendOtp(form.email);
      addToast(
        response?.devOtp ? `Development OTP: ${response.devOtp}` : 'OTP resent to your email',
        'success'
      );
    } catch (error) {
      addToast(error.message || 'Failed to resend OTP', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-[#0a0a0a]">
      {/* LEFT: SCROLLING IMAGE GRID */}
      <div className="hidden lg:flex relative w-[45%] h-full overflow-hidden">
        <div className="absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-[#0a0a0a] to-transparent pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-[200vh] grid grid-cols-3 gap-3 p-4">
          <div className="flex flex-col gap-3 animate-scroll-up">
            {[...TILE_URLS_1, ...TILE_URLS_1].map((url, i) => (
              <img
                key={`c1-${i}`}
                src={url}
                alt="Tech inspiration"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = FALLBACK_TILE;
                }}
                className="w-full object-cover rounded-lg transition-transform hover:scale-105"
                style={{ aspectRatio: '3/4' }}
              />
            ))}
          </div>
          <div className="flex flex-col gap-3 animate-scroll-down">
            {[...TILE_URLS_2, ...TILE_URLS_2].map((url, i) => (
              <img
                key={`c2-${i}`}
                src={url}
                alt="Tech and coding"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = FALLBACK_TILE;
                }}
                className="w-full object-cover rounded-lg transition-transform hover:scale-105"
                style={{ aspectRatio: '3/4' }}
              />
            ))}
          </div>
          <div className="flex flex-col gap-3 animate-scroll-up" style={{ animationDelay: '-15s' }}>
            {[...TILE_URLS_3, ...TILE_URLS_3].map((url, i) => (
              <img
                key={`c3-${i}`}
                src={url}
                alt="Tech and coding"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = FALLBACK_TILE;
                }}
                className="w-full object-cover rounded-lg transition-transform hover:scale-105"
                style={{ aspectRatio: '3/4' }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT: LOGIN FORM */}
      <div className="w-full lg:w-[55%] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <motion.div
          className="w-full max-w-[380px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-black text-lg bg-white shadow-[0_0_24px_rgba(255,255,255,0.25)]">
              T+
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-white">TECHPLUS</h1>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 sm:px-8 py-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-gray-900">
                {step === 'login' && 'Welcome Back'}
                {step === 'signup' && 'Create Account'}
                {step === 'verify-otp' && 'Verify Email'}
              </h2>

              {/* LOGIN FORM */}
              {step === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                      Email
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? (
                          <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        ) : (
                          <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-14-14zM6.06 6.06a2 2 0 012.828 0A2 2 0 106.06 6.06zM12 12a2 2 0 110-4 2 2 0 010 4zM2 10a8 8 0 1114.32 4.906l-5.228-5.228A4 4 0 004 10H2z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 mt-6 rounded-full font-bold text-white bg-[#a855f7] hover:bg-[#9333ea] transition-all disabled:opacity-50"
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </button>

                  <div className="text-center mt-4">
                    <a
                      href="/password-reset"
                      className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                    >
                      Forgot Password?
                    </a>
                  </div>
                </form>
              )}

              {/* SIGNUP FORM */}
              {step === 'signup' && (
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                      Email
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                      Username
                    </label>
                    <input
                      type="text"
                      value={form.username}
                      onChange={(e) => setForm({ ...form, username: e.target.value })}
                      placeholder="john_doe"
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? (
                          <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        ) : (
                          <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-14-14zM6.06 6.06a2 2 0 012.828 0A2 2 0 106.06 6.06zM12 12a2 2 0 110-4 2 2 0 010 4zM2 10a8 8 0 1114.32 4.906l-5.228-5.228A4 4 0 004 10H2z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={form.confirmPassword || ''}
                        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? (
                          <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        ) : (
                          <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-14-14zM6.06 6.06a2 2 0 012.828 0A2 2 0 106.06 6.06zM12 12a2 2 0 110-4 2 2 0 010 4zM2 10a8 8 0 1114.32 4.906l-5.228-5.228A4 4 0 004 10H2z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 mt-6 rounded-full font-bold text-white bg-[#a855f7] hover:bg-[#9333ea] transition-all disabled:opacity-50"
                  >
                    {loading ? 'Creating account...' : 'Sign Up'}
                  </button>
                </form>
              )}

              {/* VERIFY OTP FORM */}
              {step === 'verify-otp' && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <p className="text-center text-sm text-gray-600 mb-4">
                    We've sent an OTP to <strong>{form.email}</strong>
                  </p>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      value={form.otp}
                      onChange={(e) => setForm({ ...form, otp: e.target.value })}
                      placeholder="123456"
                      maxLength="6"
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-center text-2xl tracking-widest"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-full font-bold text-white bg-[#a855f7] hover:bg-[#9333ea] transition-all disabled:opacity-50"
                  >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </button>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="w-full py-2 text-sm text-purple-600 hover:text-purple-700 font-semibold transition-colors"
                  >
                    Resend OTP
                  </button>
                </form>
              )}

              {/* Toggle Forms */}
              <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
                {step === 'login' && (
                  <>
                    Don't have an account?{' '}
                    <button
                      onClick={() => {
                        setStep('signup');
                        setForm({ email: '', username: '', password: '', confirmPassword: '', otp: '' });
                      }}
                      className="text-purple-600 font-semibold hover:text-purple-700 transition-colors"
                    >
                      Sign up here
                    </button>
                  </>
                )}
                {(step === 'signup' || step === 'verify-otp') && (
                  <>
                    Already have an account?{' '}
                    <button
                      onClick={() => {
                        setStep('login');
                        setForm({ email: '', username: '', password: '', confirmPassword: '', otp: '' });
                      }}
                      className="text-purple-600 font-semibold hover:text-purple-700 transition-colors"
                    >
                      Log in here
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes scroll-up {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes scroll-down {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        .animate-scroll-up {
          animation: scroll-up 25s linear infinite;
        }
        .animate-scroll-down {
          animation: scroll-down 25s linear infinite;
        }
      `}</style>
    </div>
  );
}
