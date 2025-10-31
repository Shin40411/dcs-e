import { IDateValue } from "./common";

export type ResContractWarehouseExport = {
    statusCode: number;
    message: string;
    data: IContractWarehouseExportData;
};

export type IContractWarehouseExportData = {
    pageNumber: number;
    pageSize: number;
    totalRecord: number;
    totalPages: number;
    items: IContractWarehouseExportItem[];
}

export type IContractWarehouseExportItem = {
    id: number;
    warehouseExportNo: string;
    customerID: number;
    name: string;
    phone: string;
    companyName: string;
    email: string;
    address: string;
    contractID: number;
    contractNo: string;
    reciverName: string;
    reciverPhone: string;
    reciverAddress: string;
    paid: number;
    total: number;
    note: string | null;
    discount: number;
    employeeID: number;
    employerName: string;
    employeeAddress: string;
    employeePhone: string;
    createdDate: IDateValue;
    createdBy: string;
    modifyDate: IDateValue;
    modifyBy: string;
};

export type IContractWarehouseExportDto = {
    warehouseExportNo?: string;
    customerID: number;
    contractID: number;
    employeeID: number;
    exportDate: IDateValue;
    receiverName: string;
    receiverPhone: string;
    receiverAddress: string;
    paid: number;
    note: string;
    discount: number;
    products?: {
        productID: number;
        quantity: number;
    }[];
};
