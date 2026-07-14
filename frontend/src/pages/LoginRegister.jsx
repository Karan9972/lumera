import React, { useState, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LoginRegister = () => {
  const [searchParams] = useSearchParams();
  const [isRegister, setIsRegister] = useState(searchParams.get('register') === 'true');
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isRegister) {
        await register(form.name, form.email, form.password);
      } else {
        await login(form.email, form.password);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || (isRegister ? 'Registration failed' : 'Invalid credentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="min-h-screen bg-ivory flex items-center justify-center px-4 py-20">
      <div class="w-full max-w-md">
        {/* Logo Header */}
        <div class="text-center mb-10">
          <div class="text-3xl font-playfair font-semibold tracking-[0.3em] text-primary">LUMERA</div>
          <div class="text-[10px] font-poppins tracking-[0.4em] text-graysoft font-light uppercase mt-1">Artificial Jewellery</div>
        </div>

        {/* Auth Card */}
        <div class="bg-[#FFFFFF] border border-border rounded-[20px] p-8 shadow-sm">
          <h2 class="font-playfair text-2xl text-primary mb-2 text-center">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p class="font-poppins text-xs text-graysoft font-light text-center mb-8">
            {isRegister ? 'Join the LUMERA family to unlock exclusive drops.' : 'Sign in to your luxury jewellery account.'}
          </p>

          <form onSubmit={handleSubmit} class="flex flex-col gap-5">
            {isRegister && (
              <div>
                <label class="text-[11px] font-semibold uppercase tracking-wider text-graysoft font-poppins">Full Name</label>
                <input 
                  type="text" name="name" value={form.name} onChange={handleChange} required
                  placeholder="E.g. Priya Sharma"
                  class="w-full mt-1.5 border border-border p-3.5 rounded-lg text-sm font-poppins outline-none focus:border-accent transition-colors"
                />
              </div>
            )}

            <div>
              <label class="text-[11px] font-semibold uppercase tracking-wider text-graysoft font-poppins">Email Address</label>
              <input 
                type="email" name="email" value={form.email} onChange={handleChange} required
                placeholder="name@example.com"
                class="w-full mt-1.5 border border-border p-3.5 rounded-lg text-sm font-poppins outline-none focus:border-accent transition-colors"
              />
            </div>

            <div>
              <label class="text-[11px] font-semibold uppercase tracking-wider text-graysoft font-poppins">Password</label>
              <input 
                type="password" name="password" value={form.password} onChange={handleChange} required
                placeholder="Min. 6 characters"
                class="w-full mt-1.5 border border-border p-3.5 rounded-lg text-sm font-poppins outline-none focus:border-accent transition-colors"
              />
            </div>

            {error && (
              <div class="bg-red-50 border border-red-100 text-danger text-xs p-3 rounded-lg font-poppins">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              class="w-full bg-primary text-[#FFFFFF] hover:bg-accent disabled:bg-gray-400 py-4 rounded-[4px] text-xs font-semibold uppercase tracking-widest font-poppins transition-colors mt-2"
            >
              {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div class="mt-6 text-center text-xs font-poppins text-graysoft">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button 
              onClick={() => { setIsRegister(prev => !prev); setError(''); setForm({ name: '', email: '', password: '' }); }}
              class="text-accent font-semibold hover:underline"
            >
              {isRegister ? 'Sign In' : 'Create Account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
