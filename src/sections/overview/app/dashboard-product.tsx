import { Box, Card, CardContent, CardHeader, Divider, ListItemText, Skeleton, Stack, Typography } from "@mui/material";
import { StatisticForProducts } from "src/actions/statistics";
import { Iconify } from "src/components/iconify";
import { useSettingsContext } from "src/components/settings";
import { fCurrencyNoUnit } from "src/utils/format-number";

type DashBoardProductProps = {
    filter: string;
};

export function DashBoardProduct({ filter }: DashBoardProductProps) {
    const { productsResult, productsResultLoading } = StatisticForProducts(filter);
    const settings = useSettingsContext();
    const darkMode = settings.state.colorScheme;
    const {
        inventory,
        inventoryAmounts,
        totalImport,
        totalImportAmounts,
        totalExport,
        totalExportAmounts,
    } = productsResult || {};

    const renderValue = (value?: number) => (
        <Box display="flex" justifyContent="flex-end">
            {productsResultLoading ? (
                <Skeleton variant="text" width={100} height={28} sx={{ ml: 'auto' }} />
            ) : (
                <Typography align="right" color="rgba(66, 81, 102, 1)" fontWeight={800}>
                    {fCurrencyNoUnit(value) ?? 0}
                </Typography>
            )}
        </Box>
    );

    const renderAmount = (value?: number) => (
        <Box display="flex" justifyContent="flex-end">
            {productsResultLoading ? (
                <Skeleton variant="text" width={100} height={28} sx={{ ml: 'auto' }} />
            ) : (
                <Typography color="rgba(17, 49, 46, 0.7)" textAlign="right">
                    {fCurrencyNoUnit(value || 0)}
                </Typography>
            )}
        </Box>
    );

    return (
        <Card sx={{ borderRadius: 3, overflow: 'hidden', height: '100%' }}>
            <CardHeader
                title="Hàng hóa"
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
                        border={'0.5px solid #ddd'}
                        bgcolor="common.white"
                        borderRadius={2}
                        boxShadow={2}
                        p={1.5}
                    >
                        <Stack flex={1} direction="row" alignItems="flex-start" spacing={1}>
                            <Iconify icon="tabler:building-warehouse" width={24} color="#1C252E" />
                            <ListItemText
                                primary={
                                    <Typography fontWeight={700} color="rgba(5, 0, 78, 1)">
                                        Tồn kho
                                    </Typography>
                                }
                                secondary="Giá trị"
                            />
                        </Stack>

                        <Stack flex={1} direction="column" justifyContent="center">
                            {renderValue(inventory)}
                            {renderAmount(inventoryAmounts)}
                        </Stack>
                    </Box>

                    <Box
                        display="flex"
                        flexDirection={{ xs: 'column', sm: 'row' }}
                        bgcolor="rgba(220, 252, 231, 1)"
                        borderRadius={2}
                        boxShadow={2}
                        p={1.5}
                    >
                        <Stack flex={1} direction="row" alignItems="flex-start" spacing={1}>
                            <Iconify icon="ph:file-plus" width={24} color="#1C252E" />
                            <ListItemText
                                primary={
                                    <Typography fontWeight={700} color="rgba(5, 0, 78, 1)">
                                        Tổng nhập
                                    </Typography>
                                }
                                secondary="Giá trị"
                            />
                        </Stack>

                        <Stack flex={1} direction="column" justifyContent="center">
                            {renderValue(totalImport)}
                            {renderAmount(totalImportAmounts)}
                        </Stack>
                    </Box>

                    <Box
                        display="flex"
                        flexDirection={{ xs: 'column', sm: 'row' }}
                        bgcolor="rgba(255, 226, 229, 1)"
                        borderRadius={2}
                        boxShadow={2}
                        p={1.5}
                    >
                        <Stack flex={1} direction="row" alignItems="flex-start" spacing={1}>
                            <Iconify icon="ph:file-minus" width={24} color="#1C252E" />
                            <ListItemText
                                primary={
                                    <Typography fontWeight={700} color="rgba(5, 0, 78, 1)">
                                        Tổng bán
                                    </Typography>
                                }
                                secondary="Giá trị"
                            />
                        </Stack>

                        <Stack flex={1} direction="column" justifyContent="center">
                            {renderValue(totalExport)}
                            {renderAmount(totalExportAmounts)}
                        </Stack>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
}