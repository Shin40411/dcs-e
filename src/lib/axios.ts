import type { AxiosRequestConfig } from 'axios';

import axios from 'axios';
import { create } from 'domain';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: CONFIG.serverUrl });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/api/auth/me',
    signIn: '/api/v1/auth/auth/login',
    signUp: '/api/auth/sign-up',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: (params: string) => `/api/v1/products${params}`,
    details: (id: string) => `/api/v1/products/get-detail/${id}`,
    search: '/api/product/search',
    create: `/api/v1/products/create`,
    update: (id: string) => `/api/v1/products/update/${id}`,
  },
  category: {
    list: (params: string) => `/api/v1/product-categories/categories${params}`,
    createOrUpdate: (params: string) => `/api/v1/product-categories/categories${params}`,
  },
  unit: {
    list: (params: string) => `/api/v1/units/units${params}`,
    create: `/api/v1/units/create`,
    update: (id: string) => `/api/v1/units/update/${id}`,
  },
  department: {
    list: (params: string) => `/api/v1/departments/departments${params}`,
    create: `/api/v1/departments/create`,
    update: (id: string) => `/api/v1/departments/update/${id}`,
  },
  employeeType: {
    list: (params: string) => `/api/v1/employee-type/employee-types${params}`,
    create: `/api/v1/employee-type/create`,
    update: (id: string) => `/api/v1/employee-type/update/${id}`,
  },
  customer: {
    list: (params: string) => `/api/v1/customers/customers${params}`,
    create: `/api/v1/customers/create`,
    update: (id: string) => `/api/v1/customers/update/${id}`,
  },
  bankAccount: {
    list: (params: string) => `/api/v1/bank-accounts/bank-accounts${params}`,
    create: `/api/v1/bank-accounts/create`,
    update: (id: string) => `/api/v1/bank-accounts/update/${id}`,
  },
  suppliers: {
    list: (params: string) => `/api/v1/suppliers/suppliers${params}`,
    create: `/api/v1/suppliers/create`,
    update: (id: string) => `/api/v1/suppliers/update/${id}`,
  },
  employees: {
    list: (params: string) => `/api/v1/employees/employees${params}`,
    create: `/api/v1/employees/employees/create`,
    update: (id: string) => `/api/v1/employees/employees/update/${id}`,
  },
  upload: {
    uploadImage: '/api/v1/uploads/upload',
    uploadMultipleImages: '/api/v1/uploads/upload-xml',
  }
};
