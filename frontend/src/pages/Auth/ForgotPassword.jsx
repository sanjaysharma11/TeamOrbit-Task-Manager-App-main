import React, { useState } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import Input from '../../components/Inputs/Input';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apipaths';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await axiosInstance.post(API_PATHS.AUTH.FORGOT_PASSWORD, { email });
      setMessage('If this email exists, a reset link has been sent.');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Forgot Password</h3>
        <p className="text-sm text-slate-700 mt-[5px] mb-6">
          Enter your email to receive a password reset link.
        </p>
        <form onSubmit={handleSubmit}>
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="john@example.com"
            type="email"
            required
          />
          {message && <p className="text-green-500 text-xs mt-2">{message}</p>}
          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          <button type="submit" className="btn-primary mt-2">
            Send Reset Link
          </button>
          <p className="text-[15px] text-slate-800 mt-3">
            <Link className="font-semibold text-blue-500 underline" to="/login">
              Back To Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;