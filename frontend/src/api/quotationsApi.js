import axios from "axios";

const API_BASE_URL = "https://quottrack.onrender.com/api";

export const fetchQuotations = async () => {
  const response = await axios.get(`${API_BASE_URL}/quotations`);
  return response.data;
};
export const createQuotation = async (quotationData) => {
  const response = await axios.post(`${API_BASE_URL}/quotations`, quotationData);
  return response.data;
};

