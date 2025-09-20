
import { IQuotationData, IQuotationItem } from "src/types/quotation";
import { useGetQuotation } from "src/actions/quotation";
import { useEffect, useRef, useState } from "react";
import { fCurrency, fRenderTextNumber } from "src/utils/format-number";
import { fDate, fDateTime } from "src/utils/format-time-vi";
import { Box, List, ListItem, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { PAPER_H, PAPER_W, useScaleToFit } from "./helper/Quasidropin";
import { Logo } from "src/components/logo";
import { capitalizeFirstLetter } from "src/utils/format-string";

export const QuotationPreview = ({ quotation }: { quotation: IQuotationItem }) => {
    const { quotation: SelectedQuotation } = useGetQuotation({
        quotationId: quotation?.id,
        pageNumber: 1,
        pageSize: 999,
        options: { enabled: !!quotation?.id }
    });

    const [currentQuotation, setSelectQuotation] = useState<IQuotationData>();
    useEffect(() => {
        if (SelectedQuotation) setSelectQuotation(SelectedQuotation);
    }, [SelectedQuotation]);

    const containerRef = useRef<HTMLDivElement>(null);
    // const [scale, setScale] = useState(1);

    // useEffect(() => {
    //     if (!containerRef.current) return;
    //     const el = containerRef.current;
    //     const ro = new ResizeObserver(([entry]) => {
    //         const { width, height } = entry.contentRect;
    //         const s = Math.min(width / PAPER_W, height / PAPER_H);
    //         setScale(s);
    //     });
    //     ro.observe(el);
    //     return () => ro.disconnect();
    // }, []);
    const scale = useScaleToFit(containerRef);

    const roundedTotal = Math.round(quotation.totalAmount);

    return (
        <Box ref={containerRef} sx={{
            cursor: 'default',
            userSelect: 'none',
            width: "100%",
            height: "100%",
            position: "relative",
            overflow: "hidden"
        }}>
            <Box
                sx={{
                    width: PAPER_W,
                    // height: PAPER_H,
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                    bgcolor: "rgba(64,87,109,.07)",
                    overflow: "hidden",
                    p: 5
                }}
            >
                <Box sx={{ p: 2, bgcolor: 'common.white' }}>
                    <Stack direction="row" justifyContent="space-between" height="100%" mb={3}>
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

                    {/* <Box sx={{ mt: 2 }}>
                        <Typography variant="body2">Khách hàng: {quotation.customerName}</Typography>
                        <Typography variant="body2">Ngày tạo: {fDateTime(quotation.createdDate)}</Typography>
                    </Box> */}

                    <Typography variant="h5" textTransform="uppercase" fontWeight={800} align="center" gutterBottom>
                        Bảng báo giá
                    </Typography>
                    <Typography variant="body2">
                        Kính gửi: <b>{quotation.customerName || 'Chưa có'}</b>
                    </Typography>
                    <Typography variant="body2">
                        Lời đầu tiên,
                        Công ty chúng tôi trân trọng cảm ơn quý khách hàng đã quan tâm đến sản phẩm của công ty chúng tôi.
                        Công ty chúng tôi xin gửi đến quý khách hàng báo giá chi tiết như sau:
                    </Typography>


                    <Table size="small" sx={{ mt: 2, tableLayout: "fixed", width: "100%" }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>STT</TableCell>
                                <TableCell>Tên SP/DV</TableCell>
                                <TableCell>Số lượng</TableCell>
                                <TableCell>Đơn vị tính</TableCell>
                                <TableCell>Đơn giá</TableCell>
                                <TableCell>Thành tiền</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentQuotation?.items?.flatMap((q) =>
                                q.products.map((item, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>{idx + 1}</TableCell>
                                        <TableCell
                                            sx={{
                                                maxWidth: 120,
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            }}
                                        >
                                            {item.productName}
                                        </TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell
                                            sx={{
                                                maxWidth: 120,
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            }}
                                        >
                                            {fCurrency(item.price)}
                                        </TableCell>
                                        <TableCell>{item.unit}</TableCell>
                                        <TableCell
                                            sx={{
                                                maxWidth: 120,
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            }}
                                        >
                                            {fCurrency(item.quantity * item.price * (1 + item.vat / 100))}
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
                            TP.HCM, ngày {fDate(quotation.createdDate)}
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
                    {/* <Box sx={{ mt: 2 }}>
                        <Typography variant="body2">Ghi chú: {quotation.note || "Không có"}</Typography>
                    </Box> */}
                </Box>
            </Box>
        </Box>
    );
};