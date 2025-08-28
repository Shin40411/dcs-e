import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { UseBooleanReturn } from "minimal-shared/hooks";
import { Iconify } from "src/components/iconify";
import { RenderCellAddress, RenderCellBankAccount, RenderCellCompanyName, RenderCellName, RenderCellPhone, RenderCellTaxCode } from "src/sections/customer/customer-table-row";

type ColumnProps = {
    openDetailsForm?: UseBooleanReturn;
    openCrudForm: UseBooleanReturn;
    confirmDelRowDialog: UseBooleanReturn;
    setRowIdSelected: (id: any) => void;
}

export const CUSTOMER_COLUMNS: ({
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
                headerName: 'Tên khách hàng',
                flex: 1,
                minWidth: 200,
                renderCell: (params) => (
                    <RenderCellName params={params} />
                ),
            },
            {
                field: 'phone',
                headerName: 'Số điện thoại',
                width: 150,
                renderCell: (params) => <RenderCellPhone params={params} />
            },
            {
                field: 'taxCode',
                headerName: 'Mã số thuế',
                width: 150,
                renderCell: (params) => <RenderCellTaxCode params={params} />
            },
            {
                field: 'companyName',
                headerName: 'Tên công ty',
                flex: 1,
                minWidth: 200,
                renderCell: (params) => <RenderCellCompanyName params={params} />
            },
            {
                field: 'bankAccount',
                headerName: 'Tài khoản ngân hàng',
                flex: 1,
                minWidth: 200,
                renderCell: (params) => <RenderCellBankAccount params={params} />
            },
            {
                field: 'address',
                headerName: 'Địa chỉ',
                flex: 1,
                minWidth: 250,
                renderCell: (params) => <RenderCellAddress params={params} />
            },
            {
                type: 'actions',
                field: 'actions',
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
                        showInMenu
                        icon={<Iconify icon="solar:eye-bold" />}
                        label="Chi tiết"
                        onClick={() => { }}
                    />,
                    <GridActionsCellItem
                        showInMenu
                        icon={<Iconify icon="solar:pen-bold" />}
                        label="Chỉnh sửa"
                        onClick={() => { setRowIdSelected(params.row.id); openCrudForm.onTrue(); }}
                    />,
                    <GridActionsCellItem
                        showInMenu
                        icon={<Iconify icon="solar:trash-bin-trash-bold" />}
                        label="Xóa"
                        onClick={() => { confirmDelRowDialog.onTrue(); setRowIdSelected(params.row.id) }}
                        sx={{ color: 'error.main' }}
                    />
                ]
            }
        ];
