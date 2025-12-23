import { Autocomplete, Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { useDebounce } from "minimal-shared/hooks";
import { useEffect, useState } from "react";
import { useGetSupplierContracts } from "src/actions/contractSupplier";
import { Iconify } from "src/components/iconify";
import { IContractSupplyItem } from "src/types/contractSupplier";
import { FilterValues } from "src/types/filter-values";

type Props = {
    onFilterChange: (values: FilterValues) => void;
    onSearching: (key: string) => void;
    onReset: () => void;
};

export function WarehouseImportFilterBar({ onFilterChange, onSearching, onReset }: Props) {
    const today = dayjs();
    const defaultToDate = today;
    const defaultFromDate = today.subtract(1, "month");
    const [fromDate, setFromDate] = useState<Dayjs | null>(defaultFromDate);
    const [toDate, setToDate] = useState<Dayjs | null>(defaultToDate);

    const [contractkeyword, setContractKeyword] = useState('');
    const debouncedContractKw = useDebounce(contractkeyword, 300);
    const [selectedContract, setSelectedContract] = useState<IContractSupplyItem | null>(null);
    const { contracts, contractsLoading } = useGetSupplierContracts({
        pageNumber: 1,
        pageSize: 20,
        key: debouncedContractKw,
        enabled: true
    });

    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const [month, setMonth] = useState("");

    const handleReset = () => {
        setFromDate(defaultFromDate);
        setToDate(defaultToDate);
        setSelectedContract(null);
        setMonth("");
        onReset();
    };

    const isChanged =
        !fromDate?.isSame(defaultFromDate, "day") ||
        !toDate?.isSame(defaultToDate, "day") ||
        selectedContract !== null ||
        month !== "";

    const handleApply = () => {
        onFilterChange({
            fromDate: fromDate ? fromDate.format("YYYY-MM-DD") : null,
            toDate: toDate ? toDate.format("YYYY-MM-DD") : null,
            contract: selectedContract?.contractNo
                ? selectedContract?.contractNo
                : undefined,
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
                    options={contracts || []}
                    getOptionLabel={(option) => option.contractNo || ""}
                    value={selectedContract}
                    onChange={(_, newValue) => setSelectedContract(newValue)}
                    onInputChange={(_, newInputValue) => setContractKeyword(newInputValue)}
                    loading={contractsLoading}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderOption={(props, option) => (
                        <li {...props} key={option.id}>
                            {option.contractNo || ""}
                        </li>
                    )}
                    noOptionsText="Không tìm thấy dữ liệu"
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Tất cả số hợp đồng"
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <>
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