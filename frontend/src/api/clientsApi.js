import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export const fetchClients = async () => {
  const response = await axios.get(`${API_BASE_URL}/clients`);
  return response.data;
};
export const createClient = async (clientData) => {
  const response = await axios.post(`${API_BASE_URL}/clients`, clientData);
  return response.data;
};

