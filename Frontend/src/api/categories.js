import axios from "axios";

const BASE_URL = "http://localhost:5000/api/v1";

const DEFAULT_CATEGORIES = [
  { _id: "default-tech", name: "Tech" },
  { _id: "default-social", name: "Social" },
  { _id: "default-career", name: "Career" },
  { _id: "default-arts", name: "Arts" },
  { _id: "default-business", name: "Business" },
  { _id: "default-other", name: "Other" },
];

export const getActiveCategories = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/categories`, {
      params: {
        isActive: true,
        limit: 100,
      },
    });

    const categories = response.data?.data?.items || [];

    return categories.length ? categories : DEFAULT_CATEGORIES;
  } catch (error) {
    console.error("Failed to fetch categories", error);
    return DEFAULT_CATEGORIES;
  }
};