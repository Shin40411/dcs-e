import { Box, Drawer, DrawerProps, Stack, Typography } from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { ICustomerItem } from "src/types/customer";

type Props = DrawerProps & {
    selectedCustomer?: ICustomerItem;
    onClose: () => void;
};

export function CustomerDetails({ selectedCustomer, open, onClose, ...other }: Props) {
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
                        Chi tiết khách hàng
                    </Typography>
                </Stack>

                <Box sx={{ p: 3 }}>
                    <Stack spacing={3}>
                        {/* Họ tên + Số điện thoại */}
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                            <DetailItem label="Họ và tên" value={selectedCustomer?.name} />
                            <DetailItem label="Số điện thoại" value={selectedCustomer?.phone} />
                        </Stack>

                        {/* Công ty + Mã số thuế */}
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                            <DetailItem label="Mã số thuế" value={selectedCustomer?.taxCode} />
                            <DetailItem label="Tên công ty" value={selectedCustomer?.companyName} />
                        </Stack>

                        {/* Email */}
                        <DetailItem label="Email" value={selectedCustomer?.email} />

                        {/* Ngân hàng */}
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                            <DetailItem label="Số tài khoản ngân hàng" value={selectedCustomer?.bankAccount} />
                            <DetailItem label="Tên ngân hàng" value={selectedCustomer?.bankName} />
                        </Stack>

                        {/* Địa chỉ */}
                        <DetailItem label="Địa chỉ" value={selectedCustomer?.address} />

                        {/* Là đối tác + Điểm thưởng + Số dư */}
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                            <DetailItem label="Là đối tác" value={selectedCustomer?.isPartner ? 'Có' : 'Không'} />
                            <DetailItem label="Điểm thưởng" value={selectedCustomer?.rewardPoint?.toLocaleString()} />
                            <DetailItem label="Số dư" value={`${selectedCustomer?.balance?.toLocaleString()} đ`} />
                        </Stack>
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