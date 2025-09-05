import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { IQuotation } from "src/types/quotation";
import html2pdf from "html2pdf.js";

type Props = {
    selectedQuotation: IQuotation | null;
    openDetail: boolean;
    onClose: () => void;
}

export function QuotationDetails({ selectedQuotation, openDetail = false, onClose }: Props) {
    const handleExportPDF = () => {
        const element = document.getElementById("quotation-preview");
        if (element) {
            html2pdf()
                .from(element)
                .set({ margin: 10, filename: `${selectedQuotation?.id}.pdf`, html2canvas: { scale: 2 } })
                .save();
        }
    };

    return (
        <Dialog open={openDetail} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Chi tiết báo giá</DialogTitle>
            <DialogContent>
                {selectedQuotation && (
                    <Box id="quotation-preview" sx={{ p: 3, bgcolor: "white" }}>
                        {/* Header công ty */}
                        <Typography variant="h5" align="center" gutterBottom>
                            BÁO GIÁ
                        </Typography>
                        <Typography variant="body2">Mã báo giá: {selectedQuotation.id}</Typography>
                        <Typography variant="body2">Ngày: {selectedQuotation.date}</Typography>
                        <Typography variant="body2">Khách hàng: {selectedQuotation.customer}</Typography>
                        <Typography variant="body2">Nhân viên: {selectedQuotation.staff}</Typography>

                        {/* Bảng sản phẩm */}
                        <Table size="small" sx={{ mt: 2 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tên SP/DV</TableCell>
                                    <TableCell align="right">Số lượng</TableCell>
                                    <TableCell align="right">Đơn giá</TableCell>
                                    <TableCell align="right">Thành tiền</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {selectedQuotation.item?.map((item: any, index: number) => (
                                    <TableRow key={index}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell align="right">{item.qty}</TableCell>
                                        <TableCell align="right">{item.price.toLocaleString("vi-VN")} ₫</TableCell>
                                        <TableCell align="right">
                                            {(item.qty * item.price).toLocaleString("vi-VN")} ₫
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell colSpan={3}>
                                        <b>Tổng cộng</b>
                                    </TableCell>
                                    <TableCell align="right">
                                        {selectedQuotation.total.toLocaleString("vi-VN")} ₫
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                        {/* Footer / chữ ký */}
                        <Box sx={{ mt: 5, display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="body2" align="center">
                                Người lập báo giá
                                <br />
                                <br />
                                <i>(Ký, ghi rõ họ tên)</i>
                            </Typography>
                            <Typography variant="body2" align="center">
                                Khách hàng
                                <br />
                                <br />
                                <i>(Ký, ghi rõ họ tên)</i>
                            </Typography>
                        </Box>
                    </Box>
                )}
            </DialogContent>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }} />
            <DialogActions>
                <Button onClick={onClose}>Đóng</Button>
                <Button variant="contained" onClick={handleExportPDF}>
                    Xuất PDF
                </Button>
                <Button variant="outlined">Tạo hợp đồng</Button>
            </DialogActions>
        </Dialog>
    );
}