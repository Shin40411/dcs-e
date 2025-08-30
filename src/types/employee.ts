import { IDateValue } from "./common";

export type ResEmployeesList = {
    statusCode: number;
    message: string;
    data: {
        pageNumber: number;
        pageSize: number;
        totalRecord: number;
        totalPages: number;
        items: IEmployeeItem[];
    };
};

export type IEmployeeItem = {
    id: number;
    name: string;
    status: boolean;
    createDate: IDateValue;
    createBy: string;
    lastLogin: string | null;
    gender: string;
    email: string;
    rightID: number;
    departmentId: number;
    department: string;
    image: string;
    birthday: IDateValue;
    address: string;
    phone: string;
    bankAccount: string;
    bankName: string;
    balance: number;
    employeeTypeId: number;
    employeeType: string;
}