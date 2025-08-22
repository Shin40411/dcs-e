import { IDateValue } from "./common";

export type ICategoryItem = {
    id: number;
    name: string;
    description: string;
    vat: number;
    createdAt: IDateValue;
    createBy: string;
    updatedAt: IDateValue;
    updateBy: string;
    status: boolean;
}

export type ResCategoryList = {
    statusCode: number;
    message: string;
    data: {
        pageNumber: number,
        pageSize: number,
        totalRecord: number,
        totalPages: number,
        items: ICategoryItem[];
    }
}

export type ICategoryDto = {
    name: string;
    description: string;
    vat: number;
    createdDate?: IDateValue;
    modifiedDate?: IDateValue;
    status?: boolean;
}