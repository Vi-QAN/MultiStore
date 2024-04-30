// authApi.js
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/auth'; // Assuming your server is running on port 3000

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const register = async (email, username, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/register`, { email, username, password });
    return response.data;
  } catch (error){
    throw error.response.data;
  }
}

export const logout = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/logout`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
