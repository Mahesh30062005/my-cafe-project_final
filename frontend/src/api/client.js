/**
 * api/client.js
 * Centralised Axios instances and API call functions.
 */

import axios from 'axios';
import { getAuthToken } from '../context/AuthContext.jsx';

const BASE_URL ="https://my-cafe-project-6zrt.onrender.com/api";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
    'Accept':       'application/json',
  },
});

const adminClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
    'Accept':       'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error)  => Promise.reject(error)
);

adminClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error)  => Promise.reject(error)
);

const normalizeError = (error) => {
  const message =
    error.response?.data?.message ||
    error.response?.data?.error   ||
    error.message                  ||
    'Something went wrong. Please try again.';

  const fieldErrors = error.response?.data?.fieldErrors ?? null;

  return Promise.reject({ message, fieldErrors, status: error.response?.status });
};

apiClient.interceptors.response.use(
  (response) => response,
  normalizeError
);

adminClient.interceptors.response.use(
  (response) => response,
  normalizeError
);

// Auth (customer)
export const signup = (data) =>
  apiClient.post('/auth/signup', data).then((res) => res.data);

export const login = (data) =>
  apiClient.post('/auth/login', data).then((res) => res.data);

// Menu + feedback
export const fetchMenu = () =>
  apiClient.get('/menu').then((res) => res.data);

export const submitFeedback = (data) =>
  apiClient.post('/feedback', data).then((res) => res.data);

export const fetchFeedbackSummary = () =>
  apiClient.get('/feedback/summary').then((res) => res.data);

// Orders
export const createOrder = (data) =>
  apiClient.post('/orders', data).then((res) => res.data);

export const fetchCurrentOrders = () =>
  apiClient.get('/orders/current').then((res) => res.data);

export const fetchActiveParcelOrders = () =>
  apiClient.get('/orders/parcel-active').then((res) => res.data);

export const finishOrder = (orderId) =>
  apiClient.patch(`/orders/${orderId}/finish`).then((res) => res.data);

// Admin auth
export const adminLoginPassword = (data) =>
  adminClient.post('/admin/auth/password', data).then((res) => res.data);

export const adminRequestOtp = (data) =>
  adminClient.post('/admin/auth/otp/request', data).then((res) => res.data);

export const adminVerifyOtp = (data) =>
  adminClient.post('/admin/auth/otp/verify', data).then((res) => res.data);

// Employees (admin)
export const fetchEmployees = () =>
  adminClient.get('/admin/employees').then((res) => res.data);

export const createEmployee = (data) =>
  adminClient.post('/admin/employees', data).then((res) => res.data);

export const deleteEmployee = (id) =>
  adminClient.delete(`/admin/employees/${id}`).then((res) => res.data);

export const fetchLoyaltyStatus = () =>
  apiClient.get('/loyalty/me').then((res) => res.data);

export default apiClient;
