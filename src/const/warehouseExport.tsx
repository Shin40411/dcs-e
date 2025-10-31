import { Box, Menu, MenuItem } from "@mui/material";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { UseBooleanReturn } from "minimal-shared/hooks";
import { useState } from "react";
import { Iconify } from "src/components/iconify";
import { RenderCellCompanyName, RenderCellContractExport, RenderCellWarehouseExport, RenderCreatedBy, RenderReason, RenderReciverAddress, RenderReciverName, RenderReciverPhone } from "src/sections/warehouse-export/warehouse-export-table-row";

type ColumnProps = {
    openDetailsForm?: UseBooleanReturn;
    openCrudForm: UseBooleanReturn;
    confirmDelRowDialog: UseBooleanReturn;
    setRowIdSelected: (id: any) => void;
    setTableRowSelected: (obj: any) => void;
    page: number;
    rowsPerPage: number;
}

export const WAREHOUSE_EXPORT_COLUMNS: ({
    openDetailsForm,
    openCrudForm,
    confirmDelRowDialog,
    setRowIdSelected,
    setTableRowSelected,
    page,
    rowsPerPage
}: ColumnProps) => GridColDef[] = ({
    openDetailsForm,
    openCrudForm,
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
                field: 'warehouseExportNo',
                headerName: 'Số phiếu xuất kho',
                width: 300,
                renderCell: (params) => {
                    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

                    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
                        setAnchorEl(event.currentTarget);
                    };

                    const handleClose = () => setAnchorEl(null);
                    return (
                        <Box sx={{ display: 'flex', alignItems: 'center', width: 1 }}>
                            <Box sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={handleOpen}>
                                <RenderCellWarehouseExport params={params} />
                            </Box>

                            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
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
                field: 'contractNo',
                headerName: 'Số Hợp đồng',
                width: 300,
                renderCell: (params) => (
                    <RenderCellContractExport params={params} />
                )
            },
            {
                field: 'reciverName',
                headerName: 'Tên người nhận',
                width: 200,
                renderCell: (params) => (
                    <RenderReciverName params={params} />
                ),
            },
            {
                field: 'reciverPhone',
                headerName: 'Số điện thoại người nhận',
                width: 200,
                renderCell: (params) => (
                    <RenderReciverPhone params={params} />
                ),
            },
            {
                field: 'reciverAddress',
                headerName: 'Địa chỉ nhận hàng',
                width: 280,
                renderCell: (params) => (
                    <RenderReciverAddress params={params} />
                ),
            },
            {
                field: 'createdBy',
                headerName: 'Tên người lập phiếu',
                width: 200,
                renderCell: (params) => (
                    <RenderCreatedBy params={params} />
                ),
            },
            {
                field: 'note',
                headerName: 'Lý do',
                width: 200,
                renderCell: (params) => (
                    <RenderReason params={params} />
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
                    // <GridActionsCellItem
                    //     showInMenu
                    //     icon={<Iconify icon="solar:eye-bold" />}
                    //     sx={{ display: { xs: 'none', md: 'block' } }}
                    //     label="Chi tiết"
                    //     onClick={() => { openDetailsForm?.onTrue(), setTableRowSelected(params.row); }}
                    // />,
                    <GridActionsCellItem
                        showInMenu
                        icon={<Iconify icon="solar:pen-bold" />}
                        label="Chỉnh sửa"
                        onClick={() => { openCrudForm.onTrue(); setTableRowSelected(params.row); setRowIdSelected(params.row.id) }}
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
        ]