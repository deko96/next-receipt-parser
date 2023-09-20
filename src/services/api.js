import axios from "axios";

const client = axios.create({
  baseURL: process.env.API_URL || "http://localhost:3000/api",
});

export default client;
