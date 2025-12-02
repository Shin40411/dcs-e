import { IDateValue } from "./common";

export type ResContractWarehouseImport = {
    statusCode: number;
    message: string;
    data: IContractWarehouseImportData;
};

export type IContractWarehouseImportData = {
    pageNumber: number;
    pageSize: number;
    totalRecord: number;
    totalPages: number;
    items: IContractWarehouseImportItem[];
};

export type IContractWarehouseImportItem = {
    id: number;
    warehouseImportNo: string;
    supplierID: number;
    supplierName: string;
    phone: string | null;
    compnayName: string | null;
    email: string | null;
    contractSupID: number | null;
    conntractSupNo: string | null;
    importDate: IDateValue;
    employerID: number;
    employeeName: string | null;
    employeePhone: string | null;
    employeeAddress: string | null;
    employeeEmail: string | null;
    receiverName: string;
    receiverPhone: string;
    reciverAddress: string | null;
    paid: number;
    total: number;
    createdDate: IDateValue;
    createdBy: string;
    modifyDate: string | null;
    modifyBy: string | null;
    note: string | null;
    discount: number;
};

export type IContractWarehouseImportDto = {
    supplierID: number;
    contractID: number | null;
    employeeID: number;
    importDate: IDateValue;
    reciverName: string;
    reciverPhone: string;
    receiverAddress: string;
    paid: number;
    note: string | null;
    discount: number;
    products?: {
        productID: number;
        quantity: number;
        price: number;
        vat: number;
        openingStock: number;
    }[];
};

export type ResDetailsWarehouseImportProduct = {
    statusCode: number;
    message: string;
    data: {
        pageNumber: number;
        pageSize: number;
        totalRecord: number;
        totalPages: number;
        items: IWarehouseImportProduct[];
    };
}

export type IWarehouseImportProduct = {
    id: number;
    productID: number;
    productName: string;
    unitProductName: string;
    unitProductID: number;
    price: number;
    quantity: number;
    vat: number;
    total: number;
    openingStock: number;
};