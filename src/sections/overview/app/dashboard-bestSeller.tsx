import { Autocomplete, Box, Card, CircularProgress, Divider, LinearProgress, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { useDebounce } from "minimal-shared/hooks";
import { useState } from "react";
import { useGetCategories } from "src/actions/category";
import { TopBestSellerStatistic } from "src/actions/statistics";
import { EmptyContent } from "src/components/empty-content";
import { useSettingsContext } from "src/components/settings";
import { ICategoryItem } from "src/types/category";
import { fCurrencyNoUnit } from "src/utils/format-number";

type DashBoardBestSellerProps = {
    filter: string;
};

export function DashBoardBestSeller({ filter }: DashBoardBestSellerProps) {
    const [categorykeyword, setCategoryKeyword] = useState('');
    const debouncedCategoryKw = useDebounce(categorykeyword, 300);
    const [category, setCategory] = useState<null | ICategoryItem>(null);
    const settings = useSettingsContext();
    const darkMode = settings.state.colorScheme;
    const { categories, categoriesLoading } = useGetCategories({
        pageNumber: 1,
        pageSize: 5,
        key: debouncedCategoryKw,
        enabled: true
    });

    const { bestSeller, bestSellerLoading, bestSellerEmpty } = TopBestSellerStatistic({
        pageNumber: 1,
        pageSize: 10,
        key: category?.name ?? '',
        filter: filter,
    });

    return (
        <Card
            sx={{
                boxShadow: 3,
                overflow: 'hidden',
                height: '100%',
            }}
        >
            <Stack direction="row" justifyContent="space-between" alignItems="center" px={2.5} pt={2}>
                <Typography fontWeight={700} fontSize={18} color={darkMode === 'light' ? "rgba(5, 0, 78, 1)" : "info"}>
                    Top hàng hóa bán chạy
                </Typography>

                <Autocomplete
                    size="small"
                    value={category}
                    inputValue={categorykeyword}
                    onChange={(_, newValue) => setCategory(newValue)}
                    onInputChange={(_, newInputValue) => setCategoryKeyword(newInputValue)}
                    options={categories}
                    getOptionLabel={(option) => option.name}
                    loading={categoriesLoading}
                    loadingText="Đang tải nhóm sản phẩm..."
                    noOptionsText="Không có nhóm sản phẩm"
                    sx={{
                        minWidth: 200,
                        bgcolor: '#f9fafb',
                        borderRadius: 1,
                        '& .MuiOutlinedInput-root': {
                            py: 0.5,
                            fontWeight: 500,
                        },
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Nhóm sản phẩm"
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <>
                                        {categoriesLoading ? <CircularProgress color="inherit" size={16} /> : null}
                                        {params.InputProps.endAdornment}
                                    </>
                                ),
                            }}
                        />
                    )}
                />
            </Stack>

            <Divider sx={{ mt: 1 }} />

            <Box pb={2.5} height="100%">
                <TableContainer
                    sx={{
                        width: '100%',
                        overflowX: 'auto',
                        scrollbarWidth: 'thin',
                        '&::-webkit-scrollbar': { height: 6 },
                        '&::-webkit-scrollbar-thumb': { backgroundColor: '#ccc', borderRadius: 3 },
                    }}
                >
                    <Table
                        sx={{
                            height: (bestSellerEmpty || bestSellerLoading) ? '100%' : 'auto',
                        }}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ width: 60, fontWeight: 600, color: 'text.secondary' }}>#</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Tên sản phẩm</TableCell>
                                <TableCell
                                    sx={{
                                        width: 200,
                                        fontWeight: 600,
                                        color: 'text.secondary',
                                        p: 0
                                    }}
                                >
                                    SL bán / Tồn kho
                                </TableCell>
                                <TableCell
                                    sx={{
                                        textAlign: 'right',
                                        fontWeight: 600,
                                        color: 'text.secondary',
                                    }}
                                >
                                    Giá trị bán
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {bestSellerLoading ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                                        <CircularProgress size={24} thickness={4} />
                                    </TableCell>
                                </TableRow>
                            ) : bestSellerEmpty ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                        <EmptyContent />
                                    </TableCell>
                                </TableRow>
                            ) : (
                                bestSeller?.map((item, index) => {
                                    const percent =
                                        item.stock > 0 ? Math.min((item.sold / item.stock) * 100, 100) : 0;
                                    const color = ['#3b82f6', '#10b981', '#a855f7', '#f59e0b', '#ef4444'][index % 5];

                                    return (
                                        <TableRow key={item.productID}>
                                            {/* STT */}
                                            <TableCell
                                                sx={{
                                                    width: { xs: 40, sm: 60 },
                                                    fontWeight: 600,
                                                    color: darkMode === 'light' ? 'rgba(5, 0, 78, 0.9)' : 'text.secondary',
                                                    px: { xs: 1, sm: 2 },
                                                }}
                                            >
                                                <Typography fontWeight={600}>{String(index + 1).padStart(2, '0')}</Typography>
                                            </TableCell>

                                            {/* Tên sản phẩm */}
                                            <TableCell
                                                sx={{
                                                    maxWidth: { xs: 140, sm: 200 },
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    wordBreak: 'break-word',
                                                    whiteSpace: 'normal',
                                                    lineHeight: 1.3,
                                                    px: { xs: 1, sm: 2 },
                                                }}
                                            >
                                                <Typography
                                                    fontWeight={500}
                                                    fontSize={{ xs: 13, sm: 14 }}
                                                    color={darkMode === 'light' ? "rgba(5, 0, 78, 0.9)" : 'info'}
                                                >
                                                    {item.name}
                                                </Typography>
                                            </TableCell>

                                            {/* SL bán / Tồn kho */}
                                            <TableCell
                                                sx={{
                                                    minWidth: 100,
                                                    px: { xs: 1, sm: 2 },
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1,
                                                    }}
                                                >
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={percent}
                                                        sx={{
                                                            flexGrow: 1,
                                                            height: 6,
                                                            borderRadius: 5,
                                                            backgroundColor: '#e5e7eb',
                                                            '& .MuiLinearProgress-bar': {
                                                                backgroundColor: color,
                                                            },
                                                        }}
                                                    />
                                                </Box>
                                            </TableCell>

                                            {/* Giá trị bán */}
                                            <TableCell
                                                align="right"
                                                sx={{
                                                    width: { xs: 100, sm: 140 },
                                                    px: { xs: 1, sm: 2 },
                                                    wordBreak: 'break-word',
                                                }}
                                            >
                                                <Typography
                                                    fontWeight={600}
                                                    fontSize={{ xs: 13, sm: 14 }}
                                                    color={color}
                                                >
                                                    {fCurrencyNoUnit(item.totalPurchaseAmounts)}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Card>
    );
}