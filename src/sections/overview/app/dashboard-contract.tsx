import { Box, Card, CardContent, CardHeader, Divider, Skeleton, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { StatisticForContract } from "src/actions/statistics";
import { EmptyContent } from "src/components/empty-content";
import { Iconify } from "src/components/iconify";
import { useSettingsContext } from "src/components/settings";
import { fCurrencyNoUnit } from "src/utils/format-number";

type DashBoardContractProps = {
    filter: string;
};

export function DashBoardContract({ filter }: DashBoardContractProps) {
    const theme = useTheme();
    const isBelow1600 = useMediaQuery('(max-width:1600px)');

    const { contractResult, contractResultLoading, contractResultError, contractResultEmpty } = StatisticForContract(filter);
    const settings = useSettingsContext();
    const darkMode = settings.state.colorScheme;

    const customer = contractResult?.customerContract;
    const supplier = contractResult?.supContract;

    if (contractResultError) {
        return (
            <Card sx={{ borderRadius: 3, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="error">Đã xảy ra lỗi khi tải dữ liệu</Typography>
            </Card>
        );
    }

    if (contractResultEmpty) {
        return (
            <Card sx={{ borderRadius: 3, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <EmptyContent />
            </Card>
        );
    }

    const renderValue = (value?: number, color?: string, align: 'center' | 'right' = 'right') =>
        contractResultLoading ? (
            <Skeleton
                variant="text"
                width={80}
                height={28}
                sx={{ mx: align === 'center' ? 'auto' : 0 }}
            />
        ) : (
            <Typography
                color={color || 'text.primary'}
                textAlign={align}
                fontWeight={align === 'center' ? 700 : 500}
            >
                {fCurrencyNoUnit(value ?? 0)}
            </Typography>
        );

    return (
        <Card sx={{ borderRadius: 3, overflow: 'hidden', height: '100%' }}>
            <CardHeader
                title="Hợp đồng"
                titleTypographyProps={{
                    fontWeight: 700,
                    fontSize: 18,
                    color: darkMode === 'light' ? 'rgba(5, 0, 78, 1)' : 'info',
                }}
                sx={{ py: '15px' }}
            />
            <Divider />
            <CardContent>
                <Stack direction={isBelow1600 ? 'column' : 'row'} spacing={2}>
                    <Box
                        flex={1}
                        display="flex"
                        flexDirection="column"
                        bgcolor="rgba(220, 252, 231, 1)"
                        borderRadius={2}
                        p={2.5}
                        boxShadow={2}
                    >
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Iconify icon="mdi:account-outline" width={24} color="#1C252E" />
                            <Typography fontWeight={600} color="#1C252E">
                                Khách hàng
                            </Typography>
                        </Stack>

                        {contractResultLoading ? (
                            <Skeleton variant="text" height={40} width={60} sx={{ mx: 'auto', my: 1 }} />
                        ) : (
                            <Typography
                                variant="h4"
                                fontWeight={700}
                                color="rgba(0, 137, 0, 1)"
                                sx={{ mt: 1, mb: 1 }}
                                textAlign="center"
                            >
                                {customer?.totalContracts ?? 0}
                            </Typography>
                        )}

                        <Stack direction="row" justifyContent="space-between">
                            <Typography color="rgba(17, 49, 46, 0.7)" fontWeight={600}>
                                Quá hạn
                            </Typography>
                            <Box>
                                {renderValue(customer?.totalOverTime, 'rgba(238, 0, 51, 1)')}
                                {renderValue(customer?.overTimeAmounts, 'rgba(238, 0, 51, 0.7)')}
                            </Box>
                        </Stack>

                        <Divider sx={{ my: 1 }} />

                        <Stack direction="row" justifyContent="space-between">
                            <Typography color="rgba(17, 49, 46, 0.7)" fontWeight={600}>
                                Trong hạn
                            </Typography>
                            <Box>
                                {renderValue(customer?.totalOnTime, 'rgba(0, 137, 0, 1)')}
                                {renderValue(customer?.onTimeAmounts, 'rgba(0, 137, 0, 0.7)')}
                            </Box>
                        </Stack>
                    </Box>

                    <Box
                        flex={1}
                        display="flex"
                        flexDirection="column"
                        bgcolor="rgba(255, 226, 229, 1)"
                        borderRadius={2}
                        boxShadow={2}
                        p={2.5}
                    >
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Iconify icon="mdi:handshake-outline" width={24} color="#1C252E" />
                            <Typography fontWeight={600} color="#1C252E">
                                Nhà cung cấp
                            </Typography>
                        </Stack>

                        {contractResultLoading ? (
                            <Skeleton variant="text" height={40} width={60} sx={{ mx: 'auto', my: 1 }} />
                        ) : (
                            <Typography
                                variant="h4"
                                fontWeight={700}
                                color="error.main"
                                sx={{ mt: 1, mb: 1 }}
                                textAlign="center"
                            >
                                {supplier?.totalContracts ?? 0}
                            </Typography>
                        )}

                        <Stack direction="row" justifyContent="space-between">
                            <Typography color="rgba(17, 49, 46, 0.7)" fontWeight={600}>
                                Quá hạn
                            </Typography>
                            <Box>
                                {renderValue(supplier?.totalOverTime, 'rgba(238, 0, 51, 1)')}
                                {renderValue(supplier?.overTimeAmounts, 'rgba(238, 0, 51, 0.7)')}
                            </Box>
                        </Stack>

                        <Divider sx={{ my: 1 }} />

                        <Stack direction="row" justifyContent="space-between">
                            <Typography color="rgba(17, 49, 46, 0.7)" fontWeight={600}>
                                Trong hạn
                            </Typography>
                            <Box>
                                {renderValue(supplier?.totalOnTime, 'rgba(0, 137, 0, 1)')}
                                {renderValue(supplier?.onTimeAmounts, 'rgba(0, 137, 0, 0.7)')}
                            </Box>
                        </Stack>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
}