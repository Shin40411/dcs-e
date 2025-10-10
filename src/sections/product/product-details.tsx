import { Box, Drawer, DrawerProps, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useGetProduct } from "src/actions/product";
import { Scrollbar } from "src/components/scrollbar";
import { ProductItem } from "src/types/product";
import parse from 'html-react-parser';
import { FallbackImage } from "src/utils/fallback-image";

type Props = DrawerProps & {
    selectedId: string;
    onClose: () => void;
};

export function ProductDetails({ selectedId, open, onClose, ...other }: Props) {
    const { product: currentProduct, productLoading } = useGetProduct(selectedId, {
        enabled: !!selectedId,
    });

    const [selectedProduct, setSelectProduct] = useState<ProductItem>();

    useEffect(() => {
        if (currentProduct) {
            setSelectProduct(currentProduct);
        }
    }, [currentProduct]);

    if (productLoading || !selectedProduct) {
        return (
            <Drawer
                open={open}
                onClose={onClose}
                anchor="right"
                slotProps={{
                    backdrop: { invisible: true },
                    paper: { sx: { width: 600 } },
                }}
                {...other}
            >
                <Box sx={{ p: 3 }}>
                    <Typography>Đang tải dữ liệu...</Typography>
                </Box>
            </Drawer>
        );
    }

    return (
        <Drawer
            open={open}
            onClose={onClose}
            anchor="right"
            slotProps={{
                backdrop: { invisible: true },
                paper: { sx: { width: 700 } },
            }}
            {...other}
        >
            <Scrollbar>
                <Stack spacing={3} sx={{ p: 3, bgcolor: 'background.neutral' }}>
                    <Typography variant="h6" gutterBottom>
                        Chi tiết sản phẩm
                    </Typography>
                </Stack>
                <Box sx={{ p: 3 }}>
                    <Stack direction="row">
                        <Stack spacing={3}>
                            {/* Tên + Mã */}
                            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                                <DetailItem label="Tên sản phẩm" value={selectedProduct.name} />
                                <DetailItem label="Mã sản phẩm" value={selectedProduct.code} />
                            </Stack>

                            {/* Nhóm + Đơn vị tính */}
                            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                                <DetailItem
                                    label="Nhóm sản phẩm"
                                    value={selectedProduct.categoryName}
                                />
                                <DetailItem
                                    label="Đơn vị tính"
                                    value={selectedProduct.unit}
                                />
                            </Stack>

                            {/* Giá nhập + Giá bán */}
                            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                                <DetailItem
                                    label="Giá nhập"
                                    value={`${selectedProduct.purchasePrice?.toLocaleString()} đ`}
                                />
                                <DetailItem
                                    label="Giá bán"
                                    value={`${selectedProduct.price?.toLocaleString()} đ`}
                                />
                            </Stack>

                            {/* VAT + Nhà sản xuất */}
                            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                                <DetailItem label="VAT áp dụng" value={`${selectedProduct.vat}%`} />
                                <DetailItem
                                    label="Nhà sản xuất"
                                    value={selectedProduct.manufacturer}
                                />
                            </Stack>

                            {/* Số lượng + Bảo hành */}
                            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                                <DetailItem label="Tồn kho" value={`${selectedProduct.stock} cái`} />
                                <DetailItem
                                    label="Bảo hành"
                                    value={`${selectedProduct.warranty} tháng`}
                                />
                            </Stack>

                            {/* Mô tả */}
                            <Box>
                                <Typography variant="subtitle2" gutterBottom>
                                    Mô tả sản phẩm
                                </Typography>
                                {
                                    selectedProduct.description ?
                                        parse(selectedProduct.description)
                                        :
                                        <Typography variant="body2" color="text.secondary">
                                            -
                                        </Typography>
                                }
                            </Box>

                        </Stack>
                        <Stack>
                            {/* Ảnh sản phẩm */}
                            <Box>
                                <Typography variant="subtitle2" gutterBottom>
                                    Ảnh sản phẩm
                                </Typography>
                                {selectedProduct.image ? (
                                    <FallbackImage
                                        src={selectedProduct.image}
                                        alt={selectedProduct.name}
                                    />
                                ) : (
                                    <Typography variant="body2" color="text.secondary">
                                        Không có ảnh
                                    </Typography>
                                )}
                            </Box>
                        </Stack>
                    </Stack>
                </Box>
            </Scrollbar>
        </Drawer >
    );
}

function DetailItem({ label, value }: { label: string; value?: string | number }) {
    return (
        <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
                {label}
            </Typography>
            <Typography variant="body2">{value || "—"}</Typography>
        </Box>
    );
}