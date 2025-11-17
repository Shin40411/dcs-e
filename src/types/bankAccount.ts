export type ResBankAccountList = {
    statusCode: number;
    message: string;
    data: {
        pageNumber: number;
        pageSize: number;
        totalRecord: number;
        totalPages: number;
        items: IBankAccountItem[];
    };
}

export type IBankAccountItem = {
    id: string;
    name: string;
    bankNo: string;
    bankName: string;
    balance: number;
    status: boolean;
}

export type IBankAccountDto = {
    name: string;
    bankNo: string;
    Bank: string;
    balance: number;
}

export type ResBankQrList = {
    statusCode: number;
    message: string;
    data: {
        pageNumber: number;
        pageSize: number;
        totalRecord: number;
        totalPages: number;
        items: BankQrItem[];
    }
}

export type BankQrItem = {
    id: number;
    name: string;
    code: string;
    bin: string;
    shortName: string;
    logo: string;
    transferSupported: number;
    lookupSupported: number;
}