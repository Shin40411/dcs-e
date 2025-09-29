import { IDateValue } from "./common";

export type IContractItem = {
    id: number;
    contractNo: string;
    customerID: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress: string;
    companyName: string;
    signatureDate: IDateValue;
    deliveryAddress: string;
    deliveryTime: IDateValue;
    downPayment: number;
    nextPayment: number;
    lastPayment: number;
    total: number;
    copiesNo: number;
    keptNo: number;
    status: string;
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

export type ResContractList = {
    statusCode: number;
    message: string;
    data: IContractListData;
};