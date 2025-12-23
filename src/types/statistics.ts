import { IDateValue } from "./common";

export type IchartResponse = {
    statusCode: number;
    message: string;
    data: IchartsData[];
}

export type IContractAmountRes = {
    statusCode: number;
    message: string;
    data: {
        customerContract: IContractAmount;
        supContract: IContractAmount;
    }
}

export type IFinanceRes = {
    statusCode: number;
    message: string;
    data: IFinanceData;
}

export type IBestSellerRes = {
    statusCode: number;
    message: string;
    data: {
        pageNumber: number;
        pageSize: number;
        totalRecord: number;
        totalPages: number;
        items: IBestSeller[];
    };
}

export type IContractValRes = {
    statusCode: number;
    message: string;
    data: {
        pageNumber: number;
        pageSize: number;
        totalRecord: number;
        totalPages: number;
        items: IContractValue[];
    };
}

export type ITopSalerRes = {
    statusCode: number;
    message: string;
    data: {
        pageNumber: number;
        pageSize: number;
        totalRecord: number;
        totalPages: number;
        items: ITopSaler[];
    };
}

export type IProductStatisticRes = {
    statusCode: number;
    message: string;
    data: IProductStatistic;
}

export type ILocalReceiptRes = {
    statusCode: number;
    message: string;
    data: ILocalReceipt;
}

export type IchartsData = {
    year: number;
    total: number;
    months: IchartMonth[]
}

export type IchartMonth = {
    total: number,
    month: number
}

export type IContractAmount = {
    totalContracts: number;
    totalOnTime: number;
    totalOverTime: number;
    onTimeAmounts: number;
    overTimeAmounts: number;
    totalContractAmount: number;
}

export type IFinanceData = {
    contractsTotal: number;
    totalCollected: number;
    totalSpended: number;
    needSpend: number;
    needCollect: number;
}

export type ILocalReceipt = {
    totalSpendAmounts: number;
    totalCollectAmounts: number;
    type: string;
}

export type IProductStatistic = {
    inventory: number;
    inventoryAmounts: number;
    totalImport: number;
    totalImportAmounts: number;
    totalExport: number;
    totalExportAmounts: number;
}

export type IBestSeller = {
    productID: number;
    name: string;
    code: string;
    image: string;
    purchasePrice: number;
    price: number;
    unitID: number;
    unitName: string;
    vat: number;
    stock: number;
    sold: number;
    totalPurchaseAmounts: number;
}

export type IContractValue = {
    contractID: number;
    contractNo: string;
    signatureDate: IDateValue;
    customerName: string;
    customerCompany: string;
    total: number;
    status: number;
}

export type ITopSaler = {
    employeeId: number;
    fullname: string;
    email: string;
    birthDay: string;
    phone: string;
    totalAmounts: number;
    percentOfTotal: number;
    quantityContract: number;
}

