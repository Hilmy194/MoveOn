import User from '../models/UserModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { successResponse, errorResponse } from '../utils/response.js';

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id.toString(), 
      username: user.username,
      email: user.email,
      role: user.role 
    },
    process.env.JWT_SECRET || 'your-secret-key-change-this',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Generate Refresh Token
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id.toString() },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'your-refresh-secret',
    { expiresIn: '30d' }
  );
};

// ==================== LOGIN (SUPER SIMPLE) ====================
export const login = async (req, res) => {
  try {
    // Accept both 'email' and 'username' fields
    const { username, email, password } = req.body;
    const loginIdentifier = username || email;

    console.log('\n🔐 [LOGIN] ==================== NEW LOGIN ATTEMPT ====================');
    console.log('📝 [LOGIN] Request body fields:', Object.keys(req.body));
    console.log('📝 [LOGIN] Username field:', username);
    console.log('📝 [LOGIN] Email field:', email);
    console.log('📝 [LOGIN] Using identifier:', loginIdentifier);
    console.log('📝 [LOGIN] Password provided:', password ? 'YES (length: ' + password.length + ')' : 'NO');

    // Validation
    if (!loginIdentifier) {
      console.log('❌ [LOGIN] No username or email provided');
      return errorResponse(res, 'Email or username is required', 400);
    }

    if (!password) {
      console.log('❌ [LOGIN] No password provided');
      return errorResponse(res, 'Password is required', 400);
    }

    // FORCE INCLUDE PASSWORD - explicit select
    console.log('🔍 [LOGIN] Searching for user in database...');
    const user = await User.findOne({
      $or: [
        { username: loginIdentifier.toLowerCase().trim() },
        { email: loginIdentifier.toLowerCase().trim() }
      ]
    }).select('+password'); // ⭐ FORCE include password

    if (!user) {
      console.log('❌ [LOGIN] User not found with identifier:', loginIdentifier);
      return errorResponse(res, 'Invalid credentials', 401);
    }

    console.log('✅ [LOGIN] User found!');
    console.log('   - ID:', user._id);
    console.log('   - Username:', user.username);
    console.log('   - Email:', user.email);
    console.log('   - Role:', user.role);
    console.log('🔍 [LOGIN] Password in DB:', user.password ? 'EXISTS (length: ' + user.password.length + ')' : 'MISSING');

    // Simple password check
    if (!user.password) {
      console.error('❌ [LOGIN] CRITICAL: User has no password in database!');
      return errorResponse(res, 'Invalid credentials', 401);
    }

    // Compare password
    console.log('🔐 [LOGIN] Comparing passwords...');
    console.log('   - Input password length:', password.length);
    console.log('   - Stored hash length:', user.password.length);
    
    const isValid = await bcrypt.compare(password, user.password);
    console.log('🔐 [LOGIN] Password comparison result:', isValid ? '✅ MATCH' : '❌ NO MATCH');

    if (!isValid) {
      console.log('❌ [LOGIN] Password mismatch for user:', user.username);
      return errorResponse(res, 'Invalid credentials', 401);
    }

    console.log('✅ [LOGIN] Password verified successfully!');

    // Generate tokens
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    // Return data
    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      profile_picture: user.profile_picture || '',
      token,
      refreshToken
    };

    console.log('✅ [LOGIN] SUCCESS - Sending response');
    console.log('📤 [LOGIN] User data:', { id: userData.id, username: userData.username, role: userData.role });
    console.log('🔐 [LOGIN] Token generated:', token ? 'YES' : 'NO');
    console.log('==================== LOGIN COMPLETE ====================\n');

    return successResponse(res, userData, 'Login successful');

  } catch (error) {
    console.error('❌ [LOGIN] Error:', error);
    return errorResponse(res, error.message, 500);
  }
};

// ==================== REGISTER (SIMPLE) ====================
export const register = async (req, res) => {
  try {
    const { username, email, password, full_name, role } = req.body;

    console.log('📝 [REGISTER] Request received:', { username, email, role });

    // Validation
    if (!username || !email || !password || !role) {
      return errorResponse(res, 'All fields are required', 400);
    }

    if (!['coach', 'trainee'].includes(role)) {
      return errorResponse(res, 'Invalid role. Must be coach or trainee', 400);
    }

    if (password.length < 6) {
      return errorResponse(res, 'Password must be at least 6 characters', 400);
    }

    // Check existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return errorResponse(res, 'Email already registered', 400);
      }
      if (existingUser.username === username) {
        return errorResponse(res, 'Username already taken', 400);
      }
    }

    console.log('✅ Validation passed, creating user...');

    // Create user - NO MANUAL HASHING! Pre-save hook will hash it
    const user = new User({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: password, // Plain password - will be hashed by pre-save hook
      full_name: full_name?.trim() || username.trim(),
      role,
      profile_picture: null,
      bio: '',
      phone_number: '',
      fitness_level: role === 'trainee' ? 'beginner' : undefined
    });

    console.log('💾 [REGISTER] Saving user... (password will be auto-hashed by pre-save hook)');
    await user.save();

    console.log('✅ User created successfully:', user.username, 'Role:', user.role);

    // Generate tokens
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      token,
      refreshToken
    };

    console.log('✅ [REGISTER] Success for role:', role);
    
    return successResponse(res, userData, 'Registration successful', 201);

  } catch (error) {
    console.error('❌ [REGISTER] Error:', error);
    return errorResponse(res, error.message, 500);
  }
};

// ==================== LOGOUT ====================
export const logout = async (req, res) => {
  try {
    return successResponse(res, null, 'Logout successful');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ==================== GET ME ====================
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    return successResponse(res, user, 'User data retrieved');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ==================== REFRESH TOKEN ====================
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return errorResponse(res, 'Refresh token required', 400);
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    const newToken = generateToken(user);
    const newRefreshToken = generateRefreshToken(user);

    return successResponse(res, {
      token: newToken,
      refreshToken: newRefreshToken
    }, 'Token refreshed');

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return errorResponse(res, 'Invalid token', 401);
    }
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token expired', 401);
    }
    return errorResponse(res, error.message, 500);
  }
};

// ==================== CHANGE PASSWORD ====================
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return errorResponse(res, 'Both passwords required', 400);
    }

    if (newPassword.length < 6) {
      return errorResponse(res, 'Password min 6 chars', 400);
    }

    const user = await User.findById(req.user.id).select('+password');
    
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isValid) {
      return errorResponse(res, 'Wrong current password', 401);
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return successResponse(res, null, 'Password changed');

  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ==================== FORGOT PASSWORD ====================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return errorResponse(res, 'Email required', 400);
    }

    return successResponse(res, null, 'Reset link sent if email exists');

  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};