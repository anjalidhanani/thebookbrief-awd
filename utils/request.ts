import axios from "axios";

const service = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'x-api-key': process.env.NEXT_PUBLIC_APP_TOKEN }
});

export default service;
