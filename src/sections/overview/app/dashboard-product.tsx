import { Box, Card, CardContent, CardHeader, Divider, ListItemText, Stack, Typography } from "@mui/material";
import { Iconify } from "src/components/iconify";

export function DashBoardProduct() {
    return (
        <Card sx={{ borderRadius: 3, overflow: 'hidden', height: '100%', }}>
            <CardHeader
                title="Hàng hóa"
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
                        border={'0.5px solid #ddd'}
                        borderRadius={2}
                        boxShadow={2}
                        p={1.5}
                    >
                        <Stack flex={1} direction="row" alignItems="flex-start" spacing={1}>
                            <Iconify icon="tabler:building-warehouse" width={24} />
                            <ListItemText
                                primary={
                                    <Typography fontWeight={700} color="rgba(5, 0, 78, 1)">
                                        Tồn kho
                                    </Typography>
                                }
                                secondary={
                                    "Giá trị"
                                }
                            />
                        </Stack>

                        <Stack flex={1} direction="column" justifyContent="center">
                            <ListItemText
                                primary={<Typography align="right" color="rgba(66, 81, 102, 1)" fontWeight={800}>
                                    90
                                </Typography>}
                            />
                            <Typography color="rgba(17, 49, 46, 0.7)" textAlign="right">
                                2.925.147.367
                            </Typography>
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
                            <Iconify icon="ph:file-plus" width={24} />
                            <ListItemText
                                primary={
                                    <Typography fontWeight={700} color="rgba(5, 0, 78, 1)">
                                        Tổng nhập
                                    </Typography>
                                }
                                secondary={
                                    "Giá trị"
                                }
                            />
                        </Stack>

                        <Stack flex={1} direction="column" justifyContent="center">
                            <ListItemText
                                primary={<Typography align="right" color="rgba(66, 81, 102, 1)" fontWeight={800}>
                                    120
                                </Typography>}
                            />
                            <Typography color="rgba(17, 49, 46, 0.7)" textAlign="right">
                                2.925.147.367
                            </Typography>
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
                            <Iconify icon="ph:file-minus" width={24} />
                            <ListItemText
                                primary={
                                    <Typography fontWeight={700} color="rgba(5, 0, 78, 1)">
                                        Tổng bán
                                    </Typography>
                                }
                                secondary={
                                    "Giá trị"
                                }
                            />
                        </Stack>

                        <Stack flex={1} direction="column" justifyContent="center">
                            <ListItemText
                                primary={<Typography align="right" color="rgba(66, 81, 102, 1)" fontWeight={800}>
                                    150
                                </Typography>}
                            />
                            <Typography color="rgba(17, 49, 46, 0.7)" textAlign="right">
                                3.553.890.589
                            </Typography>
                        </Stack>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
}