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
    delete: (id: number) => `/api/v1/products/delete/${id}`
  },
  category: {
    list: (params: string) => `/api/v1/product-categories/categories${params}`,
    createOrUpdate: (params: string) => `/api/v1/product-categories/categories${params}`,
    delete: (id: number) => `/api/v1/product-categories/categories/${id}`
  },
  unit: {
    list: (params: string) => `/api/v1/units/units${params}`,
    create: `/api/v1/units/create`,
    update: (id: string) => `/api/v1/units/update${id}`,
    delete: (id: number) => `/api/v1/units/delete/${id}`
  },
  department: {
    list: (params: string) => `/api/v1/departments/departments${params}`,
    create: `/api/v1/departments/create`,
    update: (id: string) => `/api/v1/departments/update${id}`,
    delete: (id: number) => `/api/v1/departments/delete/${id}`
  },
  employeeType: {
    list: (params: string) => `/api/v1/employee-type/employee-types${params}`,
    create: `/api/v1/employee-type/create`,
    update: (id: string) => `/api/v1/employee-type/update${id}`,
    delete: (id: number) => `/api/v1/employee-type/delete/${id}`
  },
  customer: {
    list: (params: string) => `/api/v1/customers/customers${params}`,
    create: `/api/v1/customers/create`,
    update: (id: string) => `/api/v1/customers/update${id}`,
    delete: (id: number) => `/api/v1/customers/delete/${id}`
  },
  bankAccount: {
    list: (params: string) => `/api/v1/bank-accounts/bank-accounts${params}`,
    create: `/api/v1/bank-accounts/create`,
    update: (id: string) => `/api/v1/bank-accounts/update${id}`,
    delete: (id: number) => `/api/v1/bank-accounts/delete/${id}`
  },
  suppliers: {
    list: (params: string) => `/api/v1/suppliers/suppliers${params}`,
    create: `/api/v1/suppliers/create`,
    update: (id: string) => `/api/v1/suppliers/update${id}`,
    delete: (id: number) => `/api/v1/suppliers/delete/${id}`
  },
  employees: {
    list: (params: string) => `/api/v1/employees/employees${params}`,
    create: `/api/v1/employees/create`,
    update: (id: string) => `/api/v1/employees/update${id}`,
    delete: (id: number) => `/api/v1/employees/delete/${id}`
  },
  quotation: {
    list: (params: string) => `/api/v1/quotation/quotations${params}`,
    detail: (id: number, params: string) => `/api/v1/quotation/get-detail/${id}${params}`,
    create: `/api/v1/quotation/create`,
    update: {
      root: (id: number) => `/api/v1/quotation/update/${id}`,
      addProducts: (id: number) => `/api/v1/quotation/add-product/${id}`,
      editProducts: '/api/v1/quotation/edit-quantity-product',
      deleteProduct: `/api/v1/quotation/delete-quotation-product`
    },
    delete: (id: number) => `/api/v1/quotation/delete/${id}`,
    sendMail: '/api/v1/quotation/send-mail'
  },
  contract: {
    list: (params: string) => `/api/v1/contracts/contracts${params}`,
    detail: (params: string) => `/api/v1/contracts/get-contract-detail${params}`,
    create: `/api/v1/contracts/create`,
    update: {
      root: (id: number) => `/api/v1/contracts/update-contract-info/${id}`,
      addProducts: (id: number) => `/api/v1/contracts/add-product-to-contract/${id}`,
      deleteProduct: `/api/v1/contracts/delete-product-from-contract`
    },
    // delete: (id: number) => `/api/v1/quotation/delete/${id}`,
  },
  upload: {
    uploadImage: '/api/v1/uploads/upload',
    uploadMultipleImages: '/api/v1/uploads/upload-xml',
  }
};