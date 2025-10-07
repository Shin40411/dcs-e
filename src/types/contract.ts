import { IDateValue } from "./common";

export type IContractItem = {
    id: number;
    contractNo: string;
    customerID: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress: string;
    customerTaxCode: string;
    companyName: string;
    customerBank: string;
    customerBankNo: string;
    signatureDate: IDateValue;
    deliveryAddress: string;
    deliveryTime: IDateValue;
    downPayment: number;
    nextPayment: number;
    lastPayment: number;
    total: number;
    copiesNo: number;
    keptNo: number;
    status: number;
    createDate: IDateValue;
    createdBy: string;
    modifyDate: IDateValue;
    modifiedBy: string;
    note: string;
    seller: string;
    discount: number;
};

export type IContractListData = {
    pageNumber: number;
    pageSize: number;
    totalRecord: number;
    totalPages: number;
    items: IContractItem[];
};

export type IContractProduct = {
    id: number;
    contractID: number;
    productID: number;
    productName: string;
    price: number;
    quantity: number;
    vat: number;
    unit: string;
    unitProductID: number;
    total: number;
    exported: number; //số lượng xuất kho
    remaining: number;
};

export type IContractDetails = {
    contractID: number;
    contractNo: string;
    products: IContractProduct[];
};

export type IContractData = {
    pageNumber: number;
    pageSize: number;
    totalRecord: number;
    totalPages: number;
    items: IContractDetails[];
};

export type IContractDetailDto = {
    productID: string;
    quantity: number;
    price: number;
    unit: string;
}

export type ResContractList = {
    statusCode: number;
    message: string;
    data: IContractListData;
};

export type ResContractItem = {
    statusCode: number;
    message: string;
    data: IContractData;
}

export type FilterValues = {
    fromDate: IDateValue;
    toDate: IDateValue;
};

export type IContractDto = {
    ContractNo: string;
    customerId: number;
    signatureDate: IDateValue;
    deliveryAddress: string;
    deliveryTime: IDateValue;
    downPayment: number;
    nextPayment: number;
    lastPayment: number;
    copiesNo: number;
    keptNo: number;
    status: number;
    note: string;
    discount: number;
    products: IContractDetailDto[];
};

export type IContractDao = {
    customerId: number;
    signatureDate: IDateValue;
    deliveryAddress: string;
    deliveryTime: IDateValue;
    downPayment: number;
    nextPayment: number;
    lastPayment: number;
    copiesNo: number;
    keptNo: number;
    status: number;
    note: string;
    discount: number;
};

export type IContractProductToDelete = {
    contractId: string;
    productID: string;
}