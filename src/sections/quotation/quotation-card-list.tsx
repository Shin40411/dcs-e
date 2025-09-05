import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Stack,
    Box,
    Pagination,
    paginationClasses,
} from '@mui/material';
import { QuotationItem } from './quotation-item';
import { useState } from 'react';
import { QuotationFilterBar } from './quotation-filter';

const quotations = [
    {
        id: 'Q-001',
        customer: 'Công ty ABC',
        date: '2025-09-05',
        status: true,
        total: 25000000,
        staff: 'Nguyễn Văn A',
        item: [
            { name: 'Laptop Dell XPS 13', qty: 2, price: 18000000 },
            { name: 'Chuột không dây Logitech', qty: 5, price: 350000 },
            { name: 'Bàn phím cơ Keychron K2', qty: 3, price: 2200000 },
        ],
    },
    {
        id: 'Q-002',
        customer: 'Công ty XYZ',
        date: '2025-09-02',
        status: true,
        total: 15500000,
        staff: 'Trần Thị B',
        item: [
            { name: 'Laptop Dell XPS 13', qty: 2, price: 18000000 },
            { name: 'Chuột không dây Logitech', qty: 5, price: 350000 },
            { name: 'Bàn phím cơ Keychron K2', qty: 3, price: 2200000 },
        ],
    },
    {
        id: 'Q-003',
        customer: 'Công ty TNHH Minh Phát',
        date: '2025-09-01',
        status: false,
        total: 7800000,
        staff: 'Phạm Văn C',
        item: [
            { name: 'Laptop Dell XPS 13', qty: 2, price: 18000000 },
            { name: 'Chuột không dây Logitech', qty: 5, price: 350000 },
            { name: 'Bàn phím cơ Keychron K2', qty: 3, price: 2200000 },
        ],
    },
    {
        id: 'Q-004',
        customer: 'Doanh nghiệp Hòa Bình',
        date: '2025-08-29',
        status: true,
        total: 32000000,
        staff: 'Lê Thị D',
        item: [
            { name: 'Laptop Dell XPS 13', qty: 2, price: 18000000 },
            { name: 'Chuột không dây Logitech', qty: 5, price: 350000 },
            { name: 'Bàn phím cơ Keychron K2', qty: 3, price: 2200000 },
        ],
    },
    {
        id: 'Q-005',
        customer: 'Công ty Cổ phần Nam Việt',
        date: '2025-08-25',
        status: false,
        total: 12750000,
        staff: 'Ngô Văn E',
        item: [
            { name: 'Laptop Dell XPS 13', qty: 2, price: 18000000 },
            { name: 'Chuột không dây Logitech', qty: 5, price: 350000 },
            { name: 'Bàn phím cơ Keychron K2', qty: 3, price: 2200000 },
        ],
    },
    {
        id: 'Q-006',
        customer: 'Tập đoàn FPT',
        date: '2025-08-20',
        status: true,
        total: 45900000,
        staff: 'Đinh Thị F',
        item: [
            { name: 'Laptop Dell XPS 13', qty: 2, price: 18000000 },
            { name: 'Chuột không dây Logitech', qty: 5, price: 350000 },
            { name: 'Bàn phím cơ Keychron K2', qty: 3, price: 2200000 },
        ],
    },
    {
        id: 'Q-007',
        customer: 'Công ty TNHH Thiên Long',
        date: '2025-08-15',
        status: true,
        total: 21200000,
        staff: 'Hoàng Văn G',
        item: [
            { name: 'Laptop Dell XPS 13', qty: 2, price: 18000000 },
            { name: 'Chuột không dây Logitech', qty: 5, price: 350000 },
            { name: 'Bàn phím cơ Keychron K2', qty: 3, price: 2200000 },
        ],
    },
    {
        id: 'Q-008',
        customer: 'Doanh nghiệp Tân Á',
        date: '2025-08-10',
        status: false,
        total: 9500000,
        staff: 'Vũ Thị H',
        item: [
            { name: 'Laptop Dell XPS 13', qty: 2, price: 18000000 },
            { name: 'Chuột không dây Logitech', qty: 5, price: 350000 },
            { name: 'Bàn phím cơ Keychron K2', qty: 3, price: 2200000 },
        ],
    },
];

type Props = {
    onViewDetails: (quotation: any) => void;
};

export function QuotationCardList({ onViewDetails }: Props) {
    const [filters, setFilters] = useState<{ fromDate: string; toDate: string }>({
        fromDate: "",
        toDate: "",
    });

    const handleFilterChange = (values: { fromDate: string; toDate: string }) => {
        setFilters(values);
    };

    const handleReset = () => {
        setFilters({ fromDate: "", toDate: "" });
    };

    const filteredQuotations = quotations.filter((q) => {
        const qDate = new Date(q.date).getTime();
        const from = filters.fromDate ? new Date(filters.fromDate).getTime() : null;
        const to = filters.toDate ? new Date(filters.toDate).getTime() : null;

        if (from && qDate < from) return false;
        if (to && qDate > to) return false;
        return true;
    });
    return (
        <>
            <QuotationFilterBar
                onFilterChange={handleFilterChange}
                onReset={handleReset}
            />
            <Box
                sx={{
                    gap: 3,
                    display: 'grid',
                    gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                }}
            >
                {filteredQuotations.map((q) => (
                    <QuotationItem key={q.id} quotate={q} onViewDetails={() => onViewDetails(q)} />
                ))}
            </Box>

            {quotations.length > 8 && (
                <Pagination
                    sx={{
                        mt: { xs: 8, md: 8 },
                        [`& .${paginationClasses.ul}`]: { justifyContent: 'center' },
                    }}
                />
            )}
        </>
    );
}
