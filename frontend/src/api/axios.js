import axios from "axios";

const api = axios.create({
    baseURL: import.meta.process.env.VITE_BACKEND_URL, // backend base url
    withCredentials: true, // safe to keep (cookies / future use)
});

export default api;
