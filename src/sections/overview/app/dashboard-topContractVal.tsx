import { Avatar, Box, Card, CardContent, CardHeader, Divider, Skeleton, Stack, Typography } from "@mui/material";
import { TopContractValStatistic } from "src/actions/statistics";
import { EmptyContent } from "src/components/empty-content";
import { Iconify } from "src/components/iconify";
import { useSettingsContext } from "src/components/settings";
import { fCurrency, fCurrencyNoUnit } from "src/utils/format-number";
import { fDate } from "src/utils/format-time-vi";


type DashBoardTopContractValProps = {
    filter: string;
};

export function DashBoardTopContractVal({ filter }: DashBoardTopContractValProps) {
    const { contractValue, contractValueLoading, contractValueEmpty } = TopContractValStatistic({
        pageNumber: 1,
        pageSize: 3,
        filter,
    });
    const settings = useSettingsContext();
    const darkMode = settings.state.colorScheme;
    const getStatusLabel = (status: number) =>
        status === 1 ? 'Đã hoàn thành' : 'Đang thực hiện';

    const getStatusColor = (status: number) =>
        status === 1 ? 'rgba(76, 175, 80, 1)' : 'rgba(17, 49, 46, 0.7)';

    return (
        <Card
            sx={{
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                overflow: 'hidden',
                height: '100%',
            }}
        >
            <CardHeader
                title={
                    <Typography fontWeight={700} fontSize={18} color={darkMode === 'light' ? "rgba(5, 0, 78, 1)" : "info"}>
                        Top giá trị hợp đồng
                    </Typography>
                }
                sx={{ pb: 0, px: 2, pt: 2 }}
            />
            <Divider sx={{ mt: 1 }} />
            <CardContent sx={{ px: 2, pt: 1, pb: 2, height: (contractValueEmpty) ? '100%' : 'auto', }}>
                {contractValueLoading ? (
                    <Stack spacing={1.5}>
                        {[...Array(3)].map((_, i) => (
                            <Stack
                                key={i}
                                direction="row"
                                alignItems="center"
                                justifyContent="space-between"
                                sx={{
                                    border: '0.5px solid #ddd',
                                    boxShadow: 0.5,
                                    borderRadius: 1.5,
                                    px: 1.5,
                                    py: 1,
                                    opacity: 0.7,
                                }}
                            >
                                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: '1 1 40%' }}>
                                    <Skeleton variant="text" width={100} height={28} sx={{ ml: 'auto' }} />
                                    <Box>
                                        <Skeleton variant="text" width={100} height={28} sx={{ ml: 'auto' }} />
                                        <Skeleton variant="text" width={100} height={28} sx={{ ml: 'auto' }} />
                                    </Box>
                                </Stack>
                            </Stack>
                        ))}
                    </Stack>
                ) : contractValueEmpty ? (
                    <Stack spacing={1.5} height={(contractValueEmpty) ? '100%' : 'auto'} justifyContent="center">
                        <EmptyContent />
                    </Stack>
                ) : (
                    <Stack spacing={1.5}>
                        {contractValue?.map((c, i) => (
                            <Stack
                                key={c.contractID}
                                direction="row"
                                flexWrap="wrap"
                                alignItems="center"
                                sx={{
                                    border: '0.5px solid #ddd',
                                    boxShadow: 0.5,
                                    borderRadius: 1.5,
                                    px: 1.5,
                                    py: 1,
                                    rowGap: 1,
                                    columnGap: 2,
                                }}
                            >
                                {/* --- Cột 1: Thông tin khách hàng --- */}
                                <Stack
                                    direction="row"
                                    spacing={1.5}
                                    alignItems="center"
                                    sx={{
                                        flex: '1 1 220px',
                                        minWidth: 180,
                                    }}
                                >
                                    <Iconify
                                        icon={`noto:${i === 0 ? '1st' : i === 1 ? '2nd' : '3rd'}-place-medal`}
                                        width={32}
                                        height={32}
                                        sx={{ flexShrink: 0 }}
                                    />
                                    <Box sx={{ minWidth: 0 }}>
                                        <Typography
                                            fontWeight={600}
                                            fontSize="0.95rem"
                                            title={c.customerName}
                                        >
                                            {c.customerName}
                                        </Typography>
                                        <Typography
                                            fontSize="0.8rem"
                                            color="text.secondary"
                                            title={c.customerCompany || '—'}
                                        >
                                            {c.customerCompany || '—'}
                                        </Typography>
                                    </Box>
                                </Stack>

                                {/* --- Cột 2: Giá trị hợp đồng --- */}
                                <Stack
                                    direction="column"
                                    justifyContent="center"
                                    alignItems="flex-end"
                                    sx={{
                                        flex: '1 1 150px',
                                        minWidth: 140,
                                        textAlign: 'right',
                                    }}
                                >
                                    {contractValueLoading ? (
                                        <Skeleton variant="text" width={100} height={28} sx={{ ml: 'auto' }} />
                                    ) : (
                                        <>
                                            <Typography fontWeight={700} color="rgba(238, 0, 51, 1)">
                                                {fCurrencyNoUnit(c.total)}
                                            </Typography>
                                            <Typography fontSize="0.75rem" color="text.secondary">
                                                VNĐ
                                            </Typography>
                                        </>
                                    )}
                                </Stack>

                                {/* --- Cột 3: Trạng thái + ngày ký --- */}
                                <Stack
                                    direction="column"
                                    alignItems="flex-end"
                                    justifyContent="center"
                                    sx={{
                                        flex: '1 1 150px',
                                        minWidth: 140,
                                        textAlign: 'right',
                                    }}
                                >
                                    <Typography fontSize="0.8rem" color={getStatusColor(c.status)}>
                                        {getStatusLabel(c.status)}
                                    </Typography>
                                    <Typography fontSize="0.75rem" color="text.secondary">
                                        {fDate(c.signatureDate)}
                                    </Typography>
                                </Stack>
                            </Stack>
                        ))}
                    </Stack>
                )}
            </CardContent>
        </Card>
    );
}