import axios from "axios";

const BASE_URL = "http://localhost:5000/api/v1/auth";
const unwrapResponse = (response) => response.data?.data ?? response.data;

export const loginUser = async ({ email, password }) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/login`,
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return unwrapResponse(response);
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Login failed",
    );
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/register`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return unwrapResponse(response);
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Registration failed",
    );
  }
};

export const sendOtp = async (email) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/otp/send`,
      { email },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return unwrapResponse(response);
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to send OTP",
    );
  }
};

export const verifyOtp = async ({ email, otp }) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/otp/verify`,
      { email, otp },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return unwrapResponse(response);
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "OTP verification failed",
    );
  }
};
