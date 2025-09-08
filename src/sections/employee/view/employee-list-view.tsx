import { Button } from "@mui/material";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useBoolean } from "minimal-shared/hooks";
import { useEffect, useState } from "react";
import { useGetEmployees } from "src/actions/employee";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { UseGridTableList } from "src/components/data-grid-table/data-grid-table";
import { Iconify } from "src/components/iconify";
import { EMPLOYEE_COLUMNS } from "src/const/employee";
import { DashboardContent } from "src/layouts/dashboard";
import { paths } from "src/routes/paths";
import { IEmployeeItem } from "src/types/employee";
import { EmployeeNewEditForm } from "../employee-new-edit-form";
import { EmployeeDetails } from "../employee-details";

export function EmployeeListView() {
    const openCrudForm = useBoolean();
    const openDetailsForm = useBoolean();
    const confirmDialog = useBoolean();
    const confirmDelRowDialog = useBoolean();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchText, setSearchText] = useState('');
    const { employees, pagination, employeesLoading } = useGetEmployees({
        pageNumber: page + 1,
        pageSize: rowsPerPage,
        key: searchText,
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
    const [tableData, setTableData] = useState<IEmployeeItem[]>(employees);
    const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);
    const [tableRowSelected, setTableRowSelected] = useState<IEmployeeItem | null>(null);
    const [rowIdSelected, setRowIdSelected] = useState(0);

    useEffect(() => {
        if (employees.length) {
            setTableData(employees);
        }
    }, [employees]);

    const dataFiltered = tableData;

    const renderCRUDForm = () => (
        <EmployeeNewEditForm
            open={openCrudForm.value}
            onClose={openCrudForm.onFalse}
            selectedId={rowIdSelected || undefined}
            page={page}
            rowsPerPage={rowsPerPage}
            currentEmployee={tableRowSelected || undefined}
        />
    );

    const renderDetails = () => (
        <EmployeeDetails
            open={openDetailsForm.value}
            selectedEmployee={tableRowSelected || undefined}
            onClose={openDetailsForm.onFalse}
        />
    );

    return (
        <>
            <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <CustomBreadcrumbs
                    heading="Nhân viên"
                    links={[
                        { name: 'Tổng quan', href: paths.dashboard.root },
                        { name: 'Cấu hình' },
                        { name: 'Nhân viên' },
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
                            Tạo nhân viên
                        </Button>
                    }
                    sx={{ mb: { xs: 3, md: 5 } }}
                />
                <UseGridTableList
                    dataFiltered={dataFiltered}
                    loading={employeesLoading}
                    columns={EMPLOYEE_COLUMNS({ openDetailsForm, openCrudForm, confirmDelRowDialog, setRowIdSelected, setTableRowSelected })}
                    rowSelectionModel={(newSelectionModel) => setSelectedRowIds(newSelectionModel)}
                    paginationCount={pagination?.totalRecord ?? 0}
                    page={page}
                    handleChangePage={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    searchText={searchText}
                    onSearchChange={setSearchText}
                />
                {renderCRUDForm()}
                {renderDetails()}
            </DashboardContent>
        </>
    );
}