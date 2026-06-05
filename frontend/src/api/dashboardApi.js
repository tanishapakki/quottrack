import axios from "axios";

const API_BASE_URL = "https://quottrack.onrender.com/api";

export const fetchDashboardStats = async () => {
  const response = await axios.get(`${API_BASE_URL}/dashboard`);
  return response.data;
};
