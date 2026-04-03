const AppError = require('../utils/appError');
const HTTP_STATUS = require('../constants/httpStatus');
<<<<<<< HEAD
=======
const { normalizeRole, listAcceptedRoleInputs } = require('../constants/roles');
>>>>>>> e5d7d39399b246ec7b103406ed563368cf8d6abc

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value) {
  return /^\+?[0-9]{10,15}$/.test(value);
}

function validateRegisterPayload(payload) {
  const errors = [];

  if (!payload.fullName || payload.fullName.trim().length < 2) {
    errors.push('fullName must be at least 2 characters long');
  }

  if (!payload.phone || !isValidPhone(payload.phone)) {
    errors.push('phone must be valid (10-15 digits, optional + prefix)');
  }

  if (!payload.email || !isEmail(payload.email)) {
    errors.push('A valid email is required');
  }

  if (!payload.password || payload.password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

<<<<<<< HEAD
  if (payload.role && !['user', 'organizer', 'admin'].includes(payload.role)) {
    errors.push('Role must be one of: user, organizer, admin');
=======
  if (payload.role) {
    const normalizedRole = normalizeRole(payload.role);
    if (!normalizedRole) {
      errors.push(
        `Role is invalid. Accepted values include: ${listAcceptedRoleInputs().join(', ')}`
      );
    } else {
      payload.role = normalizedRole;
    }
>>>>>>> e5d7d39399b246ec7b103406ed563368cf8d6abc
  }

  if (errors.length) {
    throw new AppError(errors.join(', '), HTTP_STATUS.BAD_REQUEST);
  }
}

function validateLoginPayload(payload) {
  const errors = [];

  if (!payload.email || !isEmail(payload.email)) {
    errors.push('A valid email is required');
  }

  if (!payload.password) {
    errors.push('Password is required');
  }

  if (errors.length) {
    throw new AppError(errors.join(', '), HTTP_STATUS.BAD_REQUEST);
  }
}

<<<<<<< HEAD
module.exports = {
  validateRegisterPayload,
  validateLoginPayload
=======
function validateSendOtpPayload(payload) {
  const errors = [];

  if (!payload.email || !isEmail(payload.email)) {
    errors.push('A valid email is required');
  }

  if (errors.length) {
    throw new AppError(errors.join(', '), HTTP_STATUS.BAD_REQUEST);
  }
}

function validateVerifyOtpPayload(payload) {
  const errors = [];

  if (!payload.email || !isEmail(payload.email)) {
    errors.push('A valid email is required');
  }

  if (!payload.otp || !/^\d{6}$/.test(String(payload.otp))) {
    errors.push('otp must be a 6-digit code');
  }

  if (errors.length) {
    throw new AppError(errors.join(', '), HTTP_STATUS.BAD_REQUEST);
  }
}

module.exports = {
  validateRegisterPayload,
  validateLoginPayload,
  validateSendOtpPayload,
  validateVerifyOtpPayload
>>>>>>> e5d7d39399b246ec7b103406ed563368cf8d6abc
};
