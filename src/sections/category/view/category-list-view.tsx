import { Button } from "@mui/material";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useBoolean } from "minimal-shared/hooks";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { ConfirmDialog } from "src/components/custom-dialog";
import { Iconify } from "src/components/iconify";
import { DashboardContent } from "src/layouts/dashboard";
import { paths } from "src/routes/paths";
import { ICategoryItem } from "src/types/category";
import { useGetCategories } from "src/actions/category";
import { CategoryNewEditForm } from "../category-new-edit-form";
import { CategoryDetails } from "../category-details";
import { UseGridTableList } from "src/components/data-grid-table/data-grid-table";
import { CATEGORY_COLUMNS } from "src/const/category";
// ----------------------------------------------------------------------

export function CategoryListView() {
    const confirmDialog = useBoolean();
    const confirmDelRowDialog = useBoolean();
    const openCrudForm = useBoolean();
    const openDetailsForm = useBoolean();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

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
    const [tableRowSelected, setTableRowSelected] = useState<ICategoryItem | null>(null);
    const [rowIdSelected, setRowIdSelected] = useState(0);

    useEffect(() => {
        if (categories.length) {
            setTableData(categories);
        }
    }, [categories]);

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
                <UseGridTableList
                    dataFiltered={dataFiltered}
                    loading={categoriesLoading}
                    columns={CATEGORY_COLUMNS({ openDetailsForm, openCrudForm, confirmDelRowDialog, setTableRowSelected, setRowIdSelected, page, rowsPerPage })}
                    rowSelectionModel={(newSelectionModel) => setSelectedRowIds(newSelectionModel)}
                    paginationCount={pagination?.totalRecord ?? 0}
                    page={page}
                    handleChangePage={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </DashboardContent>

            {renderConfirmDeleteRows()}
            {renderCRUDForm()}
            {renderConfirmDeleteRow()}
            {renderDetails()}
        </>
    );
}