import {
    Box,
    TablePagination,
    Skeleton,
    Button,
    Card,
    Divider,
} from '@mui/material';
import { QuotationItem } from './quotation-item';
import { ChangeEvent, useEffect, useState } from 'react';
import { QuotationFilterBar } from './quotation-filter';
import { useGetQuotations } from 'src/actions/quotation';
import { FilterValues, IQuotationItem } from 'src/types/quotation';
import { formatDate } from 'src/utils/format-time-vi';
import { EmptyContent } from 'src/components/empty-content';
import { deleteOne } from 'src/actions/delete';
import { endpoints } from 'src/lib/axios';
import { toast } from 'sonner';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useBoolean } from 'minimal-shared/hooks';

type Props = {
    onViewDetails: (quotation: IQuotationItem) => void;
    onEditing: (quotation: IQuotationItem) => void;
    page: number;
    setPage: (value: any) => void;
    rowsPerPage: number;
    setRowsPerPage: (value: any) => void;
    setFromDate: (value: any) => void;
    setToDate: (value: any) => void;
};

export function QuotationCardList({
    onViewDetails,
    onEditing,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    setFromDate,
    setToDate
}: Props) {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1);
    const confirmDelRowDialog = useBoolean();

    const [filters, setFilters] = useState<FilterValues>({
        fromDate: null,
        toDate: null,
    });

    const [searchText, setSearchText] = useState("");

    const { quotations, quotationsLoading, pagination, quotationsEmpty } = useGetQuotations({
        pageNumber: page + 1,
        pageSize: rowsPerPage,
        key: searchText,
        fromDate: filters.fromDate,
        toDate: filters.toDate,
    });

    const [tableData, setTableData] = useState<IQuotationItem[]>([]);

    const [idSelected, setIdSelected] = useState(0);

    useEffect(() => {
        setTableData(quotations);
    }, [quotations]);

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
        if (id === 0 || !id) return;
        const success = await deleteOne({
            apiEndpoint: endpoints.quotation.delete(id),
            listEndpoint: endpoints.quotation.list(`?pageNumber=${page + 1}&pageSize=${rowsPerPage}&fromDate=${filters.fromDate}&toDate=${filters.toDate}&Status=1`),
        });
        if (success) {
            toast.success("Xóa thành công phiếu báo giá!");
        } else {
            toast.error("Xóa thất bại, vui lòng kiểm tra lại!");
        }
    }

    const renderConfirmDeleteRow = () => (
        <ConfirmDialog
            open={confirmDelRowDialog.value}
            onClose={confirmDelRowDialog.onFalse}
            title="Xác nhận xóa phiếu báo giá"
            content={
                <>
                    Bạn có chắc chắn muốn xóa phiếu báo giá này?
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
                height: "70vh",
            }}
        >
            <QuotationFilterBar
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
                {quotationsEmpty ?
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
                        {quotationsLoading
                            ? Array.from({ length: rowsPerPage }).map((_, i) => (
                                <Box key={i} sx={{ p: 2, border: "1px solid #eee", borderRadius: 1 }}>
                                    <Skeleton variant="rectangular" height={120} sx={{ mb: 1 }} />
                                    <Skeleton variant="text" width="60%" />
                                    <Skeleton variant="text" width="40%" />
                                </Box>
                            ))
                            : tableData.map((q) => (
                                <QuotationItem
                                    openDeleteDialog={confirmDelRowDialog}
                                    setId={setIdSelected}
                                    key={q.id}
                                    quotate={q}
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