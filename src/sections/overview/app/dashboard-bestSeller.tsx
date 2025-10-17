import { Box, Card, Divider, LinearProgress, MenuItem, Select, SelectChangeEvent, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { useState } from "react";

export function DashBoardBestSeller() {
    const [category, setCategory] = useState('PC - Lắp ráp');

    const handleChange = (event: SelectChangeEvent) => {
        setCategory(event.target.value);
    };

    const rows = [
        {
            id: 1,
            name: 'Máy bộ lắp ráp',
            percent: 0.8,
            color: '#3b82f6',
            value: '128.321.000',
        },
        {
            id: 2,
            name: 'Máy bộ vi tính',
            percent: 0.7,
            color: '#10b981',
            value: '110.567.000',
        },
        {
            id: 3,
            name: 'Máy bộ lắp ráp core i5',
            percent: 0.65,
            color: '#a855f7',
            value: '105.953.000',
        },
        {
            id: 4,
            name: 'Máy bộ lắp ráp core i3',
            percent: 0.55,
            color: '#f59e0b',
            value: '95.258.000',
        },
        {
            id: 5,
            name: 'Máy bộ lắp ráp core i7',
            percent: 0.45,
            color: '#ef4444',
            value: '90.258.000',
        },
    ];

    return (
        <Card
            sx={{
                boxShadow: 3,
                overflow: 'hidden',
                height: '100%'
            }}
        >
            <Stack direction="row" justifyContent="space-between" alignItems="center" px={2.5} pt={2}>
                <Typography fontWeight={700} fontSize={18} color="rgba(5, 0, 78, 1)">
                    Top hàng hóa bán chạy
                </Typography>

                <Select
                    size="small"
                    value={category}
                    onChange={handleChange}
                    sx={{
                        fontWeight: 500,
                        borderRadius: 1,
                        bgcolor: '#f9fafb',
                        '.MuiSelect-outlined': { py: 0.5 },
                    }}
                >
                    <MenuItem value="PC - Lắp ráp">PC - Lắp ráp</MenuItem>
                    <MenuItem value="Laptop">Laptop</MenuItem>
                    <MenuItem value="Linh kiện">Linh kiện</MenuItem>
                </Select>
            </Stack>
            <Divider sx={{ mt: 1 }} />
            <Box pb={2.5}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ width: 60, fontWeight: 600, color: 'text.secondary' }}>#</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Tên sản phẩm</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                SL bán/ tổng SL kho
                            </TableCell>
                            <TableCell sx={{ textAlign: 'right', fontWeight: 600, color: 'text.secondary' }}>
                                Giá trị bán
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {rows.map((row, index) => (
                            <TableRow
                                key={row.id}
                                sx={{
                                    '&:last-child td': { border: 0 },
                                }}
                            >
                                <TableCell sx={{ py: 3 }}>
                                    <Typography fontWeight={600} color="rgba(5, 0, 78, 0.9)">
                                        {String(index + 1).padStart(2, '0')}
                                    </Typography>
                                </TableCell>

                                <TableCell>
                                    <Typography color="rgba(5, 0, 78, 0.9)" fontWeight={500}>
                                        {row.name}
                                    </Typography>
                                </TableCell>

                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LinearProgress
                                            variant="determinate"
                                            value={row.percent * 100}
                                            sx={{
                                                flexGrow: 1,
                                                height: 6,
                                                borderRadius: 5,
                                                backgroundColor: '#e5e7eb',
                                                '& .MuiLinearProgress-bar': {
                                                    backgroundColor: row.color,
                                                },
                                            }}
                                        />
                                    </Box>
                                </TableCell>

                                <TableCell align="right">
                                    <Typography color={row.color} fontWeight={600}>
                                        {row.value}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </Card>
    );
}