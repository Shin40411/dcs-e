import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { UseBooleanReturn } from "minimal-shared/hooks";
import { Iconify } from "src/components/iconify";
import { RenderUnitCell } from "src/sections/unit/unit-table-row";

type ColumnProps = {
    openCrudForm: UseBooleanReturn;
    confirmDelRowDialog: UseBooleanReturn;
    setTableRowSelected: (obj: any) => void;
    setRowIdSelected: (id: any) => void;
    page: number;
    rowsPerPage: number;
}

export const UNIT_COLUMNS: ({
    openCrudForm,
    confirmDelRowDialog,
    setTableRowSelected,
    setRowIdSelected,
    page,
    rowsPerPage
}: ColumnProps) => GridColDef[] = ({
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
                headerName: 'Tên đơn vị tính',
                flex: 1,
                width: 200,
                renderCell: (params) => (
                    <RenderUnitCell params={params} />
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