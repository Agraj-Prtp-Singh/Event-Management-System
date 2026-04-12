import axios from "axios";

const BASE_URL = "http://localhost:5000/api/v1";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
};

// Fetch student dashboard stats (events attended, upcoming, total bookings)
export const getStudentStats = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/student/stats`,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to fetch student stats",
    );
  }
};

// Fetch student's upcoming bookings
export const getStudentBookings = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/student/bookings`,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to fetch bookings",
    );
  }
};

// Fetch all available events (for browse / dashboard preview)
export const getEvents = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/events`,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to fetch events",
    );
  }
};