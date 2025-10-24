import { Box, Card, CardContent, CardHeader, Divider, ListItemText, Skeleton, Stack, Typography } from "@mui/material";
import { StatisticForFinance } from "src/actions/statistics";
import { Iconify } from "src/components/iconify";
import { useSettingsContext } from "src/components/settings";
import { fCurrencyNoUnit } from "src/utils/format-number";

type DashBoardFinanceProps = {
    filter: string;
};

export function DashBoardFinance({ filter }: DashBoardFinanceProps) {
    const settings = useSettingsContext();
    const darkMode = settings.state.colorScheme;

    const {
        financeResult,
        financeResultLoading,
        financeResultError,
        financeResultEmpty,
    } = StatisticForFinance(filter);

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
                <Typography>Không có dữ liệu</Typography>
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
                title="Tài chính"
                titleTypographyProps={{
                    fontWeight: 700,
                    fontSize: 18,
                    color: darkMode === 'light' ? 'rgba(5, 0, 78, 1)' : 'info',
                }}
                sx={{ py: '15px' }}
            />
            <Divider />
            <CardContent>
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
            </CardContent>
        </Card>
    );
}