import axios from 'axios';

const api = axios.create({
  // Change this line:
  // baseURL: process.env.REACT_APP_API_URL,

  // To this:
  baseURL: import.meta.env.VITE_API_URL,
});

// Add a request interceptor to include the token in every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;