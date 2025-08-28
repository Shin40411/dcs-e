import { Button } from "@mui/material";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useBoolean } from "minimal-shared/hooks";
import { useEffect, useState } from "react";
import { useGetCustomers } from "src/actions/customer";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { UseGridTableList } from "src/components/data-grid-table/data-grid-table";
import { Iconify } from "src/components/iconify";
import { CUSTOMER_COLUMNS } from "src/const/customer";
import { DashboardContent } from "src/layouts/dashboard";
import { paths } from "src/routes/paths";
import { ICustomerItem } from "src/types/customer";

export function CustomerListView() {
    const openCrudForm = useBoolean();
    const confirmDialog = useBoolean();
    const confirmDelRowDialog = useBoolean();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const { customers, pagination, customersLoading } = useGetCustomers({
        pageNumber: page + 1,
        pageSize: rowsPerPage,
    });
    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const [tableData, setTableData] = useState<ICustomerItem[]>(customers);
    const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);
    const [tableRowSelected, setTableRowSelected] = useState<ICustomerItem | null>(null);
    const [rowIdSelected, setRowIdSelected] = useState(0);

    useEffect(() => {
        if (customers.length) {
            setTableData(customers);
        }
    }, [customers]);

    const dataFiltered = tableData;

    return (
        <>
            <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <CustomBreadcrumbs
                    heading="Khách hàng"
                    links={[
                        { name: 'Tổng quan', href: paths.dashboard.root },
                        { name: 'Danh mục' },
                        { name: 'Khách hàng' },
                    ]}
                    action={
                        <Button
                            variant="contained"
                            startIcon={<Iconify icon="mingcute:add-line" />}
                            onClick={() => {

                            }}
                        >
                            Tạo khách hàng
                        </Button>
                    }
                    sx={{ mb: { xs: 3, md: 5 } }}
                />
                <UseGridTableList
                    dataFiltered={dataFiltered}
                    loading={customersLoading}
                    columns={CUSTOMER_COLUMNS({ openCrudForm, confirmDelRowDialog, setRowIdSelected })}
                    rowSelectionModel={(newSelectionModel) => setSelectedRowIds(newSelectionModel)}
                    paginationCount={pagination?.totalRecord ?? 0}
                    page={page}
                    handleChangePage={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </DashboardContent>
        </>
    );
}