import axios from "axios";

// If VITE_BACKEND_URL points to localhost or isn't set, use relative URL to route through Express server proxy
const rawBackendUrl = import.meta.env.VITE_BACKEND_URL || '';
const baseURL = (rawBackendUrl.includes('localhost') && window.location.hostname !== 'localhost') 
  ? '' 
  : rawBackendUrl;

const api = axios.create({
    baseURL,
    withCredentials: true
});

export default api;
