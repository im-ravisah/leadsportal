import axios from "axios";
import { API_BASE_URL } from "../app/env";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

