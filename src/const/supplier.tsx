import { Box, Menu, MenuItem } from "@mui/material";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { UseBooleanReturn } from "minimal-shared/hooks";
import { useState } from "react";
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
    openDetailsForm?: UseBooleanReturn;
    openCrudForm: UseBooleanReturn;
    confirmDelRowDialog: UseBooleanReturn;
    setRowIdSelected: (id: any) => void;
    setTableRowSelected: (obj: any) => void;
    page: number;
    rowsPerPage: number;
}

export const SUPPLIERS_COLUMNS: ({
    openCrudForm,
    openDetailsForm,
    confirmDelRowDialog,
    setRowIdSelected,
    setTableRowSelected,
    page,
    rowsPerPage
}: ColumnProps) => GridColDef[] = ({
    openCrudForm,
    openDetailsForm,
    confirmDelRowDialog,
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
                headerName: 'Tên nhà cung cấp',
                width: 200,
                renderCell: (params) => {
                    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

                    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
                        setAnchorEl(event.currentTarget);
                    };

                    const handleClose = () => setAnchorEl(null);
                    return (
                        <Box sx={{ display: 'flex', alignItems: 'center', width: 1 }}>
                            <Box sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={handleOpen}>
                                <RenderCellSupplierName params={params} />
                            </Box>

                            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                                <MenuItem
                                    onClick={() => {
                                        setTableRowSelected(params.row);
                                        openDetailsForm?.onTrue();
                                        handleClose();
                                    }}
                                >
                                    <Iconify icon="solar:eye-bold" />
                                    <Box component="span" sx={{ ml: 1 }}>
                                        Chi tiết
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
                                        setRowIdSelected(params.row.id);
                                        confirmDelRowDialog.onTrue();
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
                        showInMenu
                        icon={<Iconify icon="solar:eye-bold" />}
                        label="Chi tiết"
                        onClick={() => {
                            setTableRowSelected(params.row);
                            openDetailsForm?.onTrue();
                        }}
                    />,
                    <GridActionsCellItem
                        icon={<Iconify icon="solar:pen-bold" />}
                        label="Chỉnh sửa"
                        onClick={() => {
                            setRowIdSelected(params.id);
                            setTableRowSelected(params.row)
                            openCrudForm.onTrue();
                        }}
                        showInMenu
                    />,
                    <GridActionsCellItem
                        sx={{ color: 'error.main' }}
                        icon={<Iconify icon="solar:trash-bin-trash-bold" />}
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