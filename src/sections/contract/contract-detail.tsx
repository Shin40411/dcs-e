import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { IContract, IContractItem } from "src/types/contract";


type Props = {
    open: boolean;
    onClose: () => void;
    contract: IContract | null;
    items?: IContractItem[];
    onExportPdf?: (c: IContract, items?: IContractItem[]) => void;
};

const statusColorMap: Record<
    string,
    'default' | 'success' | 'error' | 'warning' | 'info' | 'primary' | 'secondary'
> = {
    'Hiệu lực': 'success',
    'Hết hạn': 'default',
    'Thanh lý': 'warning',
    'Hủy': 'error',
};

export function ContractDetail({
    open,
    onClose,
    contract,
    items,
    onExportPdf,
}: Props) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Chi tiết hợp đồng</DialogTitle>

            <DialogContent>
                {!contract ? (
                    <Typography color="text.secondary" sx={{ py: 2 }}>
                        Không tìm thấy dữ liệu hợp đồng.
                    </Typography>
                ) : (
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        {/* Header */}
                        <Stack
                            direction={{ xs: 'column', md: 'row' }}
                            alignItems="flex-start"
                            justifyContent="space-between"
                            gap={1}
                        >
                            <Box>
                                <Typography variant="h6">{contract.customer}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Mã HĐ: {contract.id}
                                </Typography>
                            </Box>
                            <Chip
                                label={contract.status}
                                color={statusColorMap[contract.status] ?? 'info'}
                            />
                        </Stack>

                        <Divider />

                        {/* Info blocks */}
                        <Stack direction={{ xs: 'column', md: 'row' }} gap={3}>
                            <Stack spacing={0.5} sx={{ minWidth: 200, flex: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Ngày ký
                                </Typography>
                                <Typography variant="body1">{contract.signedDate}</Typography>
                            </Stack>

                            <Stack spacing={0.5} sx={{ minWidth: 200, flex: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Ngày hết hạn
                                </Typography>
                                <Typography variant="body1">{contract.expireDate}</Typography>
                            </Stack>

                            <Stack spacing={0.5} sx={{ minWidth: 200, flex: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Giá trị hợp đồng
                                </Typography>
                                <Typography variant="body1" fontWeight={600}>
                                    {contract.total}
                                </Typography>
                            </Stack>
                        </Stack>

                        {/* Items (nếu có) */}
                        {items && items.length > 0 && (
                            <Box>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                    Hạng mục / Sản phẩm
                                </Typography>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>#</TableCell>
                                            <TableCell>Tên</TableCell>
                                            <TableCell>ĐVT</TableCell>
                                            <TableCell align="right">SL</TableCell>
                                            <TableCell align="right">Đơn giá</TableCell>
                                            <TableCell align="right">CK</TableCell>
                                            <TableCell align="right">Thành tiền</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {items.map((it, idx) => (
                                            <TableRow key={it.id ?? idx}>
                                                <TableCell>{idx + 1}</TableCell>
                                                <TableCell>{it.name}</TableCell>
                                                <TableCell>{it.unit ?? '-'}</TableCell>
                                                <TableCell align="right">{it.qty}</TableCell>
                                                <TableCell align="right">{it.price}</TableCell>
                                                <TableCell align="right">{it.discount ?? 0}</TableCell>
                                                <TableCell align="right">{it.amount}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        )}
                    </Stack>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Đóng</Button>
                {contract && (
                    <Button
                        variant="contained"
                        onClick={() => onExportPdf?.(contract, items)}
                    >
                        Xuất PDF
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}