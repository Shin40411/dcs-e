import { Box, Button, Card, createTheme, ListItemIcon, MenuItem, SxProps, TablePagination, Theme } from "@mui/material";
import { GridActionsCellItemProps, gridClasses, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { DataGrid, GridActionsCellItem, GridColDef, GridColumnVisibilityModel, GridRowSelectionModel, GridSlotProps } from "@mui/x-data-grid";
import { useBoolean, useSetState, UseSetStateReturn } from "minimal-shared/hooks";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { ConfirmDialog } from "src/components/custom-dialog";
import { EmptyContent } from "src/components/empty-content";
import { Iconify } from "src/components/iconify";
import { DashboardContent } from "src/layouts/dashboard";
import { RouterLink } from "src/routes/components";
import { paths } from "src/routes/paths";
import { IProductTableFilters } from "src/types/product";
import { RenderCellCategory, RenderCellCreatedAt, RenderCellDescription, RenderCellStatus, RenderCellVAT } from "../category-table-row";
import { ICategoryItem } from "src/types/category";
import { useGetCategories } from "src/actions/category";
import { viVN } from "@mui/x-data-grid/locales";
import { CategoryNewEditForm } from "../category-new-edit-form";
import { CategoryDetails } from "../category-details";

const HIDE_COLUMNS = { category: false };

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

export function CategoryListView() {
    const confirmDialog = useBoolean();
    const confirmDelRowDialog = useBoolean();
    const openCrudForm = useBoolean();
    const openDetailsForm = useBoolean();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const { categories, categoriesLoading, pagination } = useGetCategories({
        pageNumber: page + 1,
        pageSize: rowsPerPage,
    });

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const [tableData, setTableData] = useState<ICategoryItem[]>(categories);
    const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);
    const [filterButtonEl, setFilterButtonEl] = useState<HTMLButtonElement | null>(null);
    const [tableRowSelected, setTableRowSelected] = useState<ICategoryItem | null>(null);
    const [rowIdSelected, setRowIdSelected] = useState(0);

    // const filters = useSetState<IProductTableFilters>({ publish: [], stock: [] });
    // const { state: currentFilters } = filters;

    const [columnVisibilityModel, setColumnVisibilityModel] =
        useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

    useEffect(() => {
        if (categories.length) {
            setTableData(categories);
        }
    }, [categories]);

    // const canReset = currentFilters.publish.length > 0 || currentFilters.stock.length > 0;

    const dataFiltered = tableData;

    const handleDeleteRow = useCallback(
        (id: number) => {
            const deleteRow = tableData.filter((row) => row.id !== id);

            toast.success('Xóa thành công nhóm sản phẩm!');

            setTableData(deleteRow);
        },
        [tableData]
    );

    const handleDeleteRows = useCallback(() => {
        const deleteRows = tableData.filter((row) => !selectedRowIds.includes(row.id));

        toast.success('Xóa thành công các nhóm sản phẩm!');

        setTableData(deleteRows);
    }, [selectedRowIds, tableData]);

    // const CustomToolbarCallback = useCallback(
    //     () => (
    //         <CustomToolbar
    //             filters={filters}
    //             canReset={canReset}
    //             selectedRowIds={selectedRowIds}
    //             setFilterButtonEl={setFilterButtonEl}
    //             filteredResults={dataFiltered.length}
    //             onOpenConfirmDeleteRows={confirmDialog.onTrue}
    //         />
    //     ),
    //     [currentFilters, selectedRowIds]
    // );

    const columns: GridColDef[] = [
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
            hideable: false,
            renderCell: (params) => (
                <RenderCellCategory params={params} />
            ),
        },
        {
            field: 'description',
            headerName: 'Mô tả',
            flex: 1,
            width: 200,
            hideable: false,
            renderCell: (params) => (
                <RenderCellDescription params={params} />
            ),
        },
        {
            field: 'vat',
            headerName: 'VAT',
            width: 160,
            renderCell: (params) => <RenderCellVAT params={params} />,
        },
        {
            field: 'status',
            headerName: 'Trạng thái',
            width: 160,
            type: 'singleSelect',
            editable: true,
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
            filterable: false,
            disableColumnMenu: true,
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

    const getTogglableColumns = () =>
        columns
            .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
            .map((column) => column.field);

    const renderCRUDForm = () => (
        <CategoryNewEditForm
            open={openCrudForm.value}
            onClose={openCrudForm.onFalse}
            currentCategory={tableRowSelected || undefined}
            page={page}
            rowsPerPage={rowsPerPage}
        />
    );

    const renderDetails = () => (
        <CategoryDetails
            open={openDetailsForm.value}
            categoryItem={tableRowSelected ?? ({} as ICategoryItem)}
            onClose={openDetailsForm.onFalse}
        />
    );

    const renderConfirmDeleteRows = () => (
        <ConfirmDialog
            open={confirmDialog.value}
            onClose={confirmDialog.onFalse}
            title="Xác nhận xóa hàng loạt nhóm sản phẩm"
            content={
                <>
                    Bạn có chắc chắn muốn xóa <strong> {selectedRowIds.length} </strong> nhóm sản phẩm?
                </>
            }
            action={
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                        handleDeleteRows();
                        confirmDialog.onFalse();
                    }}
                >
                    Xác nhận
                </Button>
            }
        />
    );

    const renderConfirmDeleteRow = () => (
        <ConfirmDialog
            open={confirmDelRowDialog.value}
            onClose={confirmDelRowDialog.onFalse}
            title="Xác nhận xóa nhóm sản phẩm"
            content={
                <>
                    Bạn có chắc chắn muốn xóa nhóm sản phẩm này?
                </>
            }
            action={
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                        handleDeleteRow(rowIdSelected);
                        confirmDelRowDialog.onFalse();
                    }}
                >
                    Xác nhận
                </Button>
            }
        />
    );

    return (
        <>
            <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <CustomBreadcrumbs
                    heading="Nhóm sản phẩm"
                    links={[
                        { name: 'Tổng quan', href: paths.dashboard.root },
                        { name: 'Danh mục', href: paths.dashboard.category.root },
                        { name: 'Nhóm sản phẩm' },
                    ]}
                    action={
                        <Button
                            variant="contained"
                            startIcon={<Iconify icon="mingcute:add-line" />}
                            onClick={() => {
                                openCrudForm.onTrue();
                                setTableRowSelected(null);
                            }}
                        >
                            Tạo nhóm sản phẩm
                        </Button>
                    }
                    sx={{ mb: { xs: 3, md: 5 } }}
                />

                <Card
                    sx={{
                        minHeight: 640,
                        flexGrow: { md: 1 },
                        display: { md: 'flex' },
                        height: { xs: 800, md: '1px' },
                        flexDirection: { md: 'column' },
                    }}
                >
                    <DataGrid
                        // checkboxSelection
                        disableRowSelectionOnClick
                        rows={dataFiltered}
                        columns={columns}
                        hideFooterPagination
                        loading={categoriesLoading}
                        getRowHeight={() => 'auto'}
                        onRowSelectionModelChange={(newSelectionModel) => setSelectedRowIds(newSelectionModel)}
                        columnVisibilityModel={columnVisibilityModel}
                        onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
                        slots={{
                            noRowsOverlay: () => <EmptyContent />,
                            noResultsOverlay: () => <EmptyContent title="Không có kết quả" />,
                        }}
                        slotProps={{
                            toolbar: { setFilterButtonEl },
                            panel: { anchorEl: filterButtonEl },
                            columnsManagement: { getTogglableColumns },
                        }}
                        sx={{ [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' } }}
                    />
                    <TablePagination
                        component="div"
                        count={pagination?.totalRecord ?? 0}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 20]}
                        labelRowsPerPage="Số dòng mỗi trang:"
                        labelDisplayedRows={({ from, to, count }) =>
                            `${from}–${to} trên ${count !== -1 ? count : `nhiều hơn ${to}`}`
                        }
                    />
                </Card>
            </DashboardContent>

            {renderConfirmDeleteRows()}
            {renderCRUDForm()}
            {renderConfirmDeleteRow()}
            {renderDetails()}
        </>
    );
}

