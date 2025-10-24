import { Box, Menu, MenuItem } from "@mui/material";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { UseBooleanReturn } from "minimal-shared/hooks";
import { useState } from "react";
import { Iconify } from "src/components/iconify";
import { RenderCellAddress, RenderCellBankAccount, RenderCellCompanyName, RenderCellName, RenderCellPhone, RenderCellTaxCode, RenderPosition } from "src/sections/customer/customer-table-row";

type ColumnProps = {
    setTableRowSelected: (obj: any) => void;
    openDetailsForm?: UseBooleanReturn;
    openCrudForm: UseBooleanReturn;
    confirmDelRowDialog: UseBooleanReturn;
    setRowIdSelected: (id: any) => void;
    page: number;
    rowsPerPage: number;
}

export const CUSTOMER_COLUMNS: ({
    setTableRowSelected,
    openDetailsForm,
    openCrudForm,
    confirmDelRowDialog,
    setRowIdSelected,
    page,
    rowsPerPage
}: ColumnProps) => GridColDef[] = ({
    setTableRowSelected,
    openDetailsForm,
    openCrudForm,
    confirmDelRowDialog,
    setRowIdSelected,
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
                headerName: 'Tên khách hàng',
                flex: 1,
                minWidth: 200,
                renderCell: (params) => {
                    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

                    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
                        setAnchorEl(event.currentTarget);
                    };

                    const handleClose = () => setAnchorEl(null);

                    return (
                        <Box sx={{ display: 'flex', alignItems: 'center', width: 1 }}>
                            <Box sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={handleOpen}>
                                <RenderCellName params={params} />
                            </Box>

                            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                                <MenuItem
                                    onClick={() => {
                                        openDetailsForm?.onTrue();
                                        setTableRowSelected(params.row);
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
                field: 'position',
                headerName: 'Chức vụ',
                flex: 1,
                minWidth: 250,
                renderCell: (params) => <RenderPosition params={params} />
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
                        sx={{ display: { xs: 'none', md: 'block' } }}
                        label="Chi tiết"
                        onClick={() => {
                            openDetailsForm?.onTrue();
                            setTableRowSelected(params.row);
                        }}
                    />,
                    <GridActionsCellItem
                        showInMenu
                        icon={<Iconify icon="solar:pen-bold" />}
                        label="Chỉnh sửa"
                        onClick={() => { setRowIdSelected(params.row.id); openCrudForm.onTrue(); setTableRowSelected(params.row) }}
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
