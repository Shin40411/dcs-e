import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { UseBooleanReturn } from "minimal-shared/hooks";
import { Iconify } from "src/components/iconify";
import { RenderCellCategory, RenderCellCreatedAt, RenderCellDescription, RenderCellStatus, RenderCellVAT } from "src/sections/category/category-table-row";

type ColumnProps = {
    openDetailsForm: UseBooleanReturn;
    openCrudForm: UseBooleanReturn;
    confirmDelRowDialog: UseBooleanReturn;
    setTableRowSelected: (obj: any) => void;
    setRowIdSelected: (id: any) => void;
    page: number;
    rowsPerPage: number;
}

export const CATEGORY_COLUMNS: ({
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
                headerName: 'Tên nhóm',
                flex: 1,
                width: 200,
                renderCell: (params) => (
                    <RenderCellCategory params={params} />
                ),
            },
            {
                field: 'description',
                headerName: 'Mô tả',
                flex: 1,
                width: 200,
                sortable: false,
                renderCell: (params) => (
                    <RenderCellDescription params={params} />
                ),
            },
            {
                field: 'vat',
                headerName: 'VAT',
                width: 160,
                sortable: false,
                renderCell: (params) => <RenderCellVAT params={params} />,
            },
            {
                field: 'status',
                headerName: 'Trạng thái',
                width: 160,
                type: 'singleSelect',
                sortable: false,
                renderCell: (params) => <RenderCellStatus params={params} />,
            },
            {
                field: 'createdAt',
                headerName: 'Ngày tạo',
                width: 160,
                renderCell: (params) => <RenderCellCreatedAt params={params} />,
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