import { useEffect, useState } from "react";
import { Stack, Button, TextField, Box, FormControl, InputLabel, Select, MenuItem, Autocomplete } from "@mui/material";
import { Iconify } from "src/components/iconify";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { FilterValues } from "src/types/filter-values";
import { useGetCustomers } from "src/actions/customer";
import { ICustomerItem } from "src/types/customer";
import { useDebounce } from "minimal-shared/hooks";

type Props = {
    onFilterChange: (values: FilterValues) => void;
    onReset: () => void;
    onSearching: (key: string) => void;
};

export function ContractFilterBar({ onFilterChange, onReset, onSearching }: Props) {
    const [customerkeyword, setCustomerKeyword] = useState('');
    const debouncedCustomerKw = useDebounce(customerkeyword, 300);
    const [selectedCustomer, setSelectedCustomer] = useState<ICustomerItem | null>(null);

    const { customers, customersLoading } = useGetCustomers({
        pageNumber: 1,
        pageSize: 20,
        key: debouncedCustomerKw,
        enabled: true
    });

    const today = dayjs();
    const defaultToDate = today;
    const defaultFromDate = today.subtract(1, "month");

    const [fromDate, setFromDate] = useState<Dayjs | null>(defaultFromDate);
    const [toDate, setToDate] = useState<Dayjs | null>(defaultToDate);

    const statuses = [
        // { value: "Delete", label: "Đã xóa", icon: "mdi:bin-circle-outline" },
        { value: "Cancelled", label: "Bỏ qua", icon: "fluent-color:dismiss-circle-16" },
        { value: "Draft", label: "Nháp", icon: "material-symbols:draft" },
        { value: "WaitingForApproval", label: "Chờ phê duyệt", icon: "streamline-pixel:interface-essential-waiting-hourglass-loading" },
        { value: "Ongoing", label: "Đang thực hiện", icon: "line-md:uploading-loop" },
        { value: "Completed", label: "Đã hoàn thành", icon: "fluent-color:checkmark-circle-16" },
    ];
    const [status, setStatus] = useState("");

    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const [month, setMonth] = useState("");

    const handleApply = () => {
        onFilterChange({
            fromDate: fromDate ? fromDate.format("YYYY-MM-DD") : null,
            toDate: toDate ? toDate.format("YYYY-MM-DD") : null,
            status: status || undefined,
            customer: selectedCustomer?.name
                ? selectedCustomer?.name
                : selectedCustomer?.companyName
                    ? selectedCustomer?.companyName
                    : undefined,
            month: month ? Number(month) : undefined
        });
    };

    const handleReset = () => {
        setFromDate(defaultFromDate);
        setToDate(defaultToDate);
        setSelectedCustomer(null);
        setStatus("");
        setMonth("");
        onReset();
    };

    const isChanged =
        !fromDate?.isSame(defaultFromDate, "day") ||
        !toDate?.isSame(defaultToDate, "day") ||
        status !== "" ||
        selectedCustomer !== null ||
        month !== "";

    useEffect(() => {
        handleApply();
    }, []);

    return (
        <Stack
            direction={{ xs: "column", sm: "column", md: "row" }}
            gap={2}
            sx={{ m: 3, overflowX: 'auto' }}
            alignItems="center"
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
                <FormControl
                    fullWidth={false}
                    size="small"
                    sx={{
                        width: 200,
                        height: 40,
                        '& .MuiSelect-select': {
                            display: "flex",
                            alignItems: "center",
                            height: "40px !important",
                            paddingY: 0,
                        },
                    }}
                >
                    <InputLabel id="status-select-label">Tất cả trạng thái</InputLabel>
                    <Select
                        labelId="status-select-label"
                        value={status}
                        label="Tất cả trạng thái"
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        {statuses.map((s) => (
                            <MenuItem key={s.value} value={s.value}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: 1 }}>
                                    <span>{s.label}</span>
                                    {s.icon && <Iconify icon={s.icon} />}
                                </Box>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Autocomplete
                    fullWidth
                    size="small"
                    options={customers || []}
                    getOptionLabel={(option) => option.name ? option.name : option.companyName ? option.companyName : ""}
                    value={selectedCustomer}
                    onChange={(_, newValue) => setSelectedCustomer(newValue)}
                    onInputChange={(_, newInputValue) => setCustomerKeyword(newInputValue)}
                    loading={customersLoading}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderOption={(props, option) => (
                        <li {...props} key={option.id}>
                            {option.name || option.companyName}
                        </li>
                    )}
                    noOptionsText="Không tìm thấy dữ liệu"
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Tất cả khách hàng"
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
                        width: 200,
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
                    sx={{ width: 180 }}
                />
                <DatePicker
                    label="Đến ngày"
                    value={toDate}
                    onChange={(newValue) => setToDate(newValue)}
                    format="DD/MM/YYYY"
                    slotProps={{ textField: { size: "small" } }}
                    sx={{ width: 180 }}
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