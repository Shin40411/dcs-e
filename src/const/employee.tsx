import { Box, Menu, MenuItem } from "@mui/material";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { UseBooleanReturn } from "minimal-shared/hooks";
import { useState } from "react";
import { Iconify } from "src/components/iconify";
import { RenderCellAddress, RenderCellBankAccount, RenderCellBankName, RenderCellBirthday, RenderCellCreateBy, RenderCellCreateDate, RenderCellDepartment, RenderCellEmployee, RenderCellEmployeeType, RenderCellGender, RenderCellID, RenderCellPhone, RenderCellStatus } from "src/sections/employee/employee-table-row";

type ColumnProps = {
    openDetailsForm?: UseBooleanReturn;
    openCrudForm: UseBooleanReturn;
    confirmDelRowDialog: UseBooleanReturn;
    confirmUnlockDialog: UseBooleanReturn;
    confirmChangePass: UseBooleanReturn;
    setRowIdSelected: (id: any) => void;
    setTableRowSelected: (obj: any) => void;
    page: number;
    rowsPerPage: number;
}

export const EMPLOYEE_COLUMNS: ({
    openDetailsForm,
    openCrudForm,
    confirmDelRowDialog,
    confirmUnlockDialog,
    confirmChangePass,
    setRowIdSelected,
    setTableRowSelected,
    page,
    rowsPerPage
}: ColumnProps) => GridColDef[] = ({
    openDetailsForm,
    openCrudForm,
    confirmDelRowDialog,
    confirmUnlockDialog,
    confirmChangePass,
    setRowIdSelected,
    setTableRowSelected,
    page,
    rowsPerPage
}) => [
            {
                field: 'stt',
                headerName: 'STT',
                width: 80,
                sortable: false,
                filterable: false,
                align: 'center',
                headerAlign: 'center',
                renderCell: (params) => {
                    const rowIndex = params.api.getRowIndexRelativeToVisibleRows(params.id);
                    return page * rowsPerPage + (rowIndex + 1);
                },
            },
            {
                field: 'name',
                headerName: 'Tên nhân viên',
                width: 250,
                renderCell: (params) => {
                    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

                    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
                        setAnchorEl(event.currentTarget);
                    };

                    const handleClose = () => setAnchorEl(null);
                    return (
                        <Box sx={{ display: 'flex', alignItems: 'center', width: 1 }}>
                            <Box sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={handleOpen}>
                                <RenderCellEmployee params={params} />
                            </Box>

                            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                                <MenuItem
                                    onClick={() => {
                                        setRowIdSelected(params.row.id);
                                        setTableRowSelected(params.row);
                                        openDetailsForm?.onTrue();
                                        handleClose();
                                    }}
                                    sx={{ display: { xs: 'none', md: 'flex' } }}
                                >
                                    <Iconify icon="solar:eye-bold" />
                                    <Box component="span" sx={{ ml: 1 }}>
                                        Chi tiết
                                    </Box>
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        setTableRowSelected(params.row);
                                        setRowIdSelected(params.row.id);
                                        confirmChangePass.onTrue();
                                        handleClose();
                                    }}>
                                    <Iconify icon="solar:password-outline" />
                                    <Box component="span" sx={{ ml: 1 }}>
                                        Đổi mật khẩu
                                    </Box>
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        setTableRowSelected(params.row);
                                        setRowIdSelected(params.row.id);
                                        confirmUnlockDialog.onTrue();
                                        handleClose();
                                    }}>
                                    <Iconify icon={params.row.lock === false ? "solar:lock-password-bold" : "solar:lock-password-unlocked-bold"} />
                                    <Box component="span" sx={{ ml: 1 }}>
                                        {params.row.lock === false ? 'Khóa' : 'Mở khóa'} tài khoản
                                    </Box>
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        openCrudForm.onTrue();
                                        setRowIdSelected(params.row.id);
                                        setTableRowSelected(params.row);
                                        handleClose();
                                    }}
                                >
                                    <Iconify icon="solar:pen-bold" />
                                    <Box component="span" sx={{ ml: 1 }}>
                                        Chỉnh sửa
                                    </Box>
                                </MenuItem>
                                <MenuItem
                                    sx={{ color: 'error.main' }}
                                    onClick={() => {
                                        confirmDelRowDialog.onTrue();
                                        setRowIdSelected(params.row.id);
                                        handleClose();
                                    }}
                                >
                                    <Iconify icon="solar:trash-bin-trash-bold" />
                                    <Box component="span" sx={{ ml: 1 }}>
                                        Xóa
                                    </Box>
                                </MenuItem>
                            </Menu>
                        </Box>
                    )
                },
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
                        icon={<Iconify icon="solar:eye-bold" />}
                        sx={{ display: { xs: 'none', md: 'block' } }}
                        label="Chi tiết"
                        onClick={() => { openDetailsForm?.onTrue(), setTableRowSelected(params.row); }}
                    />,
                    <GridActionsCellItem
                        showInMenu
                        icon={<Iconify icon="solar:password-outline" />}
                        sx={{ display: { xs: 'none', md: 'block' } }}
                        label=" Đổi mật khẩu"
                        onClick={() => {
                            setTableRowSelected(params.row);
                            setRowIdSelected(params.row.id);
                            confirmChangePass.onTrue();
                        }}
                    />,
                    <GridActionsCellItem
                        showInMenu
                        icon={<Iconify icon={params.row.lock === false ? "solar:lock-password-bold" : "solar:lock-password-unlocked-bold"} />}
                        sx={{ display: { xs: 'none', md: 'block' } }}
                        label={`${params.row.lock === false ? 'Khóa' : 'Mở khóa'} tài khoản`}
                        onClick={() => {
                            setTableRowSelected(params.row);
                            setRowIdSelected(params.row.id);
                            confirmUnlockDialog.onTrue();
                        }}
                    />,
                    <GridActionsCellItem
                        showInMenu
                        icon={<Iconify icon="solar:pen-bold" />}
                        label="Chỉnh sửa"
                        onClick={() => {
                            openCrudForm.onTrue();
                            setRowIdSelected(params.row.id);
                            setTableRowSelected(params.row);
                        }}
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