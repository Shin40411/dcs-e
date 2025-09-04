import { IDateValue } from "./common";

export type ResCustomerList = {
    statusCode: number;
    message: string;
    data: {
        pageNumber: number;
        pageSize: number;
        totalRecord: number;
        totalPages: number;
        items: ICustomerItem[];
    };
}

export type ICustomerItem = {
    id: string;
    phone: string,
    name: string;
    taxCode: string;
    companyName: string;
    email: string;
    bankAccount: string;
    bankName: string;
    address: string;
    isPartner: false;
    rewardPoint: number;
    createDate: IDateValue;
    createBy: string;
    modifyDate: IDateValue;
    modifyBy: string;
    status: true;
    balance: number
}

export type ICustomerDto = {
    phone: string;
    name: string;
    taxCode: string;
    companyName: string;
    email: string;
    bankAccount: string;
    bankName: string;
    address: string;
    isPartner: boolean;
    rewardPoint: number;
    balance: number;
}