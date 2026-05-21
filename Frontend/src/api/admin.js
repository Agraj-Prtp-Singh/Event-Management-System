import axios from "axios";
import { getStoredToken } from "../utils/auth";

const BASE_URL = "http://localhost:5000/api/v1";

const getAuthHeaders = () => {
  const token = getStoredToken();

  return {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
};

const normalizeResponse = (response) => {
  const payload = response.data?.data ?? response.data;
  return payload?.items ?? payload;
};

export const getAdminEvents = async (params = {}) => {
  try {
    const response = await axios.get(`${BASE_URL}/events/pending`, {
      ...getAuthHeaders(),
      params,
    });
    return normalizeResponse(response);
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to fetch events"
    );
  }
};

export const updateAdminEvent = async (eventId, eventData) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/events/${eventId}`,
      eventData,
      getAuthHeaders()
    );
    return normalizeResponse(response);
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to update event"
    );
  }
};

export const reviewAdminEvent = async (eventId, decision, denialReason = "") => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/events/${eventId}/review`,
      {
        decision,
        ...(denialReason ? { denialReason } : {}),
      },
      getAuthHeaders()
    );
    return normalizeResponse(response);
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to review event"
    );
  }
};

export const deleteAdminEvent = async (eventId) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/events/${eventId}`,
      getAuthHeaders()
    );
    return normalizeResponse(response);
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to delete event"
    );
  }
};

export const getAdminCategories = async (params = {}) => {
  try {
    const response = await axios.get(`${BASE_URL}/admin/categories`, {
      ...getAuthHeaders(),
      params,
    });

    return response.data?.data ?? { items: [], pagination: {} };
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to fetch categories"
    );
  }
};

export const createAdminCategory = async (categoryData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/admin/categories`,
      categoryData,
      getAuthHeaders()
    );

    return normalizeResponse(response);
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to create category"
    );
  }
};

export const updateAdminCategory = async (categoryId, categoryData) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/admin/categories/${categoryId}`,
      categoryData,
      getAuthHeaders()
    );

    return normalizeResponse(response);
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to update category"
    );
  }
};

export const deleteAdminCategory = async (categoryId) => {
  try {
    await axios.delete(
      `${BASE_URL}/admin/categories/${categoryId}`,
      getAuthHeaders()
    );

    return true;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to delete category"
    );
  }
};