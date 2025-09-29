import { Button } from "@mui/material";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useBoolean } from "minimal-shared/hooks";
import { ChangeEvent, useEffect, useState } from "react";
import { useGetDepartments } from "src/actions/department";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { UseGridTableList } from "src/components/data-grid-table/data-grid-table";
import { Iconify } from "src/components/iconify";
import { DEPARTMENT_COLUMNS } from "src/const/department";
import { DashboardContent } from "src/layouts/dashboard";
import { paths } from "src/routes/paths";
import { IDepartmentItem } from "src/types/department";
import { DepartmentNewEditForm } from "../department-new-edit-form";
import { deleteOne } from "src/actions/delete";
import { endpoints } from "src/lib/axios";
import { toast } from "sonner";
import { ConfirmDialog } from "src/components/custom-dialog";
import { CONFIG } from "src/global-config";
import { DepartmentBin } from "../department-bin";

export function DepartmentListView() {
    const openCrudForm = useBoolean();
    const confirmDialog = useBoolean();
    const openBin = useBoolean();
    const confirmDelRowDialog = useBoolean();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(CONFIG.pageSizesGlobal);
    const [searchText, setSearchText] = useState('');

    const { departments, pagination, departmentsLoading } = useGetDepartments({
        pageNumber: page + 1,
        pageSize: rowsPerPage,
        key: searchText,
    });

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const [tableData, setTableData] = useState<IDepartmentItem[]>(departments);
    const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);
    const [tableRowSelected, setTableRowSelected] = useState<IDepartmentItem | null>(null);
    const [rowIdSelected, setRowIdSelected] = useState(0);

    useEffect(() => {
        setTableData(departments);
    }, [departments]);

    const dataFiltered = tableData;


    const handleDeleteRow = async (id: number) => {
        const success = await deleteOne({
            apiEndpoint: endpoints.department.delete(id),
            listEndpoint: '/api/v1/departments/departments',
        });
        if (success) {
            toast.success('Xóa thành công 1 phòng ban!');
        } else {
            toast.error("Xóa thất bại, vui lòng kiểm tra lại!");
        }
    }


    const renderConfirmDeleteRow = () => (
        <ConfirmDialog
            open={confirmDelRowDialog.value}
            onClose={confirmDelRowDialog.onFalse}
            title="Xác nhận xóa phòng ban"
            content={
                <>
                    Bạn có chắc chắn muốn xóa phòng ban này?
                </>
            }
            action={
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                        handleDeleteRow(Number(rowIdSelected));
                        confirmDelRowDialog.onFalse();
                    }}
                >
                    Xác nhận
                </Button>
            }
        />
    );

    const renderCRUDForm = () => (
        <DepartmentNewEditForm
            open={openCrudForm.value}
            onClose={openCrudForm.onFalse}
            selectedId={rowIdSelected || undefined}
            currentDepartment={tableRowSelected || undefined}
        />
    );

    const renderBin = () => (
        <DepartmentBin
            open={openBin.value}
            onClose={openBin.onFalse}
        />
    );

    return (
        <>
            <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <CustomBreadcrumbs
                    heading="Phòng ban"
                    links={[
                        { name: 'Tổng quan', href: paths.dashboard.root },
                        { name: 'Cấu hình' },
                        { name: 'Phòng ban' },
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
                            Tạo phòng ban
                        </Button>
                    }
                    sx={{ mb: { xs: 3, md: 5 } }}
                />
                <UseGridTableList
                    dataFiltered={dataFiltered}
                    loading={departmentsLoading}
                    columns={DEPARTMENT_COLUMNS({ openCrudForm, confirmDelRowDialog, setTableRowSelected, setRowIdSelected, page, rowsPerPage })}
                    rowSelectionModel={(newSelectionModel) => setSelectedRowIds(newSelectionModel)}
                    paginationCount={pagination?.totalRecord ?? 0}
                    page={page}
                    handleChangePage={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    searchText={searchText}
                    onSearchChange={setSearchText}
                    openBin={openBin}
                />
                {renderCRUDForm()}
                {renderConfirmDeleteRow()}
                {renderBin()}
            </DashboardContent>
        </>
    );
}