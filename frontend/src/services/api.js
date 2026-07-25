import axios from "axios";

const api = axios.create({
  baseURL: "https://leaddesk-mini-3bps.onrender.com/api",
});

export default api;