import { IDateValue } from "./common";

export type ResponseInternalList<T = any> = {
    statusCode: number;
    message: string;
    data: {
        pageNumber: number;
        pageSize: number;
        totalRecord: number;
        totalPages: number;
        items: T[];
    };
}

export type ReceiptAndSpendData = {
    receiptId: number;
    receiptNo: string;
    receiptDate: IDateValue;
    bankAccountID: number;
    bankAccountName: string;
    bankNo: string;
    bank: string;
    bookingKeeping: number;
    debit: number;
    credit: number;
    name: string;
    address: string;
    cost: number;
    reason: string;
    isReceive: boolean;
    createdDate: IDateValue;
    createdBy: string;
    modifyDate: IDateValue;
    modifyBy: string;
    targetType: string;
    targetCode: string;
    employeeCode: string;
    employeeName: string;
};

export type TransferData = {
    id: number;
    transferNo: string;
    bankAccountIDSend: number;
    sendedBankName: string;
    sendedBank: string;
    sendedBankNo: string;
    bankAccountIDReceived: number;
    receivedBankName: string;
    receivedBank: string;
    receivedBankNo: string;
    cost: number;
    charge: number;
    note: string;
    createdDate: IDateValue;
    createBy: string;
    modifydate: IDateValue;
    modifyBy: string | null;
    chargeForSendAccount: boolean;
};

export type ReceiptAndSpendCreateDto = {
    ReceiptNo: string;
    receiptDate: IDateValue;
    bankAccountID: number;
    bookKeeping: number;
    debit: number;
    credit: number;
    name: string;
    address: string;
    cost: number;
    reason: string;
    isReceive: boolean;
    targetType: string | null;
    targetCode: string;
};

export type ReceiptAndSpendUpdateDto = {
    receiptDate: IDateValue;
    bookKeeping: number;
    debit: number;
    credit: number;
    name: string;
    address: string;
    cost: number;
    reason: string;
    isReceive: boolean;
    bankAccountID: number;
};

export type TransferCreateDto = {
    bankSendId: number;
    bankReceiveId: number;
    sendAmount: number;
    note?: string;
};