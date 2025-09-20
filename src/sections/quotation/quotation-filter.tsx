// QuotationFilterBar.tsx
import { useEffect, useState } from "react";
import { Stack, Button, TextField, Box } from "@mui/material";
import { Iconify } from "src/components/iconify";
import { IDateValue } from "src/types/common";
import { FilterValues } from "src/types/quotation";
import { formatDate } from "src/utils/format-time-vi";

type Props = {
    onFilterChange: (values: FilterValues) => void;
    onReset: () => void;
    onSearching: (key: string) => void;
};

export function QuotationFilterBar({ onFilterChange, onReset, onSearching }: Props) {
    const today = new Date();
    const defaultToDate = today.toISOString().split("T")[0];
    const defaultFromDate = new Date(today.setMonth(today.getMonth() - 1))
        .toISOString()
        .split("T")[0];

    const [fromDate, setFromDate] = useState(defaultFromDate);
    const [toDate, setToDate] = useState(defaultToDate);

    const handleApply = () => {
        onFilterChange({ fromDate, toDate });
    };

    const handleReset = () => {
        setFromDate(defaultFromDate);
        setToDate(defaultToDate);
        onReset();
    };

    const isChanged = fromDate !== defaultFromDate || toDate !== defaultToDate;

    useEffect(() => {
        handleApply();
    }, []);

    return (
        <Stack
            direction={{ xs: "column", sm: "column", md: "row" }}
            gap={{ xs: 2, sm: 2, md: 0 }}
            sx={{ mb: 3 }}
            alignItems="center"
            justifyContent="space-between"
        >
            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems="center"
            >
                <TextField
                    label="Từ ngày"
                    type="date"
                    value={fromDate ?? ""}
                    onChange={(e) => setFromDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                />
                <TextField
                    label="Đến ngày"
                    type="date"
                    value={toDate ?? ""}
                    onChange={(e) => setToDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    size="small"
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