import { Box, Menu, MenuItem } from "@mui/material";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { UseBooleanReturn } from "minimal-shared/hooks";
import { useState } from "react";
import { Iconify } from "src/components/iconify";
import { RenderCellAmount, RenderCellCompanyName, RenderCellContractNo, RenderCellContractType, RenderCellCreateDate, RenderCellReceipt, RenderNote, RenderPayer, RenderReason } from "src/sections/receipt/receipt-table-row";
import { fDate } from "src/utils/format-time-vi";

type ColumnProps = {
    openDetailsForm?: UseBooleanReturn;
    openCrudForm: UseBooleanReturn;
    confirmDelRowDialog: UseBooleanReturn;
    setRowIdSelected: (id: any) => void;
    setTableRowSelected: (obj: any) => void;
    page: number;
    rowsPerPage: number;
    onPreviewReceipt: (params: URLSearchParams) => void;
}

export const RECEIPT_COLUMNS: ({
    openDetailsForm,
    openCrudForm,
    confirmDelRowDialog,
    setRowIdSelected,
    setTableRowSelected,
    page,
    rowsPerPage,
    onPreviewReceipt
}: ColumnProps) => GridColDef[] = ({
    openDetailsForm,
    openCrudForm,
    confirmDelRowDialog,
    setRowIdSelected,
    setTableRowSelected,
    page,
    rowsPerPage,
    onPreviewReceipt
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
                field: 'companyName',
                headerName: 'Tên công ty',
                width: 300,
                renderCell: (params) => {
                    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

                    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
                        setAnchorEl(event.currentTarget);
                    };

                    const paramsPreview = new URLSearchParams({
                        companyName: params?.row.companyName,
                        customerName: params?.row.customerName,
                        date: String(fDate(params?.row.date)),
                        receiptNoToWatch: params?.row.receiptNo,
                        amount: String(params?.row.amount),
                        payer: params?.row.payer,
                        contractNo: params?.row.contractNo || "",
                        reason: params?.row.reason || "",
                        address: params?.row.address,
                        createdBy: params?.row.createdBy
                    } as Record<string, string>);

                    const handleClose = () => setAnchorEl(null);
                    return (
                        <Box sx={{ display: 'flex', alignItems: 'center', width: 1 }}>
                            <Box sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={handleOpen}>
                                <RenderCellCompanyName params={params} />
                            </Box>

                            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                                <MenuItem
                                    onClick={() => {
                                        onPreviewReceipt(paramsPreview);
                                    }}
                                >
                                    <Iconify icon="solar:eye-bold" />
                                    <Box component="span" sx={{ ml: 1 }}>
                                        Xem phiếu thu
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
                                        setTableRowSelected(params.row);
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
                field: 'receiptNo',
                headerName: 'Số phiếu thu',
                width: 300,
                renderCell: (params) => (
                    <RenderCellReceipt params={params} />
                )
            },
            {
                field: 'contractNo',
                headerName: 'Số hợp đồng',
                width: 300,
                renderCell: (params) => (
                    <RenderCellContractNo params={params} />
                ),
            },
            {
                field: 'payer',
                headerName: 'Người nộp',
                width: 200,
                renderCell: (params) => (
                    <RenderPayer params={params} />
                ),
            },
            {
                field: 'amount',
                headerName: 'Số tiền nộp',
                width: 200,
                renderCell: (params) => (
                    <RenderCellAmount params={params} />
                ),
            },
            {
                field: 'reason',
                headerName: 'Lý do nộp',
                width: 300,
                renderCell: (params) => (
                    <RenderReason params={params} />
                ),
            },
            {
                field: 'date',
                headerName: 'Ngày nộp',
                width: 200,
                renderCell: (params) => (
                    <RenderCellCreateDate params={params} />
                ),
            },
            {
                field: 'contractType',
                headerName: 'Loại hợp đồng',
                width: 150,
                renderCell: (params) => (
                    <RenderCellContractType params={params} />
                ),
            },
            {
                field: 'note',
                headerName: 'Ghi chú',
                width: 300,
                renderCell: (params) => (
                    <RenderNote params={params} />
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
                        label="Xem phiếu thu"
                        onClick={() => {
                            const paramsPreview = new URLSearchParams({
                                companyName: params?.row.companyName,
                                customerName: params?.row.customerName,
                                date: String(fDate(params?.row.date)),
                                receiptNoToWatch: params?.row.receiptNo,
                                amount: String(params?.row.amount),
                                payer: params?.row.payer,
                                contractNo: params?.row.contractNo || "",
                                reason: params?.row.reason || "",
                                address: params?.row.address,
                                createdBy: params?.row.createdBy
                            } as Record<string, string>);

                            onPreviewReceipt(paramsPreview);
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
                        onClick={() => {
                            confirmDelRowDialog.onTrue();
                            setRowIdSelected(params.row.id);
                            setTableRowSelected(params.row);
                        }}
                        sx={{ color: 'error.main' }}
                    />,
                ],
            },
        ];