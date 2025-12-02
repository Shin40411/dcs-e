import { Drawer, Box, Typography, Divider, Stack, DrawerProps } from "@mui/material";
import { useGetCallVietQrData } from "src/actions/bankAccount";
import { Iconify } from "src/components/iconify";
import { Image } from "src/components/image";
import { Scrollbar } from "src/components/scrollbar";
import { TransferData } from "src/types/internal";
import { fCurrency } from "src/utils/format-number";
import { fDate } from "src/utils/format-time-vi";

type TransferDetailProps = DrawerProps & {
    open: boolean;
    onClose: () => void;
    data: TransferData | null;
};

export function TransferDetail({ open, onClose, data, ...other }: TransferDetailProps) {
    if (!data) return null;
    const { vietQrItem: bankSenderImage } = useGetCallVietQrData({
        pageNumber: 1,
        pageSize: 999,
        key: data.sendedBank,
        enabled: (data && open) ? true : false
    });

    const { vietQrItem: bankReceiveImage } = useGetCallVietQrData({
        pageNumber: 1,
        pageSize: 999,
        key: data.receivedBank,
        enabled: (data && open) ? true : false
    });
    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            sx={{ '& .MuiDrawer-paper': { background: '#f9fafb' } }}
            slotProps={{
                backdrop: { invisible: true },
                paper: { sx: { width: 600 } },
            }}
            {...other}
        >
            <Scrollbar>
                <Stack spacing={3} sx={{ p: 3, bgcolor: 'background.neutral' }}>
                    <Typography variant="h6">Chi tiết giao dịch</Typography>
                </Stack>

                <Box sx={{ p: 2 }}>
                    <Box
                        display="flex"
                        flexDirection="row"
                        gap={1}
                        sx={{
                            py: 1,
                            px: 3,
                            borderBottom: '1px solid #e5e7eb',
                            backgroundColor: (theme) => theme.palette.primary.main,
                        }}
                    >
                        <Iconify icon="grommet-icons:transaction" color="#fff" />
                        <Typography variant="body2" sx={{ color: "common.white" }}>
                            Mã giao dịch: <strong>{data.transferNo}</strong>
                        </Typography>
                    </Box>
                    <Stack spacing={2}>
                        <Box sx={{
                            background: 'white', p: 2,
                            boxShadow: 1
                        }}>
                            <Typography variant="subtitle2" color="primary" fontWeight={700}>
                                Tài khoản gửi
                            </Typography>
                            <Typography fontWeight={600}>{data.sendedBankName}</Typography>
                            <Box display="flex" flexDirection="row" gap={1} alignItems="center">
                                {bankSenderImage.length > 0 && (
                                    <Box width={50} height="100%">
                                        <Image
                                            src={bankSenderImage[0].logo}
                                            alt={data.sendedBank}
                                        />
                                    </Box>
                                )}
                                <Typography variant="body2" color="text.secondary">
                                    {data.sendedBank} - {data.sendedBankNo}
                                </Typography>
                            </Box>
                        </Box>


                        <Box sx={{ background: 'white', p: 2, boxShadow: 1 }}>
                            <Typography variant="subtitle2" color="primary" fontWeight={700}>
                                Tài khoản nhận
                            </Typography>
                            <Typography fontWeight={600}>{data.receivedBankName}</Typography>
                            <Box display="flex" flexDirection="row" gap={1} alignItems="center">
                                {bankReceiveImage.length > 0 && (
                                    <Box width={50} height="100%">
                                        <Image
                                            src={bankReceiveImage[0].logo}
                                            alt={data.receivedBank}
                                        />
                                    </Box>
                                )}
                                <Typography variant="body2" color="text.secondary">
                                    {data.receivedBank} - {data.receivedBankNo}
                                </Typography>
                            </Box>
                        </Box>


                        <Box sx={{ background: 'white', p: 2, boxShadow: 1 }}>
                            <Typography variant="subtitle2" color="primary" fontWeight={700}>
                                Thông tin giao dịch
                            </Typography>
                            <Stack spacing={1.2} mt={1}>
                                <Row label="Số tiền" value={fCurrency(data.cost)} />
                                <Row label="Phí" value={fCurrency(data.charge)} />
                                <Row label="Ghi chú" value={data.note || '(Không có)'} />
                            </Stack>
                        </Box>


                        <Box sx={{ background: 'white', p: 2, boxShadow: 1 }}>
                            <Typography variant="subtitle2" color="primary" fontWeight={700}>
                                Khác
                            </Typography>
                            <Stack spacing={1.2} mt={1}>
                                <Row label="Ngày giao dịch" value={fDate(data.createdDate)} />
                                <Row label="Người tạo" value={data.createBy} />
                            </Stack>
                        </Box>
                    </Stack>
                </Box>
            </Scrollbar>
        </Drawer>
    );
}

function Row({ label, value }: { label: string; value: string | number }) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">{label}</Typography>
            <Typography fontWeight={600}>{value}</Typography>
        </Box>
    );
}