import {
    Box,
    TablePagination,
    Skeleton,
    Button,
    Card,
    Divider,
} from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { useGetQuotations } from 'src/actions/quotation';
import { IQuotationItem } from 'src/types/quotation';
import { formatDate } from 'src/utils/format-time-vi';
import { EmptyContent } from 'src/components/empty-content';
import { deleteOne } from 'src/actions/delete';
import { endpoints } from 'src/lib/axios';
import { toast } from 'sonner';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useBoolean } from 'minimal-shared/hooks';
import { QuotationItem } from './quotation-item';
import { FilterValues } from 'src/types/filter-values';
import { QuotationFilterBar } from './quotation-filter';
import { Location } from 'react-router';
import { useGetCompanyInfo } from 'src/actions/companyInfo';

type Props = {
    onViewDetails: (quotation: IQuotationItem) => void;
    onEditing: (quotation: IQuotationItem) => void;
    page: number;
    setPage: (value: any) => void;
    rowsPerPage: number;
    setRowsPerPage: (value: any) => void;
    location: Location<any>;
};

export function QuotationCardList({
    onViewDetails,
    onEditing,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    location
}: Props) {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1);
    const confirmDelRowDialog = useBoolean();

    const [filters, setFilters] = useState<FilterValues>({
        fromDate: formatDate(lastMonth),
        toDate: formatDate(today),
    });

    const [searchText, setSearchText] = useState("");

    const { companyInfoData, mutation: refetchCompanyInfo } = useGetCompanyInfo();

    const { quotations, quotationsLoading, pagination, quotationsEmpty, mutation } = useGetQuotations({
        pageNumber: page + 1,
        pageSize: rowsPerPage,
        key: searchText.trim(),
        type: 'Order',
        fromDate: filters.fromDate,
        toDate: filters.toDate,
        Filter: filters.customer,
        Month: filters.month,
        Status: filters.status
    });

    const [tableData, setTableData] = useState<IQuotationItem[]>([]);

    const [idSelected, setIdSelected] = useState(0);

    useEffect(() => {
        setTableData(quotations);
    }, [quotations]);

    useEffect(() => {
        mutation();
        refetchCompanyInfo();
    }, [location.pathname]);

    const handleFilterChange = (values: FilterValues) => {
        setFilters(values);
        setPage(0);
    };

    const handleReset = () => {
        setFilters({
            fromDate: formatDate(lastMonth),
            toDate: formatDate(today),
            customer: undefined,
            month: undefined,
            status: undefined
        });
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
            listEndpoint: '/api/v1/quotation/quotations',
        });
        if (success) {
            toast.success("Xóa thành công phiếu đặt hàng!");
        } else {
            toast.error("Xóa thất bại, vui lòng kiểm tra lại!");
        }
    }

    const renderConfirmDeleteRow = () => (
        <ConfirmDialog
            open={confirmDelRowDialog.value}
            onClose={confirmDelRowDialog.onFalse}
            title="Xác nhận xóa phiếu đặt hàng"
            content={
                <>
                    Bạn có chắc chắn muốn xóa phiếu đặt hàng này?
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
            elevation={0}
            sx={(theme) => ({
                display: "flex",
                flexDirection: "column",
                height: { md: "70vh", sm: "100%" },
                "&&": {
                    borderRadius: 0,
                    border: `1px solid ${theme.palette.divider}`,
                },
            })}
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
                                    companyInfo={companyInfoData}
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