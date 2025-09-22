import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, Skeleton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import { IQuotationData, IQuotationItem } from "src/types/quotation";
import html2pdf from "html2pdf.js";
import { useGetQuotation } from "src/actions/quotation";
import { useEffect, useState } from "react";
import { fCurrency, fRenderTextNumber } from "src/utils/format-number";
import { fDate } from "src/utils/format-time-vi";
import { Logo } from "src/components/logo";
import { capitalizeFirstLetter } from "src/utils/format-string";

type Props = {
    selectedQuotation: IQuotationItem;
    openDetail: boolean;
    onClose: () => void;
}

export function QuotationDetails({ selectedQuotation, openDetail = false, onClose }: Props) {
    const { quotation, quotationLoading, quotationError } = useGetQuotation({
        quotationId: selectedQuotation?.id,
        pageNumber: 1,
        pageSize: 999,
        options: { enabled: !!selectedQuotation?.id }
    });

    const [currentQuotation, setSelectQuotation] = useState<IQuotationData>();

    useEffect(() => {
        if (quotation) {
            setSelectQuotation(quotation);
        }
    }, [quotation]);

    const handleExportPDF = () => {
        const element = document.getElementById("quotation-preview");
        if (element) {
            html2pdf()
                .from(element)
                .set({ margin: 10, filename: `${selectedQuotation?.quotationNo}.pdf`, html2canvas: { scale: 2 } })
                .save();
        }
    };

    const roundedTotal = Math.round(selectedQuotation.totalAmount);

    if (quotationLoading || !currentQuotation) {
        return (
            <Dialog open={openDetail} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle>Chi tiết báo giá</DialogTitle>
                <DialogContent sx={{ pb: '5%' }}>
                    <Skeleton variant="text" width={200} />
                    <Skeleton variant="rectangular" height={200} sx={{ mt: 2 }} />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={openDetail} onClose={onClose} maxWidth="xl" fullWidth>
            <DialogTitle fontSize={13} fontWeight={700}>
                Số: {selectedQuotation.quotationNo}
            </DialogTitle>
            <DialogContent>
                {selectedQuotation && (
                    <Box id="quotation-preview" sx={{ p: 3, bgcolor: "white" }}>
                        <Stack direction="row" justifyContent="space-between" height="100%">
                            <Logo disabled sx={{ width: '10%', height: '0%' }} />
                            <Box>
                                <List disablePadding>
                                    <ListItem disableGutters sx={{ py: 0 }}>
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            CÔNG TY TNHH GIẢI PHÁP DCS
                                        </Typography>
                                    </ListItem>
                                    <ListItem disableGutters sx={{ py: 0 }}>
                                        <Typography variant="body2">MST: 0318436084</Typography>
                                    </ListItem>
                                    <ListItem disableGutters sx={{ py: 0 }}>
                                        <Typography variant="body2">
                                            ĐC: Số 1/50/5/16, Thanh Đa, Phường Bình Quới, TP.Hồ Chí Minh
                                        </Typography>
                                    </ListItem>
                                    <ListItem disableGutters sx={{ py: 0 }}>
                                        <Typography variant="body2">ĐT: 0932090207</Typography>
                                    </ListItem>
                                    <ListItem disableGutters sx={{ py: 0 }}>
                                        <Typography variant="body2">
                                            Email: ncnnghia@gmail.com &nbsp;|&nbsp; dcsketoan@gmail.com
                                        </Typography>
                                    </ListItem>
                                </List>
                            </Box>
                        </Stack>
                        <Typography variant="h5" textTransform="uppercase" fontWeight={800} align="center" gutterBottom>
                            Bảng báo giá
                        </Typography>
                        <Typography variant="body2">
                            Kính gửi: <b>{selectedQuotation.customerName || 'Chưa có'}</b>
                        </Typography>
                        <Typography variant="body2">
                            Lời đầu tiên,
                            Công ty chúng tôi trân trọng cảm ơn quý khách hàng đã quan tâm đến sản phẩm của công ty chúng tôi.
                            Công ty chúng tôi xin gửi đến quý khách hàng báo giá chi tiết như sau:
                        </Typography>

                        <Table size="small" sx={{ mt: 2 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>STT</TableCell>
                                    <TableCell>Tên SP/DV</TableCell>
                                    <TableCell align="right">Đơn vị tính</TableCell>
                                    <TableCell align="right">Số lượng</TableCell>
                                    <TableCell align="right">Đơn giá</TableCell>
                                    <TableCell align="right">Thành tiền</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentQuotation?.items?.flatMap((quotation) =>
                                    quotation.products.map((p, index) => (
                                        <TableRow key={`${quotation.quotationID}-${p.id}-${index}`}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{p.productName}</TableCell>
                                            <TableCell align="right">{p.unit}</TableCell>
                                            <TableCell align="right">{p.quantity}</TableCell>
                                            <TableCell align="right">
                                                {fCurrency(p.price)}
                                            </TableCell>
                                            <TableCell align="right">
                                                {fCurrency((p.quantity * p.price * (1 + p.vat / 100)))}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                                <TableRow>
                                    <TableCell colSpan={5}>
                                        <Typography variant="body2" display="block">
                                            Bằng chữ: <b>{capitalizeFirstLetter(fRenderTextNumber(roundedTotal))}</b>
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <b>Tổng cộng: </b>
                                        {fCurrency(roundedTotal)}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <Stack direction="row" justifyContent="space-between">
                            <Stack direction="row" gap={1}>
                                <Box>
                                    <Typography variant="body2">Ghi chú:</Typography>
                                </Box>
                                <Box>
                                    <List disablePadding>
                                        <ListItem disableGutters sx={{ py: 0 }}>
                                            <Typography variant="body2" fontWeight={0}>
                                                - Giá trên đã bao gồm chi phí giao hàng tận nơi nội thành
                                            </Typography>
                                        </ListItem>
                                        <ListItem disableGutters sx={{ py: 0 }}>
                                            <Typography variant="body2" fontWeight={0}>
                                                - Báo cáo có giá trị trong vòng 30 ngày
                                            </Typography>
                                        </ListItem>
                                    </List>
                                </Box>
                            </Stack>
                            <Typography variant="body2" alignSelf="flex-end">
                                TP.HCM, ngày {fDate(selectedQuotation.createdDate)}
                            </Typography>
                        </Stack>
                        <Box sx={{ mt: 1, display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="body2" align="center">
                                Khách hàng
                                <br />
                                <br />
                                <br />
                                <br />
                                <i>(Ký, ghi rõ họ tên)</i>
                            </Typography>
                            <Typography variant="body2" align="center">
                                Người lập
                                <br />
                                <br />
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
                <Tooltip title="Chức năng đang phát triển">
                    <span style={{ marginLeft: 10 }}>
                        <Button variant="outlined" disabled>
                            Tạo hợp đồng
                        </Button>
                    </span>
                </Tooltip>

            </DialogActions>
        </Dialog>
    );
}