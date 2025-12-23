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

export type ResPersonalAccount = {
    statusCode: number;
    message: string;
    data: IEmployeeItem;
};

export type IEmployeeItem = {
    id: number;
    code: string;
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
    lock: boolean;
}

export type IEmployeeDto = {
    name: string;
    typeId?: number;
    gender: string;
    email: string;
    rightId?: number;
    departmentId: number;
    image: string | null;
    birthday: IDateValue;
    address: string;
    phone: string;
    bankAccount: string;
    bankName: string;
    balance: number;
    employeeTypeId?: number;
}

export type IUserDto = {
    userName: string;
    fullName: string;
    password: string;
    userTypeId: number;
    employee: IEmployeeDto;
}

export type ResUserType = {
    statusCode: number;
    message: string;
    data: {
        pageNumber: number;
        pageSize: number;
        totalRecord: number;
        totalPages: number;
        items: {
            id: number;
            name: string;
        }[];
    };
}