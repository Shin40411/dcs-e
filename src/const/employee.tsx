import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { UseBooleanReturn } from "minimal-shared/hooks";
import { Iconify } from "src/components/iconify";
import { RenderCellAddress, RenderCellBankAccount, RenderCellBankName, RenderCellBirthday, RenderCellCreateBy, RenderCellCreateDate, RenderCellDepartment, RenderCellEmployee, RenderCellEmployeeType, RenderCellGender, RenderCellID, RenderCellPhone, RenderCellStatus } from "src/sections/employee/employee-table-row";

type ColumnProps = {
    openCrudForm: UseBooleanReturn;
    confirmDelRowDialog: UseBooleanReturn;
    setRowIdSelected: (id: any) => void;
}

export const EMPLOYEE_COLUMNS: ({
    openCrudForm,
    confirmDelRowDialog,
    setRowIdSelected,
}: ColumnProps) => GridColDef[] = ({
    openCrudForm,
    confirmDelRowDialog,
    setRowIdSelected,
}) => [
            {
                field: 'id',
                headerName: 'Mã nhân viên',
                width: 80,
                headerAlign: 'center',
                align: 'center',
                renderCell: (params) => (
                    <RenderCellID params={params} />
                ),
            },
            {
                field: 'name',
                headerName: 'Tên nhân viên',
                width: 250,
                renderCell: (params) => (
                    <RenderCellEmployee params={params} />
                ),
            },
            {
                field: 'employeeType',
                headerName: 'Chức vụ',
                width: 150,
                renderCell: (params) => (
                    <RenderCellEmployeeType params={params} />
                ),
            },
            {
                field: 'department',
                headerName: 'Bộ phận',
                width: 200,
                renderCell: (params) => (
                    <RenderCellDepartment params={params} />
                ),
            },
            {
                field: 'gender',
                headerName: 'Giới tính',
                width: 100,
                renderCell: (params) => (
                    <RenderCellGender params={params} />
                ),
            },
            {
                field: 'birthday',
                headerName: 'Ngày sinh',
                width: 200,
                renderCell: (params) => (
                    <RenderCellBirthday params={params} />
                ),
            },
            {
                field: 'address',
                headerName: 'Địa chỉ',
                width: 200,
                renderCell: (params) => (
                    <RenderCellAddress params={params} />
                ),
            },
            {
                field: 'phone',
                headerName: 'Số điện thoại',
                width: 200,
                renderCell: (params) => (
                    <RenderCellPhone params={params} />
                ),
            },
            {
                field: 'bankAccount',
                headerName: 'Tài khoản ngân hàng',
                width: 200,
                renderCell: (params) => (
                    <RenderCellBankAccount params={params} />
                ),
            },
            {
                field: 'bankName',
                headerName: 'Tên ngân hàng',
                width: 200,
                renderCell: (params) => (
                    <RenderCellBankName params={params} />
                ),
            },
            {
                field: 'status',
                headerName: 'Trạng thái',
                width: 200,
                renderCell: (params) => (
                    <RenderCellStatus params={params} />
                ),
            },
            {
                field: 'createDate',
                headerName: 'Ngày tạo',
                width: 200,
                renderCell: (params) => (
                    <RenderCellCreateDate params={params} />
                ),
            },
            {
                field: 'createBy',
                headerName: 'Người tạo',
                width: 200,
                renderCell: (params) => (
                    <RenderCellCreateBy params={params} />
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
                        icon={<Iconify icon="solar:pen-bold" />}
                        label="Chỉnh sửa"
                        onClick={() => { openCrudForm.onTrue(); setRowIdSelected(params.row.id); }}
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