import { paths } from "src/routes/paths";

export const CUSTOMER_SERVICE_TAB_DATA = [
    { label: "Báo giá", path: paths.dashboard.customerServices.quotation },
    { label: "Hợp đồng", path: paths.dashboard.customerServices.contract },
    { label: "Phiếu thu", path: paths.dashboard.customerServices.receipt },
    // { label: "Phiếu chi", path: paths.dashboard.customerServices.spend },
    { label: "Phiếu xuất kho", path: paths.dashboard.customerServices.warehouseExport },
];

export const SUPPLIER_SERVICE_TAB_DATA = [
    { label: "Đặt hàng", path: paths.dashboard.supplierServices.orderSupplier },
    { label: "Hợp đồng", path: paths.dashboard.supplierServices.contractSupplier },
    { label: "Phiếu chi", path: paths.dashboard.supplierServices.spend },
    { label: "Phiếu nhập kho", path: paths.dashboard.supplierServices.warehouseImport },
];

export const PRODUCT_TAB_DATA = [
    { label: "Sản phẩm", path: paths.dashboard.product.root },
    { label: "Nhóm sản phẩm", path: paths.dashboard.category.root },
    { label: "Đơn vị tính", path: paths.dashboard.unit },
];

export const CUSTOMER_TAB_DATA = [
    { label: "Khách hàng", path: paths.dashboard.customer.root },
    { label: "Nhà cung cấp", path: paths.dashboard.suppliers.root },
];

export const EMPLOYEE_TAB_DATA = [
    { label: "Nhân viên", path: paths.dashboard.employees.root },
    { label: "Chức vụ", path: paths.dashboard.employeeType },
    { label: "Phòng ban", path: paths.dashboard.department },
];

export const INTERNAL_TAB_DATA = [
    { label: "Phiếu thu", path: paths.dashboard.receipt.root },
    { label: "Phiếu chi", path: paths.dashboard.spend.root },
    { label: "Chuyển khoản nội bộ", path: paths.dashboard.transfer.root },
];