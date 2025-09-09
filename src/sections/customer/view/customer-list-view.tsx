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
import { CustomerNewEditForm } from "../customer-new-edit-form";
import { CustomerDetails } from "../customer-details";
import { ConfirmDialog } from "src/components/custom-dialog";
import { deleteOne } from "src/actions/delete";
import { endpoints } from "src/lib/axios";
import { toast } from "sonner";

export function CustomerListView() {
    const openCrudForm = useBoolean();
    const openDetailsForm = useBoolean();
    const confirmDialog = useBoolean();
    const confirmDelRowDialog = useBoolean();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchText, setSearchText] = useState('');
    const { customers, pagination, customersLoading } = useGetCustomers({
        pageNumber: page + 1,
        pageSize: rowsPerPage,
        key: searchText,
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

    const handleDeleteRow = async (id: number) => {
        const success = await deleteOne({
            apiEndpoint: endpoints.customer.delete(id),
            listEndpoint: endpoints.customer.list(`?pageNumber=${page + 1}&pageSize=${rowsPerPage}&Status=1`),
        });
        if (success) {
            toast.success('Xóa thành công 1 khách hàng!');
        } else {
            toast.error("Xóa thất bại, vui lòng kiểm tra lại!");
        }
    }

    const renderCRUDForm = () => (
        <CustomerNewEditForm
            open={openCrudForm.value}
            onClose={openCrudForm.onFalse}
            selectedId={rowIdSelected || undefined}
            page={page}
            rowsPerPage={rowsPerPage}
            currentCustomer={tableRowSelected || undefined}
        />
    );

    const renderDetails = () => (
        <CustomerDetails
            open={openDetailsForm.value}
            selectedCustomer={tableRowSelected || undefined}
            onClose={openDetailsForm.onFalse}
        />
    );

    const renderConfirmDeleteRow = () => (
        <ConfirmDialog
            open={confirmDelRowDialog.value}
            onClose={confirmDelRowDialog.onFalse}
            title="Xác nhận xóa khách hàng"
            content={
                <>
                    Bạn có chắc chắn muốn xóa khách hàng này?
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
                                openCrudForm.onTrue();
                                setTableRowSelected(null);
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
                    columns={CUSTOMER_COLUMNS({ openDetailsForm, openCrudForm, confirmDelRowDialog, setTableRowSelected, setRowIdSelected })}
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
                {renderConfirmDeleteRow()}
                {renderDetails()}
            </DashboardContent>
        </>
    );
}