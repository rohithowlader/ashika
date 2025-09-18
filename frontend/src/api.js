import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // 👈 change 5000 to your backend port
  withCredentials: true, // if you want cookies (JWT, sessions)
});

export default API;
