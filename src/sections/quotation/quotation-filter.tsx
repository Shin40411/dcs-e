// QuotationFilterBar.tsx
import { useState } from "react";
import { Stack, Button, TextField } from "@mui/material";
import { Iconify } from "src/components/iconify";

type FilterValues = {
    fromDate: string;
    toDate: string;
};

type Props = {
    onFilterChange: (values: FilterValues) => void;
    onReset: () => void;
};

export function QuotationFilterBar({ onFilterChange, onReset }: Props) {
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const handleApply = () => {
        onFilterChange({ fromDate, toDate });
    };

    const handleReset = () => {
        setFromDate("");
        setToDate("");
        onReset();
    };

    return (
        <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ mb: 3 }}
            alignItems="center"
        >
            <TextField
                label="Từ ngày"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
            />
            <TextField
                label="Đến ngày"
                type="date"
                value={toDate}
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
            {(fromDate || toDate) && (
                <Button
                    variant="outlined"
                    color="inherit"
                    onClick={handleReset}
                    startIcon={<Iconify icon="eva:close-fill" />}
                >
                    Xóa
                </Button>
            )}
        </Stack>
    );
}
