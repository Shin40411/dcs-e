import { Box, Drawer, DrawerProps, Stack, Typography } from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { ISuppliersItem } from "src/types/suppliers";

type Props = DrawerProps & {
    selectedSupplier?: ISuppliersItem;
    onClose: () => void;
};

export function SupplierDetails({ selectedSupplier, open, onClose, ...other }: Props) {
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
            <Scrollbar>
                <Stack spacing={3} sx={{ p: 3, bgcolor: 'background.neutral' }}>
                    <Typography variant="h6" gutterBottom>
                        Chi tiết nhà cung cấp
                    </Typography>
                </Stack>

                <Box sx={{ p: 3 }}>
                    <Stack spacing={3}>
                        {/* Họ tên + Số điện thoại */}
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                            <DetailItem label="Họ và tên" value={selectedSupplier?.name} />
                            <DetailItem label="Số điện thoại" value={selectedSupplier?.phone} />
                        </Stack>

                        {/* Mã số thuế + Công ty */}
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                            <DetailItem label="Mã số thuế" value={selectedSupplier?.taxCode} />
                            <DetailItem label="Tên công ty" value={selectedSupplier?.companyName} />
                        </Stack>

                        {/* Email + Tài khoản ngân hàng */}
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                            <DetailItem label="Email" value={selectedSupplier?.email} />
                            <DetailItem label="Tài khoản ngân hàng" value={selectedSupplier?.bankAccount} />
                        </Stack>

                        {/* Ngân hàng + Số dư */}
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                            <DetailItem label="Tên ngân hàng" value={selectedSupplier?.bankName} />
                            <DetailItem
                                label="Số dư tài khoản"
                                value={`${selectedSupplier?.balance?.toLocaleString()} đ`}
                            />
                        </Stack>

                        {/* Địa chỉ */}
                        <DetailItem label="Địa chỉ" value={selectedSupplier?.address} />
                    </Stack>
                </Box>
            </Scrollbar>
        </Drawer>
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