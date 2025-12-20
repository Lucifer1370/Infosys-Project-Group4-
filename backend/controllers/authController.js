const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token with role in payload
const generateToken = (id, role) => {
  return jwt.sign({ userId: id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { 
      fullName, 
      email, 
      password, 
      role, 
      medicalLicense, 
      specialization,
      pharmacyLicenseNumber,
      address
    } = req.body;

    // Validation - Basic fields
    if (!fullName || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, password, and role'
      });
    }

    // Role validation - allow all defined roles
    if (!['Patient', 'Doctor', 'Pharmacist', 'Admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Allowed roles are Patient, Doctor, Pharmacist, and Admin'
      });
    }

    // Doctor-specific validation - MANDATORY fields
    if (role === 'Doctor') {
      if (!medicalLicense || !specialization) {
        return res.status(400).json({
          success: false,
          message: 'Doctor registration requires Medical License Number and Specialization'
        });
      }
    }

    // Pharmacy-specific validation - MANDATORY fields
    if (role === 'Pharmacist') {
      if (!pharmacyLicenseNumber || !address) {
        return res.status(400).json({
          success: false,
          message: 'Pharmacist registration requires Pharmacy License Number and Address'
        });
      }
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const userData = {
      fullName,
      email,
      password,
      role
    };

    // Add Doctor-specific fields only if role is Doctor
    if (role === 'Doctor') {
      userData.medicalLicense = medicalLicense;
      userData.specialization = specialization;
    }

    // Add Pharmacist-specific fields only if role is Pharmacist
    if (role === 'Pharmacist') {
      userData.pharmacyLicenseNumber = pharmacyLicenseNumber;
      userData.address = address;
    }

    const user = await User.create(userData);

    // Generate token with role
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check if user exists and get password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token with role
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.fullName,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        medicalLicense: user.medicalLicense,
        specialization: user.specialization,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get current logged in user (alias for /me)
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        doctorLicenseNumber: user.doctorLicenseNumber,
        specialization: user.specialization,
        pharmacyLicenseNumber: user.pharmacyLicenseNumber,
        address: user.address,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


