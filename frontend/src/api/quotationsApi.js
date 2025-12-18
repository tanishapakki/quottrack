import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export const fetchQuotations = async () => {
  const response = await axios.get(`${API_BASE_URL}/quotations`);
  return response.data;
};
export const createQuotation = async (quotationData) => {
  const response = await axios.post(`${API_BASE_URL}/quotations`, quotationData);
  return response.data;
};

