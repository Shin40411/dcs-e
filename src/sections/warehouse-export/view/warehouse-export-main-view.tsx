import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useBoolean } from "minimal-shared/hooks";
import { ChangeEvent, useEffect, useState } from "react";
import { useGetWarehouseExports } from "src/actions/contract";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { UseGridTableList } from "src/components/data-grid-table/data-grid-table";
import { WAREHOUSE_EXPORT_COLUMNS } from "src/const/warehouseExport";
import { CONFIG } from "src/global-config";
import { DashboardContent } from "src/layouts/dashboard";
import { paths } from "src/routes/paths";
import { IContractWarehouseExportItem } from "src/types/warehouseExport";
import { WarehouseExportNewEditForm } from "../warehouse-export-new-edit-form";
import { deleteOne } from "src/actions/delete";
import { endpoints } from "src/lib/axios";
import { toast } from "sonner";
import { ConfirmDialog } from "src/components/custom-dialog";
import { Button } from "@mui/material";
import { useCheckPermission } from "src/auth/hooks/use-check-permission";
import { RoleBasedGuard } from "src/auth/guard";

export function WarehouseExportMainView() {
    const openCrudForm = useBoolean();
    const openDetailsForm = useBoolean();
    const confirmDelRowDialog = useBoolean();
    const { permission } = useCheckPermission(['PHIEUXUATKHO.VIEW']);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(CONFIG.pageSizesGlobal);
    const [searchText, setSearchText] = useState('');

    const {
        contractWarehouseExports,
        contractWarehouseExportsEmpty,
        contractWarehouseExportsLoading,
        pagination
    } = useGetWarehouseExports({
        pageNumber: page + 1,
        pageSize: rowsPerPage,
        key: searchText,
        enabled: true
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

    const [tableData, setTableData] = useState<IContractWarehouseExportItem[]>(contractWarehouseExports);
    const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);
    const [tableRowSelected, setTableRowSelected] = useState<IContractWarehouseExportItem | null>(null);
    const [rowIdSelected, setRowIdSelected] = useState(0);

    useEffect(() => {
        setTableData(contractWarehouseExports);
    }, [contractWarehouseExports]);

    const renderForm = () => (
        <WarehouseExportNewEditForm
            open={openCrudForm.value}
            onClose={openCrudForm.onFalse}
            selectedWarehouseExport={tableRowSelected}
        />
    )

    const handleDeleteRow = async () => {
        const success = await deleteOne({
            apiEndpoint: endpoints.contractWarehouse.delete(rowIdSelected),
            listEndpoint: '/api/v1/warehouse-exports/get-exports',
        });
        if (success) {
            toast.success('Xóa thành công 1 phiếu xuất kho!');
        } else {
            toast.error("Xóa thất bại, vui lòng kiểm tra lại!");
        }
    }
    const renderConfirmDeleteRow = () => (
        <ConfirmDialog
            open={confirmDelRowDialog.value}
            onClose={confirmDelRowDialog.onFalse}
            title="Xác nhận xóa phiếu xuất kho"
            content={
                <>
                    Bạn có chắc chắn muốn xóa phiếu xuất kho này?
                </>
            }
            action={
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                        handleDeleteRow();
                        confirmDelRowDialog.onFalse();
                    }}
                >
                    Xác nhận
                </Button>
            }
        />
    );

    return (
        <RoleBasedGuard
            hasContent
            currentRole={permission?.name || ''}
            allowedRoles={['PHIEUXUATKHO.VIEW']}
            sx={{ py: 10 }}
        >
            <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <CustomBreadcrumbs
                    heading="Phiếu xuất kho"
                    links={[
                        { name: 'Tổng quan', href: paths.dashboard.root },
                        { name: 'Nội bộ' },
                        { name: 'Phiếu xuất kho' },
                    ]}
                    sx={{ mb: { xs: 3, md: 5 } }}
                />
                <UseGridTableList
                    dataFiltered={tableData}
                    loading={contractWarehouseExportsLoading}
                    columns={
                        WAREHOUSE_EXPORT_COLUMNS({
                            openDetailsForm,
                            openCrudForm,
                            confirmDelRowDialog,
                            setRowIdSelected,
                            setTableRowSelected,
                            page,
                            rowsPerPage
                        })}
                    rowSelectionModel={(newSelectionModel) => setSelectedRowIds(newSelectionModel)}
                    paginationCount={pagination?.totalRecord ?? 0}
                    page={page}
                    handleChangePage={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    searchText={searchText}
                    onSearchChange={setSearchText}
                />
                {renderForm()}
                {renderConfirmDeleteRow()}
            </DashboardContent>
        </RoleBasedGuard>
    );
}