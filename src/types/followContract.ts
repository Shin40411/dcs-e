import { IDateValue } from "./common";

export type ResponseFollowList<T = any> = {
    statusCode: number;
    message: string;
    data: T;
}

export type ResponseFollowData<T = any> = {
    pageNumber: number;
    pageSize: number;
    totalRecord: number;
    totalPages: number;
    items: T[];
}

//-----------------------------------///
export type IFollowContractItem = {
    contractNo: string;
    contractAmounts: number;
    totalCollected: number;
    needCollect: number;
    onTimeAmount: number;
    overTimeAmount: number;
    percent: number;
    status: string;
}

export type IBatchCollectItem = {
    batch: number;
    needCollect: number;
    collected: number;
    remainning: number;
    receivableDate: IDateValue;
    status: string;
    lateDate: number;
    upComingDate: number;
}

export type IHistoryCollect = {
    totalBatch: number;
    batch: number;
    date: IDateValue;
    payer: string;
    needCollect: number;
    totalCollect: number;
    receiptNo: string;
}

export type IFollowNeedSpendItem = {
    totalNeedSpend: string;
    remaining: number;
    spent: number;
    onTimeAmounts: number;
    overTimeAmounts: number;
    percent: number;
    status: string;
}

export type INeedSpendBySupContract = {
    contractSupNo: string;
    supplierCompany: string;
    supplierName: string;
    contractTotalAmounts: number;
    spended: number;
    remaining: number;
    status: string;
    lastPaymentDate: IDateValue;
    lateDate: number,
    upComingDate: number;
}

export type IHistorySpend = {
    batch: number;
    totalBatch: number;
    date: IDateValue;
    supplierName: string;
    needSpendAmounts: number;
    spended: number;
    receiptNo: string;
}