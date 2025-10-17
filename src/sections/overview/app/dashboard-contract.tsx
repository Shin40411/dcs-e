import { Box, Card, CardContent, CardHeader, Divider, Stack, Typography } from "@mui/material";
import { Iconify } from "src/components/iconify";

export function DashBoardContract() {
    return (
        <Card sx={{ borderRadius: 3, overflow: 'hidden', height: '100%', }}>
            <CardHeader
                title="Hợp đồng"
                titleTypographyProps={{
                    fontWeight: 700,
                    fontSize: 18,
                    color: 'rgba(5, 0, 78, 1)',
                }}
                sx={{ py: '15px' }}
            />
            <Divider />
            <CardContent>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    {/* Khách hàng */}
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
                            <Iconify icon="mdi:account-outline" width={24} />
                            <Typography fontWeight={600} color="text.primary">
                                Khách hàng
                            </Typography>
                        </Stack>

                        <Typography
                            variant="h4"
                            fontWeight={700}
                            color="rgba(0, 137, 0, 1)"
                            sx={{ mt: 1, mb: 1 }}
                            textAlign="center"
                        >
                            18
                        </Typography>

                        <Stack direction="row" justifyContent="space-between">
                            <Typography color="rgba(17, 49, 46, 0.7)" fontWeight={600}>
                                Quá hạn
                            </Typography>
                            <Box>
                                <Typography color="rgba(238, 0, 51, 1)" textAlign="right">8</Typography>
                                <Typography align="right" color="rgba(238, 0, 51, 0.7)" fontWeight={500}>
                                    345.567.000
                                </Typography>
                            </Box>
                        </Stack>

                        <Divider sx={{ my: 1 }} />

                        <Stack direction="row" justifyContent="space-between">
                            <Typography color="rgba(17, 49, 46, 0.7)" fontWeight={600}>
                                Trong hạn
                            </Typography>
                            <Box>
                                <Typography color="rgba(0, 137, 0, 1)" textAlign="right">10</Typography>
                                <Typography align="right" color="rgba(0, 137, 0, 0.7)" fontWeight={500}>
                                    2.000.000.789
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>

                    {/* Nhà cung cấp */}
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
                            <Iconify icon="mdi:handshake-outline" width={24} />
                            <Typography fontWeight={600} color="text.primary">
                                Nhà cung cấp
                            </Typography>
                        </Stack>

                        <Typography
                            variant="h4"
                            fontWeight={700}
                            color="error.main"
                            sx={{ mt: 1, mb: 1 }}
                            textAlign="center"
                        >
                            25
                        </Typography>

                        <Stack direction="row" justifyContent="space-between">
                            <Typography color="rgba(17, 49, 46, 0.7)" fontWeight={600}>
                                Quá hạn
                            </Typography>
                            <Box>
                                <Typography color="rgba(238, 0, 51, 1)" textAlign="right">5</Typography>
                                <Typography align="right" color="rgba(238, 0, 51, 0.7)" fontWeight={500}>
                                    45.567.000
                                </Typography>
                            </Box>
                        </Stack>

                        <Divider sx={{ my: 1 }} />

                        <Stack direction="row" justifyContent="space-between">
                            <Typography color="rgba(17, 49, 46, 0.7)" fontWeight={600}>
                                Trong hạn
                            </Typography>
                            <Box>
                                <Typography color="rgba(0, 137, 0, 1)" textAlign="right">20</Typography>
                                <Typography align="right" color="rgba(0, 137, 0, 0.7)" fontWeight={500}>
                                    1.300.000.789
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    )
}