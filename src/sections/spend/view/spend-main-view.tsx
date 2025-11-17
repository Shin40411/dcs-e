import { Button } from "@mui/material";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useBoolean } from "minimal-shared/hooks";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { useGetReceiptContract } from "src/actions/contract";
import { deleteOne } from "src/actions/delete";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { ConfirmDialog } from "src/components/custom-dialog";
import { UseGridTableList } from "src/components/data-grid-table/data-grid-table";
import { CONFIG } from "src/global-config";
import { DashboardContent } from "src/layouts/dashboard";
import { endpoints } from "src/lib/axios";
import { paths } from "src/routes/paths";
import { IReceiptContract } from "src/types/contract";
import { SpendNewEditForm } from "../spend-new-edit-form";
import { SPEND_COLUMNS } from "src/const/spend";
import { useCheckPermission } from "src/auth/hooks/use-check-permission";
import { RoleBasedGuard } from "src/auth/guard";

export function SpendMainView() {
    const openCrudForm = useBoolean();
    const openDetailsForm = useBoolean();
    const confirmDelRowDialog = useBoolean();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(CONFIG.pageSizesGlobal);
    const [searchText, setSearchText] = useState('');
    const { permission } = useCheckPermission(['PHIEUCHI.VIEW']);

    const {
        contractReceipt,
        contractReceiptItem,
        contractReceiptLoading,
        pagination,
        mutation
    } = useGetReceiptContract({
        pageNumber: page + 1,
        pageSize: rowsPerPage,
        key: searchText,
        enabled: true,
        ContractType: 'supplier',
        ReceiptType: 'spend'
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

    const [tableData, setTableData] = useState<IReceiptContract[]>(contractReceiptItem);
    const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);
    const [tableRowSelected, setTableRowSelected] = useState<IReceiptContract | null>(null);
    const [rowIdSelected, setRowIdSelected] = useState(0);

    useEffect(() => {
        setTableData(contractReceiptItem);
    }, [contractReceiptItem]);

    const handleDeleteRow = async () => {
        const success = await deleteOne({
            apiEndpoint: endpoints.contractReceipt.delete,
            listEndpoint: '/api/v1/contract-receipts/get-receipts',
            bodyEndpoint: {
                receiptId: rowIdSelected,
                contractNo: tableRowSelected?.contractNo
            }
        });
        if (success) {
            toast.success('Xóa thành công 1 phiếu chi!');
        } else {
            toast.error("Xóa thất bại, vui lòng kiểm tra lại!");
        }
    }

    return (
        <RoleBasedGuard
            hasContent
            currentRole={permission?.name || ''}
            allowedRoles={['PHIEUCHI.VIEW']}
            sx={{ py: 10 }}
        >
            <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <CustomBreadcrumbs
                    heading="Phiếu chi"
                    links={[
                        { name: 'Tổng quan', href: paths.dashboard.root },
                        { name: 'Nội bộ' },
                        { name: 'Phiếu chi' },
                    ]}
                    // action={
                    //     <Button
                    //         variant="contained"
                    //         startIcon={<Iconify icon="mingcute:add-line" />}
                    //         onClick={() => {
                    //         }}
                    //     >
                    //         Tạo phiếu chi
                    //     </Button>
                    // }
                    sx={{ mb: { xs: 3, md: 5 } }}
                />
                <UseGridTableList
                    dataFiltered={tableData}
                    loading={contractReceiptLoading}
                    columns={
                        SPEND_COLUMNS({
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
                <SpendNewEditForm
                    open={openCrudForm.value}
                    onClose={openCrudForm.onFalse}
                    selectedReceipt={tableRowSelected}
                    mutation={mutation}
                />
                <ConfirmDialog
                    open={confirmDelRowDialog.value}
                    onClose={confirmDelRowDialog.onFalse}
                    title="Xác nhận xóa phiếu chi"
                    content={
                        <>
                            Bạn có chắc chắn muốn xóa phiếu chi này?
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
            </DashboardContent>
        </RoleBasedGuard>
    );
}