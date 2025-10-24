import { Box, Card, CardContent, CardHeader, Divider, Skeleton, Stack, Typography } from "@mui/material";
import { TopSalerStatistic } from "src/actions/statistics";
import { Iconify } from "src/components/iconify";
import { useSettingsContext } from "src/components/settings";
import { fCurrencyNoUnit } from "src/utils/format-number";

type DashBoardTopSalerProps = {
    filter: string;
};

export function DashBoardTopSaler({ filter }: DashBoardTopSalerProps) {
    const { topSaler, topSalerLoading, topSalerEmpty } = TopSalerStatistic({
        pageNumber: 1,
        pageSize: 3,
        filter,
    });
    const settings = useSettingsContext();
    const darkMode = settings.state.colorScheme;
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
                        Top Saler
                    </Typography>
                }
                sx={{ pb: 0, px: 2, pt: 2 }}
            />
            <Divider sx={{ mt: 1 }} />

            <CardContent sx={{ px: 2, pt: 1, pb: 2, height: (topSalerEmpty) ? '100%' : 'auto' }}>
                {topSalerLoading ? (
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
                ) : topSalerEmpty ? (
                    <Stack justifyContent="center" display="flex" height="100%">
                        <Typography textAlign="center" color="text.secondary" py={3}>
                            Không có dữ liệu
                        </Typography>
                    </Stack>
                ) : (
                    <Stack spacing={1.5}>
                        {topSaler?.map((s, i) => (
                            <Stack
                                key={s.employeeId}
                                direction="row"
                                alignItems="center"
                                flexWrap="wrap"
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
                                {/* --- Cột 1: Thông tin nhân viên --- */}
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
                                            noWrap
                                            title={s.fullname}
                                        >
                                            {s.fullname}
                                        </Typography>
                                        <Typography
                                            fontSize="0.8rem"
                                            color="text.secondary"
                                            noWrap
                                            title={s.email}
                                        >
                                            {s.email}
                                        </Typography>
                                    </Box>
                                </Stack>

                                {/* --- Cột 2: Tổng tiền --- */}
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
                                    <Typography
                                        fontWeight={700}
                                        color="rgba(238, 0, 51, 1)"
                                        textAlign="right"
                                    >
                                        {fCurrencyNoUnit(s.totalAmounts)}
                                    </Typography>
                                    <Typography
                                        fontSize="0.75rem"
                                        color="text.secondary"
                                        textAlign="right"
                                    >
                                        VNĐ
                                    </Typography>
                                </Stack>

                                {/* --- Cột 3: Số lượng hợp đồng --- */}
                                <Stack
                                    direction="column"
                                    alignItems="flex-end"
                                    justifyContent="center"
                                    textAlign="right"
                                    sx={{
                                        flex: '1 1 150px',
                                        minWidth: 120,
                                    }}
                                >
                                    <Typography
                                        fontSize="1rem"
                                        fontWeight={700}
                                        color={darkMode === 'light' ? "rgba(17, 49, 46, 0.7)" : 'info'}
                                    >
                                        {s.quantityContract}
                                    </Typography>
                                    <Typography fontSize="0.75rem" color="text.secondary">
                                        {s.percentOfTotal}%
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