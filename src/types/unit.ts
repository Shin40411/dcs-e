export type ResUnitList = {
    statusCode: number;
    message: string;
    data: {
        pageNumber: number;
        pageSize: number;
        totalRecord: number;
        totalPages: number;
        items: IUnitItem[];
    };
};

export type IUnitItem = {
    id: number;
    name: string;
}