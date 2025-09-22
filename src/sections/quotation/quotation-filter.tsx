// QuotationFilterBar.tsx
import { useEffect, useState } from "react";
import { Stack, Button, TextField, Box } from "@mui/material";
import { Iconify } from "src/components/iconify";
import { FilterValues } from "src/types/quotation";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

type Props = {
    onFilterChange: (values: FilterValues) => void;
    onReset: () => void;
    onSearching: (key: string) => void;
};

export function QuotationFilterBar({ onFilterChange, onReset, onSearching }: Props) {
    const today = dayjs();
    const defaultToDate = today;
    const defaultFromDate = today.subtract(1, "month");

    const [fromDate, setFromDate] = useState<Dayjs | null>(defaultFromDate);
    const [toDate, setToDate] = useState<Dayjs | null>(defaultToDate);

    const handleApply = () => {
        onFilterChange({
            fromDate: fromDate ? fromDate.format("YYYY-MM-DD") : null,
            toDate: toDate ? toDate.format("YYYY-MM-DD") : null,
        });
    };

    const handleReset = () => {
        setFromDate(defaultFromDate);
        setToDate(defaultToDate);
        onReset();
    };

    const isChanged =
        !fromDate?.isSame(defaultFromDate, "day") ||
        !toDate?.isSame(defaultToDate, "day");

    useEffect(() => {
        handleApply();
    }, []);

    return (
        <Stack
            direction={{ xs: "column", sm: "column", md: "row" }}
            gap={{ xs: 2, sm: 2, md: 0 }}
            sx={{ m: 3 }}
            alignItems="center"
            justifyContent="space-between"
        >
            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems="center"
            >
                <DatePicker
                    label="Từ ngày"
                    value={fromDate}
                    onChange={(newValue) => setFromDate(newValue)}
                    format="DD/MM/YYYY"
                    slotProps={{ textField: { size: "small" } }}
                />
                <DatePicker
                    label="Đến ngày"
                    value={toDate}
                    onChange={(newValue) => setToDate(newValue)}
                    format="DD/MM/YYYY"
                    slotProps={{ textField: { size: "small" } }}
                />
                <Button
                    variant="contained"
                    onClick={handleApply}
                    startIcon={<Iconify icon="solar:filter-bold" />}
                >
                    Lọc
                </Button>
                {isChanged && (
                    <Button
                        variant="outlined"
                        color="inherit"
                        onClick={handleReset}
                        startIcon={<Iconify icon="cil:reload" />}
                    >
                        Đặt lại
                    </Button>
                )}
            </Stack>
            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems="center"
            >
                <TextField
                    size="small"
                    variant="outlined"
                    placeholder="Tìm kiếm..."
                    onChange={(e) => onSearching(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <Iconify
                                icon="eva:search-fill"
                                sx={{ color: 'text.disabled', width: 20, height: 20, mr: 1 }}
                            />
                        ),
                    }}
                />
            </Stack>
        </Stack>
    );
}