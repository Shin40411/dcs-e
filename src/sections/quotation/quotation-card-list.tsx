import {
    Box,
    TablePagination,
    Skeleton,
} from '@mui/material';
import { QuotationItem } from './quotation-item';
import { ChangeEvent, useEffect, useState } from 'react';
import { QuotationFilterBar } from './quotation-filter';
import { useGetQuotations } from 'src/actions/quotation';
import { FilterValues, IQuotationItem } from 'src/types/quotation';
import { formatDate } from 'src/utils/format-time-vi';
import { EmptyContent } from 'src/components/empty-content';

type Props = {
    onViewDetails: (quotation: IQuotationItem) => void;
};

export function QuotationCardList({ onViewDetails }: Props) {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1);

    const [filters, setFilters] = useState<FilterValues>({
        fromDate: null,
        toDate: null,
    });

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchText, setSearchText] = useState("");

    const { quotations, quotationsLoading, pagination, quotationsEmpty } = useGetQuotations({
        pageNumber: page + 1,
        pageSize: rowsPerPage,
        key: searchText,
        fromDate: filters.fromDate,
        toDate: filters.toDate,
    });

    const [tableData, setTableData] = useState<IQuotationItem[]>([]);

    useEffect(() => {
        setTableData(quotations);
    }, [quotations]);

    const handleFilterChange = (values: FilterValues) => {
        setFilters(values);
        setPage(0);
    };

    const handleReset = () => {
        setFilters({
            fromDate: formatDate(lastMonth),
            toDate: formatDate(today),
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

    return (
        <>
            <QuotationFilterBar
                onFilterChange={handleFilterChange}
                onSearching={setSearchText}
                onReset={handleReset}
            />
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
                            xs: 'repeat(1, 1fr)',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(3, 1fr)',
                            lg: 'repeat(4, 1fr)'
                        },
                    }}
                >
                    {quotationsLoading
                        ? Array.from({ length: rowsPerPage }).map((_, i) => (
                            <Box key={i} sx={{ p: 2, border: "1px solid #eee", borderRadius: 2 }}>
                                <Skeleton variant="rectangular" height={120} sx={{ mb: 1 }} />
                                <Skeleton variant="text" width="60%" />
                                <Skeleton variant="text" width="40%" />
                            </Box>
                        ))
                        : tableData.map((q) => (
                            <QuotationItem
                                key={q.id}
                                quotate={q}
                                onViewDetails={() => onViewDetails(q)}
                            />
                        ))}
                </Box>
            }

            {pagination?.totalRecord > rowsPerPage && (
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
            )}
        </>
    );
}
