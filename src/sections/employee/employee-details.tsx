import { Box, Drawer, DrawerProps, Stack, Typography } from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { IEmployeeItem } from "src/types/employee";

type Props = DrawerProps & {
    selectedEmployee?: IEmployeeItem;
    onClose: () => void;
};

export function EmployeeDetails({ selectedEmployee, open, onClose, ...other }: Props) {
    return (
        <Drawer
            open={open}
            onClose={onClose}
            anchor="right"
            slotProps={{
                backdrop: { invisible: true },
                paper: { sx: { width: 800 } },
            }}
            {...other}
        >
            <Scrollbar>
                <Stack spacing={3} sx={{ p: 3, bgcolor: 'background.neutral' }}>
                    <Typography variant="h6" gutterBottom>
                        Chi tiết nhân viên
                    </Typography>
                </Stack>

                <Box sx={{ p: 3 }}>
                    <Stack spacing={3} direction={{ xs: 'column', md: 'row' }}>
                        {/* Bên trái: thông tin */}
                        <Stack spacing={2} sx={{ flex: 1 }}>
                            {/* Họ tên + Số điện thoại */}
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                                <DetailItem label="Họ và tên" value={selectedEmployee?.name} />
                                <DetailItem label="Số điện thoại" value={selectedEmployee?.phone} />
                            </Stack>

                            {/* Email + Giới tính */}
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                                <DetailItem label="Email" value={selectedEmployee?.email} />
                                <DetailItem
                                    label="Giới tính"
                                    value={
                                        selectedEmployee?.gender === 'Male'
                                            ? 'Nam'
                                            : selectedEmployee?.gender === 'Female'
                                                ? 'Nữ'
                                                : 'Khác'
                                    }
                                />
                            </Stack>

                            {/* Phòng ban + Chức vụ */}
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                                <DetailItem label="Phòng ban" value={selectedEmployee?.department} />
                                <DetailItem label="Chức vụ" value={selectedEmployee?.employeeType} />
                            </Stack>

                            {/* Tài khoản ngân hàng + Ngày sinh */}
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                                <DetailItem label="Số tài khoản ngân hàng" value={selectedEmployee?.bankAccount} />
                                <DetailItem
                                    label="Ngày sinh"
                                    value={selectedEmployee?.birthday
                                        ? new Date(selectedEmployee?.birthday).toLocaleDateString('vi-VN')
                                        : '-'}
                                />
                            </Stack>

                            {/* Ngân hàng + Số dư */}
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                                <DetailItem label="Tên ngân hàng" value={selectedEmployee?.bankName} />
                                <DetailItem
                                    label="Số dư"
                                    value={`${selectedEmployee?.balance?.toLocaleString()} đ`}
                                />
                            </Stack>

                            {/* Địa chỉ */}
                            <DetailItem label="Địa chỉ" value={selectedEmployee?.address} />
                        </Stack>

                        {/* Bên phải: ảnh */}
                        <Stack spacing={2} sx={{ flex: 1 }}>
                            <Typography variant="subtitle2">Ảnh nhân viên</Typography>
                            {selectedEmployee?.image ? (
                                <Box
                                    component="img"
                                    src={selectedEmployee?.image}
                                    alt={selectedEmployee?.name}
                                    sx={{
                                        width: '100%',
                                        maxHeight: 300,
                                        objectFit: 'cover',
                                        borderRadius: 2,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                    }}
                                />
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    Không có ảnh
                                </Typography>
                            )}
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