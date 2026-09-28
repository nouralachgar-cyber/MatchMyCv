import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Register attempt:', formData);
  };

  return (
    <div className="max-w-md mx-auto mt-12 px-4">
      <div className="bg-[#12544F]/40 border border-[#12544F] p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-6 text-[#8BBB92]">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2.5 bg-[#092328] border border-[#12544F] rounded-lg focus:outline-none focus:border-[#2A835F] text-slate-200"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2.5 bg-[#092328] border border-[#12544F] rounded-lg focus:outline-none focus:border-[#2A835F] text-slate-200"
              placeholder="example@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2.5 bg-[#092328] border border-[#12544F] rounded-lg focus:outline-none focus:border-[#2A835F] text-slate-200"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#2A835F] hover:bg-[#2A835F]/80 text-white font-medium py-2.5 rounded-lg transition shadow-lg shadow-[#2A835F]/20"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-300">
          Already have an account?{' '}
          <Link to="/login" className="text-[#8BBB92] hover:underline font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;