// ----------------------------------------------------------------------

declare module '@mui/x-data-grid' {
    interface ToolbarPropsOverrides {
        setFilterButtonEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
    }
}

type CustomToolbarProps = GridSlotProps['toolbar'] & {
    canReset: boolean;
    filteredResults: number;
    selectedRowIds: GridRowSelectionModel;
    filters: UseSetStateReturn<IProductTableFilters>;

    onOpenConfirmDeleteRows: () => void;
};

function CustomToolbar({
    filters,
    canReset,
    selectedRowIds,
    filteredResults,
    setFilterButtonEl,
    onOpenConfirmDeleteRows,
}: CustomToolbarProps) {
    return (
        <>
            <GridToolbarContainer>
                {/* <ProductTableToolbar
                    filters={filters}
                    options={{ stocks: PRODUCT_STOCK_OPTIONS, publishs: PUBLISH_OPTIONS }}
                /> */}

                <GridToolbarQuickFilter />

                <Box
                    sx={{
                        gap: 1,
                        flexGrow: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                    }}
                >
                    {!!selectedRowIds.length && (
                        <Button
                            size="small"
                            color="error"
                            startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                            onClick={onOpenConfirmDeleteRows}
                        >
                            Xóa ({selectedRowIds.length})
                        </Button>
                    )}

                    <GridToolbarColumnsButton />
                    <GridToolbarFilterButton ref={setFilterButtonEl} />
                    <GridToolbarExport />
                </Box>
            </GridToolbarContainer>

            {/* {canReset && (
                <ProductTableFiltersResult
                    filters={filters}
                    totalResults={filteredResults}
                    sx={{ p: 2.5, pt: 0 }}
                />
            )} */}
        </>
    );
}
