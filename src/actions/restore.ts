import axiosInstance, { endpoints } from "src/lib/axios";

export enum EntityRestoreType {
    ProductCategories = "ProductCategories",
    Products = "Products",
    Customers = "Customers",
    BankAccounts = "BankAccounts",
    Suppliers = "Suppliers",
    Employees = "Employees",
    EmployeeTypes = "EmployeeTypes",
    Departments = "Departments",
    Units = "Units",
}

export async function restoreAll(ids: string[], type: EntityRestoreType) {
    if (!ids.length) {
        throw new Error("Danh sách ID không được để trống.");
    }

    const formData = new FormData();
    ids.forEach((id) => formData.append("Id", id));
    formData.append("Type", type);

    try {
        const { data } = await axiosInstance.patch(endpoints.restore, formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        return data;
    } catch (error: any) {
        console.error("Restore failed:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Không thể khôi phục dữ liệu.");
    }
}