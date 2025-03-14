import axios from "axios";

export const apiClient = axios.create({
    baseURL: "http://localhost:5000",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });