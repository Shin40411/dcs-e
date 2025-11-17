export type ResPermission<T = any> = {
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

export type IPermissionItem = {
    module: string;
    permissions: {
        id: number;
        name: string;
        action: ActOfPer
    }[]
}

export type IDepartmentPermission = {
    departmentId: number;
    departmentName: string;
    permissionId: number;
    permissionName: string;
}

export enum ActOfPer {
    VIEW = "View",
    CREATE = "Create",
    EDIT = "Edit",
    PRINT = "Print",
    DELETE = "Delete",
    SEND = "Send",
}

export type ResPermissionByUser = {
    statusCode: number;
    message: string;
    data: IPermissionByUser[];
}

export type IPermissionByUser = {
    id: number;
    name: string;
    module: string;
    action: ActOfPer
}