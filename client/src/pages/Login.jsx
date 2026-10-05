import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      const data = await loginUser(formData);

      localStorage.setItem('userInfo', JSON.stringify(data));

      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 px-4">
      <div className="bg-[#12544F]/40 border border-[#12544F] p-8 rounded-2xl shadow-xl">

        <h2 className="text-2xl font-bold text-center mb-6 text-[#8BBB92]">
          Sign In
        </h2>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 text-sm p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Email Address
            </label>

            <input
              type="email"
              required
              className="w-full px-4 py-2.5 bg-[#092328] border border-[#12544F] rounded-lg focus:outline-none focus:border-[#2A835F] text-slate-200"
              placeholder="example@email.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Password
            </label>

            <input
              type="password"
              required
              className="w-full px-4 py-2.5 bg-[#092328] border border-[#12544F] rounded-lg focus:outline-none focus:border-[#2A835F] text-slate-200"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password: e.target.value,
                })
              }
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2A835F] hover:bg-[#2A835F]/80 text-white font-medium py-2.5 rounded-lg transition shadow-lg shadow-[#2A835F]/20 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

        </form>

        <p className="mt-6 text-center text-sm text-slate-300">
          Don't have an account?{' '}

          <Link
            to="/register"
            className="text-[#8BBB92] hover:underline font-medium"
          >
            Register here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;