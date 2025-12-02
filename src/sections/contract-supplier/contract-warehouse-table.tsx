import { Box, IconButton, Skeleton, Stack, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { fCurrency, fCurrencyNoUnit, fRenderTextNumber } from "src/utils/format-number";
import { capitalizeFirstLetter } from "src/utils/format-string";
import { ContractWareHouseTableProps } from "./helper/ContractItemsTableProps";
import { EmptyContent } from "src/components/empty-content";
import { IImportRemainingProduct } from "src/types/contractSupplier";
import { Iconify } from "src/components/iconify";

export function ContractWarehouseTable({
    remainingProductEmpty,
    remainingProduct,
    remainingProductLoading,
    onQuantityChange,
    onRemoveProduct
}: ContractWareHouseTableProps) {
    const calcAmount = (item: IImportRemainingProduct) => {
        const qty = Number(item?.quantity) || 0;
        const price = Number(item?.price) || 0;
        const vat = Number(item?.vat) || 0;
        return qty * price * (1 + vat / 100);
    };

    const total = (remainingProduct || []).reduce((acc, i) => acc + calcAmount(i), 0);

    const roundedTotal = Math.round(total);

    const handleQuantityChange = (productID: number, newQuantity: number) => {
        if (newQuantity < 1) return;
        onQuantityChange?.(productID, newQuantity);
    };

    return (
        <Box>
            <Typography variant="subtitle2">Sản phẩm</Typography>

            <Box sx={{ display: "flex", flexDirection: "column", minHeight: 0, height: '100%' }}>
                <Box sx={{ overflowY: "auto" }}>
                    <TableContainer
                        sx={{
                            // maxHeight: 400,
                            overflowY: "auto",
                            position: "relative",
                        }}
                    >
                        <Table size="small" stickyHeader sx={{ minWidth: 600, overflowY: "auto" }}>
                            <TableHead
                                sx={{
                                    position: "sticky",
                                    top: 0,
                                    zIndex: 2,
                                    '& .MuiTableCell-root': {
                                        backgroundColor: '#fff',
                                        borderBottomColor: '#000 !important',
                                        borderBottomStyle: 'solid',
                                    },
                                }}
                            >
                                <TableRow>
                                    <TableCell sx={{ whiteSpace: "nowrap", color: "#000 !important" }} width="50">#</TableCell>
                                    <TableCell sx={{ color: "#000 !important" }} width="250">Tên SP/DV</TableCell>
                                    <TableCell sx={{ whiteSpace: "nowrap", color: "#000 !important", textAlign: 'center' }} width="50">ĐVT</TableCell>
                                    <TableCell sx={{ whiteSpace: "nowrap", color: "#000 !important", textAlign: 'center' }} width="50">SL</TableCell>
                                    <TableCell width="100" sx={{ color: "#000 !important" }}>
                                        <Stack flexDirection="column" justifyContent="center" alignItems="center">
                                            <Box component="span">Đơn giá</Box>
                                            <Box component="span">(VNĐ)</Box>
                                        </Stack>
                                    </TableCell>
                                    <TableCell sx={{ whiteSpace: "nowrap", color: "#000 !important", textAlign: 'end' }} width="50">VAT</TableCell>
                                    <TableCell width="100" sx={{ color: "#000 !important" }}>
                                        <Stack flexDirection="column" justifyContent="center" alignItems="flex-end">
                                            <Box component="span">Thành tiền</Box>
                                            <Box component="span">(VNĐ)</Box>
                                        </Stack>
                                    </TableCell>
                                    <TableCell sx={{ whiteSpace: "nowrap", color: "#000 !important", textAlign: 'center' }} width="50">Xóa</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {remainingProductLoading ? (
                                    [...Array(5)].map((_, index) => (
                                        <TableRow key={index}>
                                            {[...Array(8)].map((__, cellIndex) => (
                                                <TableCell key={cellIndex}>
                                                    <Skeleton variant="rectangular" height={28} />
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : remainingProductEmpty ? (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center">
                                            <EmptyContent content="" />
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    (() => {
                                        let displayIndex = 0;
                                        return remainingProduct.map((item) => {
                                            const hasPrice = !!item.price && item.price > 0;
                                            if (hasPrice) displayIndex++;
                                            return (
                                                <TableRow key={item.productID}>
                                                    <TableCell sx={{ whiteSpace: "nowrap" }}>{hasPrice ? displayIndex : ""}</TableCell>
                                                    <TableCell>{item.productName}</TableCell>
                                                    <TableCell sx={{ whiteSpace: "nowrap", textAlign: "center" }}>{item.unit}</TableCell>
                                                    <TableCell sx={{ whiteSpace: "nowrap", textAlign: "center" }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleQuantityChange(item.productID, item.quantity - 1)}
                                                                disabled={item.quantity <= 0}
                                                                sx={{ p: 0.5 }}
                                                            >
                                                                <Iconify icon="mdi:minus" width={16} />
                                                            </IconButton>
                                                            <TextField
                                                                size="small"
                                                                type="number"
                                                                value={item.quantity}
                                                                onChange={(e) => handleQuantityChange(item.productID, Number(e.target.value))}
                                                                sx={{
                                                                    width: 60,
                                                                    '& input': {
                                                                        textAlign: 'center',
                                                                        padding: '4px 8px',
                                                                    }
                                                                }}
                                                                inputProps={{ min: 0 }}
                                                            />
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleQuantityChange(item.productID, item.quantity + 1)}
                                                                sx={{ p: 0.5 }}
                                                            >
                                                                <Iconify icon="mdi:plus" width={16} />
                                                            </IconButton>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell sx={{ whiteSpace: "nowrap", textAlign: "center" }}>
                                                        {hasPrice ? fCurrencyNoUnit(item.price) : ""}
                                                    </TableCell>
                                                    <TableCell sx={{ whiteSpace: "nowrap", textAlign: "end" }}>
                                                        <Typography variant="body2">{item.vat != null ? `${item.vat}%` : ""}</Typography>
                                                    </TableCell>
                                                    <TableCell sx={{ whiteSpace: "nowrap", textAlign: "end" }}>
                                                        {hasPrice ? fCurrencyNoUnit(calcAmount(item)) : ""}
                                                    </TableCell>
                                                    <TableCell sx={{ whiteSpace: "nowrap", textAlign: "center" }}>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => onRemoveProduct?.(item.productID)}
                                                            sx={{ p: 0.5 }}
                                                        >
                                                            <Iconify icon="material-symbols:scan-delete-outline-sharp" width={20} />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        });
                                    })()
                                )}
                            </TableBody>
                            <TableFooter
                                sx={{
                                    position: "sticky",
                                    bottom: 0,
                                    zIndex: 2,
                                    backgroundColor: "#fff",
                                    '& .MuiTableCell-root': {
                                        borderTop: '1px solid #000',
                                    },
                                }}
                            >
                                <TableRow>
                                    <TableCell colSpan={8}>
                                        <Box
                                            sx={{
                                                borderTop: "1px solid #000",
                                                p: 2,
                                                bgcolor: "background.paper",
                                                // zIndex: 1,
                                                display: 'flex',
                                                flexDirection: "row",
                                                gap: '50px',
                                                justifyContent: 'space-between'
                                            }}
                                        >
                                            <Stack direction="column" justifyContent="flex-start" textAlign={'start'}>
                                                <Typography fontWeight={600} sx={{ color: "#000" }}>Tổng cộng</Typography>
                                                <Typography fontWeight="bold" whiteSpace="nowrap" sx={{ color: "#000" }}>
                                                    {fCurrency(roundedTotal)}
                                                </Typography>
                                            </Stack>
                                            <Stack direction="column" justifyContent="flex-end" textAlign={'end'}>
                                                <Typography fontWeight={600} sx={{ color: "#000" }}>Bằng chữ</Typography>
                                                <Typography fontSize={15} sx={{ color: "#000" }}>
                                                    {capitalizeFirstLetter(fRenderTextNumber(roundedTotal))}
                                                </Typography>
                                            </Stack>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
        </Box>
    );
}