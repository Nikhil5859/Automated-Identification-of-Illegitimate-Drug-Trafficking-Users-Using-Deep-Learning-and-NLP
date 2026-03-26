import React, { useState } from 'react';
import { LoginUserIcon } from './icons/LoginUserIcon';
import { LoginLockIcon } from './icons/LoginLockIcon';

interface LoginPageProps {
  onLoginSuccess: () => void;
  currentPassword: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, currentPassword }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple client-side authentication
    if (username === 'admin' && password === currentPassword) {
      setError('');
      onLoginSuccess();
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
        <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
                 <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                 </svg>
                 <h1 className="text-2xl font-bold text-white tracking-tight">Social Sentry AI</h1>
            </div>
          <p className="text-gray-400">Please sign in to access the dashboard.</p>
        </div>
        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LoginUserIcon />
            </div>
            <input
              type="text"
              name="username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 p-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-white"
              placeholder="Username"
              required
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LoginLockIcon />
            </div>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 p-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-white"
              placeholder="Password"
              required
            />
          </div>
          
          {error && <p className="text-sm text-red-400 text-center">{error}</p>}

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <button
                type="button"
                onClick={() => alert('Password recovery is not available in this demo.')}
                className="font-medium text-indigo-400 hover:text-indigo-500 focus:outline-none bg-transparent border-none cursor-pointer"
              >
                Forgot your password?
              </button>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 transition"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
