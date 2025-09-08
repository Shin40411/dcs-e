import { Button } from "@mui/material"
import { GridRowSelectionModel } from "@mui/x-data-grid"
import { useBoolean } from "minimal-shared/hooks"
import { useEffect, useState } from "react"
import { useGetSuppliers } from "src/actions/suppliers"
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs"
import { UseGridTableList } from "src/components/data-grid-table/data-grid-table"
import { Iconify } from "src/components/iconify"
import { SUPPLIERS_COLUMNS } from "src/const/supplier"
import { DashboardContent } from "src/layouts/dashboard"
import { paths } from "src/routes/paths"
import { ISuppliersItem } from "src/types/suppliers"
import { SupplierNewEditForm } from "../supplier-new-edit-form"
import { SupplierDetails } from "../supplier-details"

export function SuppliersListView() {
    const openCrudForm = useBoolean();
    const confirmDialog = useBoolean();
    const openDetailsForm = useBoolean();
    const confirmDelRowDialog = useBoolean();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchText, setSearchText] = useState('');
    const { suppliers, pagination, suppliersLoading } = useGetSuppliers({
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
    const [tableData, setTableData] = useState<ISuppliersItem[]>(suppliers);
    const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);
    const [tableRowSelected, setTableRowSelected] = useState<ISuppliersItem | null>(null);
    const [rowIdSelected, setRowIdSelected] = useState(0);

    useEffect(() => {
        if (suppliers.length) {
            setTableData(suppliers);
        }
    }, [suppliers]);

    const dataFiltered = tableData;

    const renderCRUDForm = () => (
        <SupplierNewEditForm
            open={openCrudForm.value}
            onClose={openCrudForm.onFalse}
            selectedId={rowIdSelected || undefined}
            page={page}
            rowsPerPage={rowsPerPage}
            currentSupplier={tableRowSelected || undefined}
        />
    );


    const renderDetails = () => (
        <SupplierDetails
            open={openDetailsForm.value}
            selectedSupplier={tableRowSelected || undefined}
            onClose={openDetailsForm.onFalse}
        />
    );

    return (
        <>
            <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <CustomBreadcrumbs
                    heading="Nhà cung cấp"
                    links={[
                        { name: 'Tổng quan', href: paths.dashboard.root },
                        { name: 'Cấu hình' },
                        { name: 'Nhà cung cấp' },
                    ]}
                    action={
                        <Button
                            variant="contained"
                            startIcon={<Iconify icon="mingcute:add-line" />}
                            onClick={() => {
                                setTableRowSelected(null);
                                openCrudForm.onTrue();
                            }}
                        >
                            Tạo nhà cung cấp
                        </Button>
                    }
                    sx={{ mb: { xs: 3, md: 5 } }}
                />
                <UseGridTableList
                    dataFiltered={dataFiltered}
                    loading={suppliersLoading}
                    columns={SUPPLIERS_COLUMNS({ openDetailsForm, openCrudForm, confirmDelRowDialog, setRowIdSelected, setTableRowSelected })}
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