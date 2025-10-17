import { Box, Card, CardContent, CardHeader, Divider, ListItemText, Stack, Typography } from "@mui/material";
import { Iconify } from "src/components/iconify";

export function DashBoardFinance() {
    return (
        <Card sx={{ borderRadius: 3, overflow: 'hidden', height: '100%', }}>
            <CardHeader
                title="Tài chính"
                titleTypographyProps={{
                    fontWeight: 700,
                    fontSize: 18,
                    color: 'rgba(5, 0, 78, 1)',
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
                            <Iconify icon="ph:file-plus" width={24} />
                            <ListItemText
                                primary={
                                    <Typography fontWeight={700} color="rgba(5, 0, 78, 1)">
                                        Phải thu
                                    </Typography>
                                }
                                secondary={
                                    "Khách hàng"
                                }
                            />
                        </Stack>

                        <Stack flex={1} direction="column" justifyContent="center">
                            <ListItemText
                                primary={<Typography align="right" color="rgba(66, 81, 102, 1)" fontWeight={800}>
                                    2.345.567.789
                                </Typography>}
                                secondary={'VNĐ'}
                                slotProps={{
                                    secondary: {
                                        sx: { textAlign: "right" },
                                    },
                                }}
                            />
                            <Typography color="rgba(17, 49, 46, 0.7)" textAlign="right">
                                Chiếm{' '}
                                <Box component="span" color="rgba(238, 0, 51, 1)" fontWeight={500}>
                                    66%
                                </Box>{' '}
                                giá trị phải thu
                            </Typography>
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
                            <Iconify icon="ph:file-minus" width={24} />
                            <ListItemText
                                primary={
                                    <Typography fontWeight={700} color="rgba(5, 0, 78, 1)">
                                        Phải chi
                                    </Typography>
                                }
                                secondary={
                                    "Nhà cung cấp"
                                }
                            />
                        </Stack>

                        <Stack flex={1} direction="column" justifyContent="center">
                            <ListItemText
                                primary={<Typography align="right" color="rgba(66, 81, 102, 1)" fontWeight={800}>
                                    1.345.567.789
                                </Typography>}
                                secondary={'VNĐ'}
                                slotProps={{
                                    secondary: {
                                        sx: { textAlign: "right" },
                                    },
                                }}
                            />
                            <Typography color="rgba(17, 49, 46, 0.7)" textAlign="right">
                                Chiếm{' '}
                                <Box component="span" color="rgba(238, 0, 51, 1)" fontWeight={500}>
                                    46%
                                </Box>{' '}
                                giá trị phải chi
                            </Typography>
                        </Stack>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
}