import { Box, Card, CardContent, CardHeader, Divider, FormControl, FormControlLabel, FormGroup, InputLabel, ListItemText, Menu, MenuItem, Select, SelectChangeEvent, Skeleton, Stack, Switch, Typography } from "@mui/material";
import { ChangeEvent, useState } from "react";
import { StatisticForFinance, StatisticLocalReceipt } from "src/actions/statistics";
import { EmptyContent } from "src/components/empty-content";
import { Iconify } from "src/components/iconify";
import { useSettingsContext } from "src/components/settings";
import { fCurrencyNoUnit } from "src/utils/format-number";

type DashBoardFinanceProps = {
    filter: string;
};

export function DashBoardFinance({ filter }: DashBoardFinanceProps) {
    const settings = useSettingsContext();
    const darkMode = settings.state.colorScheme;
    const [financeType, setFinanceType] = useState<number>(0);
    const [isSalaryChecked, setIsSalaryChecked] = useState("");

    const handleChange = (event: SelectChangeEvent<number>) => {
        setFinanceType(Number(event.target.value));
    };

    const handleSwitchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setIsSalaryChecked(event.target.checked ? "Salary" : "");
    };

    const {
        financeResult,
        financeResultLoading,
        financeResultError,
        financeResultEmpty,
    } = StatisticForFinance(filter);

    const { internalReceipt: receiptFinance, internalReceiptLoading: receiptFinanceLoading } = StatisticLocalReceipt(true, "");
    const { internalReceipt: spendFinance, internalReceiptLoading: spendFinanceLoading } = StatisticLocalReceipt(false, isSalaryChecked);

    const data = financeResult;

    // Nếu lỗi hoặc rỗng
    if (financeResultError) {
        return (
            <Card
                sx={{
                    borderRadius: 3,
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography color="error">Đã xảy ra lỗi khi tải dữ liệu</Typography>
            </Card>
        );
    }

    if (financeResultEmpty) {
        return (
            <Card
                sx={{
                    borderRadius: 3,
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <EmptyContent />
            </Card>
        );
    }

    const renderValue = (value?: number, color?: string) =>
        financeResultLoading ? (
            <Skeleton variant="text" width={100} height={28} sx={{ ml: 'auto' }} />
        ) : (
            <Typography align="right" color={color || 'rgba(66, 81, 102, 1)'} fontWeight={800}>
                {fCurrencyNoUnit(value ?? 0)}
            </Typography>
        );

    const calcPercent = (part?: number, total?: number) => {
        if (!total || total === 0) return 0;
        return ((part ?? 0) / total) * 100;
    };

    const percentCollect = calcPercent(data?.needCollect, data?.contractsTotal);
    const percentSpend = calcPercent(data?.needSpend, data?.contractsTotal);

    return (
        <Card sx={{ borderRadius: 3, overflow: 'hidden', height: '100%' }}>
            <CardHeader
                title={
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                            Tài chính
                        </Box>
                        <Box>
                            <FormControl fullWidth>
                                <InputLabel id="finance-type-label">Loại</InputLabel>
                                <Select
                                    id="finance-type"
                                    labelId="finance-type-label"
                                    label="Loại"
                                    value={financeType}
                                    onChange={handleChange}
                                >
                                    <MenuItem value={0}>Hợp đồng</MenuItem>
                                    <MenuItem value={1}>Nội bộ</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </Stack>
                }
                titleTypographyProps={{
                    fontWeight: 700,
                    fontSize: 18,
                    color: darkMode === 'light' ? 'rgba(5, 0, 78, 1)' : 'info',
                }}
                sx={{ py: '15px' }}
            />
            <Divider />
            <CardContent>
                {financeType === 0 ?
                    <Stack direction="column" spacing={2}>
                        <Box
                            display="flex"
                            flexDirection={{ xs: 'column', sm: 'row' }}
                            bgcolor="rgba(220, 252, 231, 1)"
                            borderRadius={2}
                            p={2.5}
                            boxShadow={2}
                        >
                            <Stack flex={1} direction="row" alignItems="flex-start" spacing={1}>
                                <Iconify icon="ph:file-plus" width={24} color="#1C252E" />
                                <ListItemText
                                    primary={
                                        <Typography fontWeight={700} color="rgba(5, 0, 78, 1)">
                                            Phải thu
                                        </Typography>
                                    }
                                    secondary="Khách hàng"
                                />
                            </Stack>

                            <Stack flex={1} direction="column" justifyContent="center">
                                <ListItemText
                                    primary={renderValue(data?.needCollect, 'rgba(66, 81, 102, 1)')}
                                    secondary="VNĐ"
                                    slotProps={{
                                        secondary: {
                                            sx: { textAlign: 'right' },
                                        },
                                    }}
                                />
                                {financeResultLoading ? (
                                    <Skeleton variant="text" width={140} height={20} sx={{ ml: 'auto' }} />
                                ) : (
                                    <Typography color="rgba(17, 49, 46, 0.7)" textAlign="right">
                                        Chiếm{' '}
                                        <Box component="span" color="rgba(238, 0, 51, 1)" fontWeight={500}>
                                            {percentCollect.toFixed(0)}%
                                        </Box>{' '}
                                        giá trị phải thu
                                    </Typography>
                                )}
                            </Stack>
                        </Box>

                        <Box
                            display="flex"
                            flexDirection={{ xs: 'column', sm: 'row' }}
                            bgcolor="rgba(255, 226, 229, 1)"
                            borderRadius={2}
                            p={2.5}
                            boxShadow={2}
                        >
                            <Stack flex={1} direction="row" alignItems="flex-start" spacing={1}>
                                <Iconify icon="ph:file-minus" width={24} color="#1C252E" />
                                <ListItemText
                                    primary={
                                        <Typography fontWeight={700} color="rgba(5, 0, 78, 1)">
                                            Phải chi
                                        </Typography>
                                    }
                                    secondary="Nhà cung cấp"
                                />
                            </Stack>

                            <Stack flex={1} direction="column" justifyContent="center">
                                <ListItemText
                                    primary={renderValue(data?.needSpend, 'rgba(66, 81, 102, 1)')}
                                    secondary="VNĐ"
                                    slotProps={{
                                        secondary: {
                                            sx: { textAlign: 'right' },
                                        },
                                    }}
                                />
                                {financeResultLoading ? (
                                    <Skeleton variant="text" width={140} height={20} sx={{ ml: 'auto' }} />
                                ) : (
                                    <Typography color="rgba(17, 49, 46, 0.7)" textAlign="right">
                                        Chiếm{' '}
                                        <Box component="span" color="rgba(238, 0, 51, 1)" fontWeight={500}>
                                            {percentSpend.toFixed(0)}%
                                        </Box>{' '}
                                        giá trị phải chi
                                    </Typography>
                                )}
                            </Stack>
                        </Box>
                    </Stack>
                    :
                    <Stack direction="column" spacing={2}>
                        <Box
                            display="flex"
                            flexDirection={{ xs: 'column', sm: 'row' }}
                            bgcolor="rgba(220, 252, 231, 1)"
                            borderRadius={2}
                            p={2.5}
                            boxShadow={2}
                        >
                            <Stack flex={1} direction="row" alignItems="flex-start" spacing={1}>
                                <Iconify icon="ph:file-plus" width={24} color="#1C252E" />
                                <ListItemText
                                    primary={
                                        <Typography fontWeight={700} color="rgba(5, 0, 78, 1)">
                                            Phải thu nội bộ
                                        </Typography>
                                    }
                                // secondary="Khách hàng"
                                />
                            </Stack>

                            <Stack flex={1} direction="column" justifyContent="center">
                                <ListItemText
                                    primary={renderValue(receiptFinance?.totalCollectAmounts, 'rgba(66, 81, 102, 1)')}
                                    secondary="VNĐ"
                                    slotProps={{
                                        secondary: {
                                            sx: { textAlign: 'right' },
                                        },
                                    }}
                                />
                                {receiptFinanceLoading ? (
                                    <Skeleton variant="text" width={140} height={20} sx={{ ml: 'auto' }} />
                                ) : (
                                    <ListItemText
                                        primary={renderValue(receiptFinance?.totalSpendAmounts, 'rgba(66, 81, 102, 1)')}
                                        secondary="VNĐ"
                                        slotProps={{
                                            secondary: {
                                                sx: { textAlign: 'right' },
                                            },
                                        }}
                                    />
                                )}
                            </Stack>
                        </Box>

                        <Box
                            display="flex"
                            flexDirection={{ xs: 'column', sm: 'row' }}
                            bgcolor="rgba(255, 226, 229, 1)"
                            borderRadius={2}
                            p={2.5}
                            boxShadow={2}
                        >
                            <Stack flex={1} direction="row" alignItems="flex-start" spacing={1}>
                                <Iconify icon="ph:file-minus" width={24} color="#1C252E" />
                                <ListItemText
                                    primary={
                                        <Typography fontWeight={700} color="rgba(5, 0, 78, 1)">
                                            Phải chi nội bộ
                                        </Typography>
                                    }
                                    secondary={
                                        <FormGroup>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={isSalaryChecked === "Salary"}
                                                        onChange={handleSwitchChange}
                                                    />
                                                }
                                                label="Chi lương"
                                            />
                                        </FormGroup>
                                    }
                                />
                            </Stack>

                            <Stack flex={1} direction="column" justifyContent="center">
                                <ListItemText
                                    primary={renderValue(spendFinance?.totalCollectAmounts, 'rgba(66, 81, 102, 1)')}
                                    secondary="VNĐ"
                                    slotProps={{
                                        secondary: {
                                            sx: { textAlign: 'right' },
                                        },
                                    }}
                                />
                                {spendFinanceLoading ? (
                                    <Skeleton variant="text" width={140} height={20} sx={{ ml: 'auto' }} />
                                ) : (
                                    <ListItemText
                                        primary={renderValue(spendFinance?.totalSpendAmounts, 'rgba(66, 81, 102, 1)')}
                                        secondary="VNĐ"
                                        slotProps={{
                                            secondary: {
                                                sx: { textAlign: 'right' },
                                            },
                                        }}
                                    />
                                )}
                            </Stack>
                        </Box>
                    </Stack>
                }
            </CardContent>
        </Card>
    );
}