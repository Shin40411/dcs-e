import { Autocomplete, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { useGetPayerOrReceiver } from "src/actions/internal";
import { Iconify } from "src/components/iconify";
import { FilterValues } from "src/types/filter-values";
import { IPayerInternal } from "src/types/internal";

type Props = {
    onFilterChange: (values: FilterValues) => void;
    onSearching: (key: string) => void;
    onReset: () => void;
};

export function ReceiptFilterBar({ onFilterChange, onSearching, onReset }: Props) {
    const today = dayjs();
    const defaultToDate = today;
    const defaultFromDate = today.subtract(1, "month");
    const [fromDate, setFromDate] = useState<Dayjs | null>(defaultFromDate);
    const [toDate, setToDate] = useState<Dayjs | null>(defaultToDate);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const [month, setMonth] = useState("");
    const [selectedPayer, setSelectedPayer] = useState<IPayerInternal | null>(null);

    const { result, isLoading } = useGetPayerOrReceiver<IPayerInternal>({
        pageNumber: 1,
        pageSize: 20,
        getPayer: true,
        enabled: true,
    });

    const handleReset = () => {
        setFromDate(defaultFromDate);
        setToDate(defaultToDate);
        setMonth("");
        setSelectedPayer(null);
        onReset();
    };

    const isChanged =
        !fromDate?.isSame(defaultFromDate, "day") ||
        !toDate?.isSame(defaultToDate, "day") ||
        selectedPayer !== null ||
        month !== "";

    const handleApply = () => {
        onFilterChange({
            fromDate: fromDate ? fromDate.format("YYYY-MM-DD") : null,
            toDate: toDate ? toDate.format("YYYY-MM-DD") : null,
            payer: selectedPayer?.payer || undefined,
            month: month ? Number(month) : undefined
        });
    };

    useEffect(() => {
        handleApply();
    }, []);

    return (
        <Stack
            direction={{ xs: "column", sm: "row", md: "row" }}
            gap={2}
            alignItems="center"
            sx={{ p: 1.5, overflowX: 'auto', overflowY: 'hidden' }}
            justifyContent="space-between"
        >
            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems="center"
                p={1}
            >
                <Button
                    variant="contained"
                    size="medium"
                    onClick={handleApply}
                    startIcon={<Iconify icon="solar:filter-bold" />}
                    sx={(theme) => ({ bgcolor: theme.palette.primary.main })}
                >
                    Lọc
                </Button>
                {isChanged && (
                    <Button
                        variant="outlined"
                        color="inherit"
                        size="medium"
                        onClick={handleReset}
                        startIcon={<Iconify icon="cil:reload" />}
                        sx={{
                            height: 40,
                            whiteSpace: 'nowrap'
                        }}
                    >
                        Đặt lại
                    </Button>
                )}
            </Stack>
            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems="center"
                p={1}
            >
                <Autocomplete
                    fullWidth
                    size="small"
                    options={result}
                    loading={isLoading}
                    value={selectedPayer}
                    getOptionLabel={(option) => option.payer || "Chưa cập nhật"}
                    onChange={(_, newValue) => setSelectedPayer(newValue)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Người nộp tiền"
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <>
                                        {isLoading ? <CircularProgress size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                    </>
                                ),
                            }}
                        />
                    )}
                    sx={{
                        width: 250,
                        height: 40,
                    }}
                />

                <FormControl
                    fullWidth={false}
                    size="small"
                    sx={{
                        width: 150,
                        height: 40,
                        '& .MuiSelect-select': {
                            display: "flex",
                            alignItems: "center",
                            height: "40px !important",
                            paddingY: 0,
                        },
                    }}
                >
                    <InputLabel id="month-select-label">Trong tháng</InputLabel>
                    <Select
                        labelId="month-select-label"
                        value={month}
                        label="Trong tháng"
                        onChange={(e) => setMonth(e.target.value)}
                    >
                        {months.map((m) => (
                            <MenuItem key={m} value={m}>
                                Tháng {m}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <DatePicker
                    label="Từ ngày"
                    value={fromDate}
                    onChange={(newValue) => setFromDate(newValue)}
                    format="DD/MM/YYYY"
                    slotProps={{ textField: { size: "small" } }}
                    sx={{
                        width: 180,
                    }}
                />
                <DatePicker
                    label="Đến ngày"
                    value={toDate}
                    onChange={(newValue) => setToDate(newValue)}
                    format="DD/MM/YYYY"
                    slotProps={{ textField: { size: "small" } }}
                    sx={{
                        width: 180,
                    }}
                />

                <TextField
                    size="small"
                    variant="outlined"
                    placeholder="Tìm kiếm..."
                    sx={{
                        width: 200,
                    }}
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