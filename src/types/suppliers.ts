export type ResSuppliersList = {
    statusCode: number;
    message: string;
    data: {
        pageNumber: number;
        pageSize: number;
        totalRecord: number;
        totalPages: number;
        items: ISuppliersItem[];
    };
};

export type ISuppliersItem = {
    id: number;
    name: string;
    phone: string;
    taxCode: string;
    companyName: string;
    email: string;
    bankAccount: string;
    bankName: string;
    address: string;
    createDate: string;
    createBy: string;
    modifyDate: string;
    modifyBy: string;
    status: boolean;
    balance: number;
}