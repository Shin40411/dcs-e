import { Button } from "@mui/material";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useBoolean } from "minimal-shared/hooks";
import { ChangeEvent, useEffect, useState } from "react";
import { useGetReceiptContract } from "src/actions/contract";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { UseGridTableList } from "src/components/data-grid-table/data-grid-table";
import { Iconify } from "src/components/iconify";
import { RECEIPT_COLUMNS } from "src/const/receipt";
import { CONFIG } from "src/global-config";
import { DashboardContent } from "src/layouts/dashboard";
import { paths } from "src/routes/paths";
import { IContractReceiptItem, IReceiptContract } from "src/types/contract";

export function ReceiptMainView() {
    const openCrudForm = useBoolean();
    const openDetailsForm = useBoolean();
    const confirmDelRowDialog = useBoolean();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(CONFIG.pageSizesGlobal);
    const [searchText, setSearchText] = useState('');
    const {
        contractReceipt,
        contractReceiptItem,
        contractReceiptLoading,
        pagination
    } = useGetReceiptContract({
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

    const [tableData, setTableData] = useState<IReceiptContract[]>(contractReceiptItem);
    const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);
    const [tableRowSelected, setTableRowSelected] = useState<IReceiptContract | null>(null);
    const [rowIdSelected, setRowIdSelected] = useState(0);

    useEffect(() => {
        setTableData(contractReceiptItem);
    }, [contractReceiptItem]);

    return (
        <>
            <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <CustomBreadcrumbs
                    heading="Phiếu thu"
                    links={[
                        { name: 'Tổng quan', href: paths.dashboard.root },
                        { name: 'Nội bộ' },
                        { name: 'Phiếu thu' },
                    ]}
                    // action={
                    //     <Button
                    //         variant="contained"
                    //         startIcon={<Iconify icon="mingcute:add-line" />}
                    //         onClick={() => {
                    //         }}
                    //     >
                    //         Tạo phiếu thu
                    //     </Button>
                    // }
                    sx={{ mb: { xs: 3, md: 5 } }}
                />
                <UseGridTableList
                    dataFiltered={tableData}
                    loading={contractReceiptLoading}
                    columns={
                        RECEIPT_COLUMNS({
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
            </DashboardContent>
        </>
    );
}