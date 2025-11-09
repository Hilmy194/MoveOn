import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    role: 'trainee',
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
    setApiError('');
  };

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    // Full name validation
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Role validation
    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    // Validate form
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Prepare data for API (remove confirmPassword)
      const { confirmPassword, ...registerData } = formData;

      // Call register function from AuthContext
      await register(registerData);

      // Redirect based on role
      if (formData.role === 'coach') {
        navigate('/coach/dashboard');
      } else {
        navigate('/trainee/dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setApiError(error.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-blue-950/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md border border-blue-700/30">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-yellow-400 mb-2">✨ Create Account</h1>
          <p className="text-gray-300">Join MoveOn as Coach or Trainee</p>
        </div>

        {/* Error Alert */}
        {apiError && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg">
            <p className="text-red-300 text-sm">{apiError}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-white text-sm font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-blue-900/50 border ${
                errors.username ? 'border-red-500' : 'border-blue-700'
              } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition`}
              placeholder="john_doe"
            />
            {errors.username && <p className="mt-1 text-red-400 text-xs">{errors.username}</p>}
          </div>

          {/* Full Name */}
          <div>
            <label htmlFor="full_name" className="block text-white text-sm font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-blue-900/50 border ${
                errors.full_name ? 'border-red-500' : 'border-blue-700'
              } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition`}
              placeholder="John Doe"
            />
            {errors.full_name && <p className="mt-1 text-red-400 text-xs">{errors.full_name}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-blue-900/50 border ${
                errors.email ? 'border-red-500' : 'border-blue-700'
              } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition`}
              placeholder="mau@1.com"
            />
            {errors.email && <p className="mt-1 text-red-400 text-xs">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-white text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-blue-900/50 border ${
                errors.password ? 'border-red-500' : 'border-blue-700'
              } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition`}
              placeholder="••••••"
            />
            {errors.password && <p className="mt-1 text-red-400 text-xs">{errors.password}</p>}
            <p className="mt-1 text-gray-400 text-xs">Min 6 characters</p>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-white text-sm font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-blue-900/50 border ${
                errors.confirmPassword ? 'border-red-500' : 'border-blue-700'
              } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition`}
              placeholder="••••••"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-red-400 text-xs">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-white text-sm font-medium mb-3">Role</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, role: 'coach' }))}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.role === 'coach'
                    ? 'bg-yellow-400 border-yellow-400 text-blue-900'
                    : 'bg-blue-900/30 border-blue-700 text-white hover:border-yellow-400'
                }`}
              >
                <div className="text-2xl mb-1">🏋️</div>
                <div className="font-semibold">Coach</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, role: 'trainee' }))}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.role === 'trainee'
                    ? 'bg-yellow-400 border-yellow-400 text-blue-900'
                    : 'bg-blue-900/30 border-blue-700 text-white hover:border-yellow-400'
                }`}
              >
                <div className="text-2xl mb-1">🏃</div>
                <div className="font-semibold">Trainee</div>
              </button>
            </div>
            {errors.role && <p className="mt-2 text-red-400 text-xs">{errors.role}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-900"
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Registering...
              </span>
            ) : (
              '✨ Register'
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-300">
            Already have an account?{' '}
            <Link to="/login" className="text-yellow-400 hover:text-yellow-300 font-semibold">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;