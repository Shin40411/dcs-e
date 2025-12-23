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
    changePassword: '/api/v1/auth/auth/change-password',
    changeProfilePassword: '/api/v1/auth/auth/change-my-password'
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
  restore: '/api/v1/generic-repository/restore',
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
    callQr: (params: string) => `/api/v1/bank-accounts/vietqr-banks${params}`,
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
    me: '/api/v1/employees/get-me',
    list: (params: string) => `/api/v1/employees/employees${params}`,
    getUserType: (params: string) => `/api/v1/users/get-user-types${params}`,
    create: `/api/v1/employees/create`,
    createUser: `/api/v1/users/create`,
    lockUnlock: (id: number) => `/api/v1/users/lock-or-unlock/${id}`,
    update: (id: string) => `/api/v1/employees/update${id}`,
    updateMe: `api/v1/employees`,
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
      editProductForm: (id: number) => `/api/v1/quotation/edit-product-form-quotation/${id}`,
      deleteProduct: `/api/v1/quotation/delete-quotation-product`
    },
    delete: (id: number) => `/api/v1/quotation/delete/${id}`,
    sendMail: '/api/v1/quotation/send-mail'
  },
  contract: {
    list: (params: string) => `/api/v1/contracts/contracts${params}`,
    contractSupplier: (contractNo: string) => `/api/v1/contracts/get-supplier-contract-by-contract?contractNo=${contractNo}`,
    detail: (params: string) => `/api/v1/contracts/get-contract-detail${params}`,
    create: `/api/v1/contracts/create`,
    update: {
      root: (id: number) => `/api/v1/contracts/update-contract-info/${id}`,
      addProducts: (id: number) => `/api/v1/contracts/add-product-to-contract/${id}`,
      editProducts: '/api/v1/contracts/update-product-quantity-from-contract',
      editProductForm: (id: number) => `/api/v1/contracts/edit-product-form-contract/${id}`,
      deleteProduct: `/api/v1/contracts/delete-product-from-contract`
    },
    sendMail: '/api/v1/contracts/send-email',
    delete: (id: number) => `/api/v1/contracts/delete-contract/${id}`,
    getVouchers: (params: string) => `/api/v1/contracts/contractnos${params}`
  },
  contractSupplier: {
    list: (params: string) => `/api/v1/contract-suppliers/supplier-contracts${params}`,
    detail: (params: string) => `/api/v1/contract-suppliers/get-detail/${params}`,
    create: `/api/v1/contract-suppliers/create`,
    update: {
      root: (id: number) => `/api/v1/contract-suppliers/edit-contract-sup/${id}`,
      addProducts: (id: number) => `/api/v1/contract-suppliers/add-product-to-contract/${id}`,
      editProducts: '/api/v1/contract-suppliers/update-quantity-product-from-contract',
      editProductForm: (id: number) => `/api/v1/contract-suppliers/edit-product-from-sup-contract/${id}`,
      deleteProduct: `/api/v1/contract-suppliers/delete-product-from-contract`
    },
    delete: (id: number) => `/api/v1/contract-suppliers/delete-supcontract/${id}`,
    getVouchers: (params: string) => `/api/v1/contract-suppliers/contractnos${params}`
  },
  contractAttachment: {
    list: (params: string) => `/api/v1/contract-storages/get-file-by-contract${params}`,
    upload: '/api/v1/contract-storages/upload-file',
    delete: '/api/v1/contract-storages/delete-contract-file',
    download: (fileId: number) => `/api/v1/contract-storages/download/${fileId}`,
  },
  contractReceipt: {
    list: (params: string) => `/api/v1/contract-receipts/get-receipts${params}`,
    totalSpend: (contractNo: string) => `/api/v1/contract-receipts/history-spend-by-customer-contract?customerContractNo=${contractNo}`,
    create: '/api/v1/contract-receipts/create',
    update: (id: number) => `/api/v1/contract-receipts/edit-receipt/${id}`,
    delete: '/api/v1/contract-receipts/delete-receipt'
  },
  contractWarehouse: {
    list: (params: string) => `/api/v1/warehouse-exports/get-exports${params}`,
    remaining: (contractId: number) => `/api/v1/contracts/get-remining-product?contractId=${contractId}`,
    details: (ExportID: number) => `/api/v1/warehouse-exports/get-detail?ExportID=${ExportID}&pageNumber=1&pageSize=99999`,
    create: '/api/v1/warehouse-exports/create',
    update: (id: string) => `/api/v1/warehouse-exports/edit/${id}`,
    delete: (id: number) => `/api/v1/warehouse-exports/delete/${id}`
  },
  contractWarehouseImport: {
    list: (params: string) => `/api/v1/warehouse-imports/get-imports${params}`,
    remaining: (contractId: number) => `/api/v1/contract-suppliers/reamainning-supplier-contract?supplierContractId=${contractId}`,
    details: (ImportID: number) => `/api/v1/warehouse-imports/get-details?importId=${ImportID}&pageNumber=1&pageSize=99999`,
    create: '/api/v1/warehouse-imports/create',
    update: (id: string) => `/api/v1/warehouse-imports/edit-import/${id}`,
    delete: (id: number) => `/api/v1/warehouse-imports/delete/${id}`
  },
  upload: {
    uploadImage: '/api/v1/uploads/upload',
    uploadMultipleImages: '/api/v1/uploads/upload-xml',
  },
  statistic: {
    chart: {
      customer: (year: number) => `/api/v1/statictis/total-customer-contract?year=${year}`,
      supplier: (year: number) => `/api/v1/statictis/total-suplier-contract?year=${year}`
    },
    contract: (filter: string) => `/api/v1/statictis/sumary-on-and-over-time-amount-contract?TimeFilter=${filter}`,
    finance: (filter: string) => `/api/v1/statictis/collect-spend-from-contracts?TimeFilter=${filter}`,
    internalReceipt: (params: string) => `/api/v1/statictis/statictis-local-receipts${params}`,
    productsInStock: (filter: string) => `/api/v1/statictis/products-in-stock?timeFilter=${filter}`,
    contractValue: (params: string) => `/api/v1/statictis/top-contracts?${params}`,
    bestSeller: (params: string) => `/api/v1/statictis/get-best-selling-product${params}`,
    topSaler: (params: string) => `/api/v1/statictis/get-top-seller?${params}`
  },
  followContract: {
    needCollect: (params: string) => `/api/v1/contracts/need-collect${params}`,
    batchCollect: (params: string) => `/api/v1/contract-receipts/bach-need-collect${params}`,
    historyCollect: (params: string) => `/api/v1/contract-receipts/history-collect${params}`,
    needSpend: (params: string) => `/api/v1/contracts/need-spend${params}`,
    needSpendForContract: (params: string) => `/api/v1/contracts/need-spend-supplier${params}`,
    historySpend: (params: string) => `/api/v1/contract-receipts/history-spend${params}`,
    getReceipt: (params: string) => `/api/v1/contract-receipts/receipt${params}`
  },
  report: {
    root: (params: string) => `/api/v1/reports/get-reports-by-contract${params}`,
    create: '/api/v1/reports'
  },
  permission: {
    root: (params: string) => `/api/v1/permissions/get-permissions${params}`,
    deparment: (params: string) => `/api/v1/permissions/department-permissions${params}`,
    update: '/api/v1/permissions/set-unset-department-permission',
    byUser: '/api/v1/permissions/permissions-by-user'
  },
  internal: {
    root: (params: string) => `/api/v1/receipts/get-receipts${params}`,
    transfer: (params: string) => `/api/v1/transfer/get-transfer${params}`,
    receivers: (params: string) => `/api/v1/receipts/receivers${params}`,
    payers: (params: string) => `/api/v1/receipts/payers${params}`,
    createTransfer: '/api/v1/transfer/internal-transfer',
    create: '/api/v1/receipts/create',
    update: (id: number) => `/api/v1/receipts/edit-receipt/${id}`,
    delete: (id: number) => `/api/v1/receipts/delete-receipt/${id}`,
    deleteTransfer: (id: number) => `/api/v1/transfer/delete/${id}`
  },
  companyInfo: {
    root: '/api/v1/company-info',
  }
};