import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layouts/AuthLayout';
import Input from '../../components/Inputs/Input';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apipaths';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Extract token from query string
  const query = new URLSearchParams(location.search);
  const token = query.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!token) {
      setError('Invalid or expired token. Please resend Forgot Password Reset Link again.');
      return;
    }
    try {
      await axiosInstance.post(`${API_PATHS.AUTH.RESET_PASSWORD}/${token}`, { password });
      setMessage('Password reset successful. You can now log in.');
      setTimeout(() => {
        navigate('/login');
      }, 2000); // Redirect after 2 seconds
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Session expired. Please resend Forgot Password Reset Link again.'
      );
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Reset Password</h3>
        <form onSubmit={handleSubmit}>
          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="New Password"
            placeholder="Enter new password"
            type="password"
            required
          />
          {message && <p className="text-green-500 text-xs mt-2">{message}</p>}
          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          <button type="submit" className="btn-primary mt-2">
            Reset Password
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

export default ResetPassword;