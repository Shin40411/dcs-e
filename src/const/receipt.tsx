import { Box, Menu, MenuItem } from "@mui/material";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { UseBooleanReturn } from "minimal-shared/hooks";
import { useState } from "react";
import { Iconify } from "src/components/iconify";
import { RenderCellAmount, RenderCellCompanyName, RenderCellContractType, RenderCellCreateDate, RenderCellReceipt, RenderNote, RenderPayer, RenderReason } from "src/sections/receipt/receipt-table-row";

type ColumnProps = {
    openDetailsForm?: UseBooleanReturn;
    openCrudForm: UseBooleanReturn;
    confirmDelRowDialog: UseBooleanReturn;
    setRowIdSelected: (id: any) => void;
    setTableRowSelected: (obj: any) => void;
    page: number;
    rowsPerPage: number;
}

export const RECEIPT_COLUMNS: ({
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
                field: 'receiptNo',
                headerName: 'Số phiếu thu',
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
                                <RenderCellReceipt params={params} />
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
                field: 'companyName',
                headerName: 'Têm công ty',
                width: 300,
                renderCell: (params) => (
                    <RenderCellCompanyName params={params} />
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
                field: 'date',
                headerName: 'Ngày nộp',
                width: 200,
                renderCell: (params) => (
                    <RenderCellCreateDate params={params} />
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
                field: 'amount',
                headerName: 'Số tiền nộp',
                width: 200,
                renderCell: (params) => (
                    <RenderCellAmount params={params} />
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
                        label="Chi tiết"
                        onClick={() => { openDetailsForm?.onTrue(), setTableRowSelected(params.row); }}
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
        ];