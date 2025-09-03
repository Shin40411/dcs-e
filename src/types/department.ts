export type ResDepartmentList = {
    statusCode: number;
    message: string;
    data: {
        pageNumber: number;
        pageSize: number;
        totalRecord: number;
        totalPages: number;
        items: IDepartmentItem[];
    };
};

export type IDepartmentItem = {
    id: number;
    name: string;
}