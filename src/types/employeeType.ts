export type ResEmployeeTypeList = {
    statusCode: number;
    message: string;
    data: {
        pageNumber: number;
        pageSize: number;
        totalRecord: number;
        totalPages: number;
        items: IEmployeeTypeItem[];
    };
};

export type IEmployeeTypeItem = {
    id: number;
    name: string;
}