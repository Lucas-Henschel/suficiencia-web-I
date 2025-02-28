import axios from "axios";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const httpImages = axios.create({
  baseURL: import.meta.env.VITE_API_URL_IMAGES,
  headers: {
    "Content-Type": "application/json",
  },
});
