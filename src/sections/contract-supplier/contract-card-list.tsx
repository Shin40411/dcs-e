import {
    Box,
    TablePagination,
    Skeleton,
    Button,
    Card,
    Divider,
} from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { FilterValues } from 'src/types/quotation';
import { formatDate } from 'src/utils/format-time-vi';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useBoolean } from 'minimal-shared/hooks';
import { IContractItem } from 'src/types/contract';
import { ContractItem } from './contract-item';
import { ContractFilterBar } from './contract-filter';
import { useGetSupplierContracts } from 'src/actions/contractSupplier';
import { IContractSupplyItem } from 'src/types/contractSupplier';
import { endpoints } from 'src/lib/axios';
import { deleteOne } from 'src/actions/delete';
import { toast } from 'sonner';

type Props = {
    contracts: IContractSupplyItem[];
    contractsEmpty: boolean;
    contractsLoading: boolean;
    pagination: {
        pageNumber: number;
        pageSize: number;
        totalPages: number;
        totalRecord: number;
    };
    onViewDetails: (quotation: IContractSupplyItem) => void;
    onEditing: (quotation: IContractSupplyItem) => void;
    page: number;
    rowsPerPage: number;
    setFilters: (value: any) => void;
    setPage: (value: any) => void;
    setRowsPerPage: (value: any) => void;
    setFromDate: (value: any) => void;
    setToDate: (value: any) => void;
    setSearchText: (value: any) => void;
};

export function ContractCardList({
    contracts,
    contractsEmpty,
    contractsLoading,
    pagination,
    onViewDetails,
    onEditing,
    page,
    rowsPerPage,
    setPage,
    setFilters,
    setRowsPerPage,
    setFromDate,
    setToDate,
    setSearchText,
}: Props) {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1);
    const confirmDelRowDialog = useBoolean();
    const [tableData, setTableData] = useState<IContractSupplyItem[]>([]);

    const [idSelected, setIdSelected] = useState(0);

    useEffect(() => {
        setTableData(contracts);
    }, [contracts]);

    const handleFilterChange = (values: FilterValues) => {
        setFilters(values);
        setFromDate(values.fromDate);
        setToDate(values.toDate);
        setPage(0);
    };

    const handleReset = () => {
        setFilters({
            fromDate: formatDate(lastMonth),
            toDate: formatDate(today),
        });
        setFromDate(formatDate(lastMonth));
        setToDate(formatDate(today));
        setPage(0);
    };

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDeleteRow = async (id: number) => {
        const success = await deleteOne({
            apiEndpoint: endpoints.contractSupplier.delete(id),
            listEndpoint: '/api/v1/contract-suppliers/supplier-contracts',
        });
        if (success) {
            toast.success('Xóa thành công 1 hợp đồng!');
        } else {
            toast.error("Xóa thất bại, vui lòng kiểm tra lại!");
        }
    }

    const renderConfirmDeleteRow = () => (
        <ConfirmDialog
            open={confirmDelRowDialog.value}
            onClose={confirmDelRowDialog.onFalse}
            title="Xác nhận xóa hợp đồng"
            content={
                <>
                    Bạn có chắc chắn muốn xóa hợp đồng này?
                </>
            }
            action={
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                        handleDeleteRow(idSelected);
                        confirmDelRowDialog.onFalse();
                    }}
                >
                    Xác nhận
                </Button>
            }
        />
    );

    return (
        <Card
            sx={{
                display: "flex",
                flexDirection: "column",
                height: { md: "75vh", sm: "100%" },
            }}
        >
            <ContractFilterBar
                onFilterChange={handleFilterChange}
                onSearching={setSearchText}
                onReset={handleReset}
            />
            <Divider />
            <Box
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    p: 2,
                }}
            >
                {contractsEmpty ?
                    (
                        <EmptyContent content='Không có dữ liệu' />
                    )
                    :
                    <Box
                        sx={{
                            gap: 3,
                            display: 'grid',
                            gridTemplateColumns: {
                                xl: 'repeat(5, 1fr)',
                                lg: 'repeat(4, 1fr)',
                                md: 'repeat(3, 1fr)',
                                sm: 'repeat(3, 1fr)',
                                xs: 'repeat(1, 1fr)'
                            },
                        }}
                    >
                        {contractsLoading
                            ? Array.from({ length: rowsPerPage }).map((_, i) => (
                                <Box key={i} sx={{ p: 2, border: "1px solid #eee", borderRadius: 1 }}>
                                    <Skeleton variant="rectangular" height={120} sx={{ mb: 1 }} />
                                    <Skeleton variant="text" width="60%" />
                                    <Skeleton variant="text" width="40%" />
                                </Box>
                            ))
                            : tableData.map((q) => (
                                <ContractItem
                                    openDeleteDialog={confirmDelRowDialog}
                                    setId={setIdSelected}
                                    key={q.id}
                                    contract={q}
                                    onViewDetails={() => onViewDetails(q)}
                                    onEditing={() => onEditing(q)}
                                />
                            ))}
                    </Box>
                }

                {renderConfirmDeleteRow()}
            </Box>
            <Divider />
            <TablePagination
                component="div"
                count={pagination.totalRecord}
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
    );
}