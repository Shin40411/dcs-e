import { Box, Menu, MenuItem } from "@mui/material";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { UseBooleanReturn } from "minimal-shared/hooks";
import { useState } from "react";
import { Iconify } from "src/components/iconify";
import {
    RenderCellContractImport,
    RenderCellWarehouseImport,
    RenderCreatedBy,
    RenderReason,
    RenderReceiverName,
    RenderReceiverPhone,
    RenderReciverAddress
} from "src/sections/ware-house-import/warehouse-import-table-row";
import { fDate } from "src/utils/format-time-vi";

type ColumnProps = {
    openDetailsForm?: UseBooleanReturn;
    openCrudForm: UseBooleanReturn;
    confirmDelRowDialog: UseBooleanReturn;
    setRowIdSelected: (id: any) => void;
    setTableRowSelected: (obj: any) => void;
    page: number;
    rowsPerPage: number;
    onPreviewWarehouseImport: (params: URLSearchParams) => void;
}

export const WAREHOUSE_IMPORT_COLUMNS: ({
    openDetailsForm,
    openCrudForm,
    confirmDelRowDialog,
    setRowIdSelected,
    setTableRowSelected,
    page,
    rowsPerPage,
    onPreviewWarehouseImport
}: ColumnProps) => GridColDef[] = ({
    openDetailsForm,
    openCrudForm,
    confirmDelRowDialog,
    setRowIdSelected,
    setTableRowSelected,
    page,
    rowsPerPage,
    onPreviewWarehouseImport
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
                field: 'warehouseImportNo',
                headerName: 'Số phiếu nhập kho',
                width: 300,
                renderCell: (params) => {
                    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

                    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
                        setAnchorEl(event.currentTarget);
                    };

                    const paramsPreview = new URLSearchParams({
                        isCreating: 'false',
                        exportId: String(params?.row.id),
                        contractId: String(params?.row.contractID),
                        exportDate: String(fDate(params?.row.importDate)),
                        contractNo: params?.row.conntractSupNo,
                        warehouseExportNo: params?.row.warehouseImportNo,
                        receiverName: params?.row.receiverName,
                        position: "",
                        note: params?.row.note || "",
                        receiverAddress: params?.row.reciverAddress,
                        seller: params?.row.employeeName
                    } as Record<string, string>);

                    const handleClose = () => setAnchorEl(null);
                    return (
                        <Box sx={{ display: 'flex', alignItems: 'center', width: 1 }}>
                            <Box sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={handleOpen}>
                                <RenderCellWarehouseImport params={params} />
                            </Box>

                            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                                <MenuItem
                                    onClick={() => {
                                        onPreviewWarehouseImport(paramsPreview);
                                    }}
                                >
                                    <Iconify icon="solar:eye-bold" />
                                    <Box component="span" sx={{ ml: 1 }}>
                                        Xem phiếu nhập kho
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
                field: 'conntractSupNo',
                headerName: 'Số hợp đồng',
                width: 300,
                renderCell: (params) => (
                    <RenderCellContractImport params={params} />
                )
            },
            {
                field: 'receiverName',
                headerName: 'Tên người nhận',
                width: 200,
                renderCell: (params) => (
                    <RenderReceiverName params={params} />
                ),
            },
            {
                field: 'receiverPhone',
                headerName: 'Số điện thoại người nhận',
                width: 200,
                renderCell: (params) => (
                    <RenderReceiverPhone params={params} />
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
                    <GridActionsCellItem
                        showInMenu
                        icon={<Iconify icon="solar:eye-bold" />}
                        sx={{ display: { xs: 'none', md: 'block' } }}
                        label="Xem phiếu nhập kho"
                        onClick={() => {
                            const paramsPreview = new URLSearchParams({
                                isCreating: 'false',
                                exportId: String(params?.row.id),
                                contractId: String(params?.row.contractID),
                                exportDate: String(fDate(params?.row.importDate)),
                                contractNo: params?.row.conntractSupNo,
                                warehouseExportNo: params?.row.warehouseImportNo,
                                receiverName: params?.row.receiverName,
                                position: "",
                                note: params?.row.note || "",
                                receiverAddress: params?.row.reciverAddress,
                                seller: params?.row.employeeName
                            } as Record<string, string>);

                            onPreviewWarehouseImport(paramsPreview);
                        }}
                    />,
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