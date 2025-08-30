import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { UseBooleanReturn } from "minimal-shared/hooks";
import { Iconify } from "src/components/iconify";
import {
    RenderCellAddress,
    RenderCellBalance,
    RenderCellBankAccount,
    RenderCellBankName,
    RenderCellCompanyName,
    RenderCellCreateDate,
    RenderCellEmail,
    RenderCellModifyDate,
    RenderCellPhone,
    RenderCellStatus,
    RenderCellSupplierName,
    RenderCellTaxCode
} from "src/sections/supplier/supplier-table-row";

type ColumnProps = {
    openCrudForm: UseBooleanReturn;
    confirmDelRowDialog: UseBooleanReturn;
    setRowIdSelected: (id: any) => void;
}

export const SUPPLIERS_COLUMNS: ({
    openCrudForm,
    confirmDelRowDialog,
    setRowIdSelected,
}: ColumnProps) => GridColDef[] = ({
    openCrudForm,
    confirmDelRowDialog,
    setRowIdSelected,
}) => [
            {
                field: 'name',
                headerName: 'Tên nhà cung cấp',
                width: 200,
                renderCell: (params) => (
                    <RenderCellSupplierName params={params} />
                ),
            },
            {
                field: 'phone',
                headerName: 'Số điện thoại',
                width: 150,
                renderCell: (params) => (
                    <RenderCellPhone params={params} />
                ),
            },
            {
                field: 'taxCode',
                headerName: 'Mã số thuế',
                width: 150,
                renderCell: (params) => (
                    <RenderCellTaxCode params={params} />
                ),
            },
            {
                field: 'companyName',
                headerName: 'Tên công ty',
                width: 200,
                renderCell: (params) => (
                    <RenderCellCompanyName params={params} />
                ),
            },
            {
                field: 'email',
                headerName: 'Email',
                width: 200,
                renderCell: (params) => (
                    <RenderCellEmail params={params} />
                ),
            },
            {
                field: 'bankAccount',
                headerName: 'Tài khoản ngân hàng',
                minWidth: 200,
                renderCell: (params) => (
                    <RenderCellBankAccount params={params} />
                ),
            },
            {
                field: 'bankName',
                headerName: 'Ngân hàng',
                minWidth: 200,
                renderCell: (params) => (
                    <RenderCellBankName params={params} />
                ),
            },
            {
                field: 'address',
                headerName: 'Địa chỉ',
                minWidth: 200,
                renderCell: (params) => (
                    <RenderCellAddress params={params} />
                ),
            },
            {
                field: 'createDate',
                headerName: 'Ngày tạo',
                width: 150,
                renderCell: (params) => (
                    <RenderCellCreateDate params={params} />
                ),
            },
            {
                field: 'modifyDate',
                headerName: 'Ngày cập nhật',
                width: 150,
                renderCell: (params) => (
                    <RenderCellModifyDate params={params} />
                ),
            },
            {
                field: 'balance',
                headerName: 'Số dư',
                width: 150,
                renderCell: (params) => (
                    <RenderCellBalance params={params} />
                ),
            },
            {
                field: 'status',
                headerName: 'Trạng thái',
                width: 130,
                renderCell: (params) => (
                    <RenderCellStatus params={params} />
                ),
            },
            {
                field: 'actions',
                type: 'actions',
                headerName: ' ',
                align: 'right',
                headerAlign: 'right',
                width: 80,
                sortable: false,
                hideable: false,
                filterable: false,
                editable: false,
                getActions: (params) => [
                    <GridActionsCellItem
                        icon={<Iconify icon="eva:edit-fill" />}
                        label="Chỉnh sửa"
                        onClick={() => {
                            setRowIdSelected(params.id);
                            openCrudForm.onTrue();
                        }}
                        showInMenu
                    />,
                    <GridActionsCellItem
                        icon={<Iconify icon="eva:trash-2-outline" />}
                        label="Xóa"
                        onClick={() => {
                            setRowIdSelected(params.id);
                            confirmDelRowDialog.onTrue();
                        }}
                        showInMenu
                    />
                ],
            }
        ];