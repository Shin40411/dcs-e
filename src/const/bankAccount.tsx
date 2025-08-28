import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { UseBooleanReturn } from "minimal-shared/hooks";
import { Iconify } from "src/components/iconify";
import { RenderBankAccountCodeCell, RenderBankAccountNameCell, RenderBankBalanceCell, RenderBankNameCell, RenderBankNumberCell, RenderBankStatusCell } from "src/sections/overview/banking/banking-table-row";

type ColumnProps = {
    openDetailsForm: UseBooleanReturn;
    openCrudForm: UseBooleanReturn;
    confirmDelRowDialog: UseBooleanReturn;
    setTableRowSelected: (obj: any) => void;
    setRowIdSelected: (id: any) => void;
    page: number;
    rowsPerPage: number;
}

export const BANKACCOUNT_COLUMNS: ({
    openDetailsForm,
    openCrudForm,
    confirmDelRowDialog,
    setTableRowSelected,
    setRowIdSelected,
    page,
    rowsPerPage
}: ColumnProps) => GridColDef[] = ({
    openDetailsForm,
    openCrudForm,
    confirmDelRowDialog,
    setTableRowSelected,
    setRowIdSelected,
    page,
    rowsPerPage
}) => [
            // {
            //     field: 'id',
            //     headerName: 'Mã tài khoản',
            //     width: 150,
            //     renderCell: (params) => (
            //         <RenderBankAccountCodeCell params={params} />
            //     ),
            // },
            {
                field: 'name',
                headerName: 'Tên tài khoản',
                flex: 1,
                width: 150,
                renderCell: (params) => (
                    <RenderBankAccountNameCell params={params} />
                ),
            },
            {
                field: 'bankName',
                headerName: 'Ngân hàng',
                flex: 1,
                width: 200,
                renderCell: (params) => (
                    <RenderBankNameCell params={params} />
                ),
            },
            {
                field: 'balance',
                headerName: 'Số dư',
                flex: 1,
                width: 150,
                renderCell: (params) => (
                    <RenderBankBalanceCell params={params} />
                ),
            },
            {
                field: 'status',
                headerName: 'Trạng thái',
                width: 150,
                renderCell: (params) => (
                    <RenderBankStatusCell params={params} />
                ),
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
                        onClick={() => { openDetailsForm.onTrue(), setTableRowSelected(params.row); }}
                    />,
                    <GridActionsCellItem
                        showInMenu
                        icon={<Iconify icon="solar:pen-bold" />}
                        label="Chỉnh sửa"
                        onClick={() => { openCrudForm.onTrue(); setTableRowSelected(params.row); }}
                    />,
                    <GridActionsCellItem
                        showInMenu
                        icon={<Iconify icon="solar:trash-bin-trash-bold" />}
                        label="Xóa"
                        onClick={() => { confirmDelRowDialog.onTrue(); setRowIdSelected(params.row.id) }}
                        sx={{ color: 'error.main' }}
                    />,
                ],
            },
        ];