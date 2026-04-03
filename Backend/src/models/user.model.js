const mongoose = require('mongoose');
<<<<<<< HEAD
=======
const { ROLES } = require('../constants/roles');
>>>>>>> e5d7d39399b246ec7b103406ed563368cf8d6abc

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    role: {
      type: String,
<<<<<<< HEAD
      enum: ['user', 'organizer', 'admin'],
      default: 'user'
=======
      enum: [ROLES.STUDENT, ROLES.VENDOR, ROLES.EVENT_PLANNER, ROLES.ADMIN],
      default: ROLES.STUDENT
    },
    otpCodeHash: {
      type: String,
      default: null
    },
    otpExpiresAt: {
      type: Date,
      default: null
    },
    otpAttempts: {
      type: Number,
      default: 0
    },
    otpVerifiedAt: {
      type: Date,
      default: null
>>>>>>> e5d7d39399b246ec7b103406ed563368cf8d6abc
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
