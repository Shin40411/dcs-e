
import { IQuotationData, IQuotationItem } from "src/types/quotation";
import { useGetQuotation } from "src/actions/quotation";
import { useEffect, useRef, useState } from "react";
import { fCurrency, fCurrencyNoUnit, fRenderTextNumber } from "src/utils/format-number";
import { fDate, fDateTime } from "src/utils/format-time-vi";
import { Box, List, ListItem, ListItemText, Stack, Table, TableBody, TableCell, TableFooter, TableHead, TableRow, Typography } from "@mui/material";
import { Logo } from "src/components/logo";
import { capitalizeFirstLetter } from "src/utils/format-string";
import { PAPER_W, useScaleToFit } from "src/utils/scale-pdf";
import { CONFIG } from "src/global-config";
import { IDateValue } from "src/types/common";

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

    const scale = useScaleToFit(containerRef);

    const roundedTotal = Math.round(quotation.totalAmount);

    return (
        <Box ref={containerRef} sx={{
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
                    py: 5,
                    px: 15,
                    boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px'
                }}
            >
                <Box sx={{
                    p: 2,
                    bgcolor: 'common.white',
                    boxShadow: '0px 0px 0px 1px rgba(64,87,109,.04),0px 2px 4px -1px rgba(64,87,109,.3),inset 0 0 0 1px rgba(0,0,0,.1)'
                }}>
                    <Header />

                    <Dates createdDate={quotation.createdDate} quotationNo={quotation.quotationNo} />

                    <Introduction quotation={quotation} />

                    <Box paddingX={1}>
                        <Tables currentQuotation={currentQuotation} quotation={quotation} roundedTotal={roundedTotal} />
                    </Box>

                    <Stack direction="row" alignItems="center">
                        <Notes />
                        <Stack direction="column" gap={5} width="30%">
                            <Stack direction="column" justifyContent="center" alignItems="center">
                                <Typography fontSize={10} fontWeight='bold'>Người lập</Typography>
                                <Typography fontSize={10} fontWeight='bold'>CHỨC VỤ/ PHÒNG BAN</Typography>
                            </Stack>
                            <Typography textAlign="center" fontSize={10} fontWeight='bold'>{quotation.seller ?? 'Họ và tên'}</Typography>
                        </Stack>
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
};

function Header() {
    return (
        <Stack
            direction="row"
            justifyContent="center"
            gap={1}
            height="100%"
            mb={3}
            sx={{
                backgroundImage: `url(${CONFIG.assetsDir}/assets/illustrations/bgpdf.png)`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover'
            }}
        >
            <Logo disabled sx={{ width: '20%', height: '0%' }} />
            <Box>
                <List disablePadding>
                    <ListItem disableGutters sx={{ py: 0 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                            CÔNG TY TNHH GIẢI PHÁP DCS
                        </Typography>
                    </ListItem>
                    <ListItem disableGutters sx={{ py: 0 }}>
                        <Typography variant="body2" fontSize={12}>Số 1/50/5/16, Thanh Đa, Phường Bình Quới, TP.Hồ Chí Minh</Typography>
                    </ListItem>
                    <ListItem disableGutters sx={{ py: 0 }}>
                        <Stack direction="row" gap={1}>
                            <Typography variant="body2" fontSize={12}>
                                0932090207
                            </Typography>
                            <Typography variant="body2" fontSize={12}>
                                {`W.  http://dcse.vn   |   E.  lienhe@dcse.vn`}
                            </Typography>
                        </Stack>
                    </ListItem>
                </List>
            </Box>
        </Stack>

    );
}

function Dates({ createdDate, quotationNo }: { createdDate: IDateValue; quotationNo: string }) {
    return (
        <Stack width="100%" direction="row" justifyContent="flex-end">
            <Stack direction="column" alignItems="flex-end">
                <Typography variant="body2">
                    TP. HCM, {fDate(createdDate)}
                </Typography>
                <Typography variant="body2" fontWeight={700}>
                    Số: {quotationNo}
                </Typography>
            </Stack>
        </Stack>
    );
}

function Introduction({ quotation }: { quotation: IQuotationItem }) {
    const intro = quotation.companyName ? 'Kính gửi:' : 'Kính gửi ông/bà:';

    return (
        <>
            <Box display="flex" flexDirection="column">
                <Typography variant="h5" textTransform="uppercase" fontWeight={800} align="center" gutterBottom>
                    Bảng báo giá
                </Typography>
                <Box
                    sx={{
                        height: 1.5,
                        width: 60,
                        backgroundColor: 'rgba(0, 137, 0, 1)',
                        alignSelf: 'center',
                    }}
                />
            </Box>
            <Box paddingX={1} display="flex" flexDirection="column" gap={2}>
                <Typography variant="body2">
                    {intro} <b>{quotation.companyName || quotation.customerName}</b>
                </Typography>
                <Typography variant="body2" sx={{ textIndent: 20 }}>
                    {`Xin chân thành cảm ơn sự quan tâm của Quý khách. Chúng tôi xin gửi đến Quý khách bảng báo giá sản phẩm theo yêu cầu như sau:`}
                </Typography>
            </Box>

        </>
    );
}

function Tables({ currentQuotation, roundedTotal, quotation }:
    { currentQuotation?: IQuotationData; roundedTotal: number; quotation: IQuotationItem }) {

    const totalPrice = currentQuotation?.items?.reduce(
        (sum, q) => sum + q.products.reduce((acc, p) => acc + p.price * p.quantity, 0),
        0
    ) ?? 0;

    const totalVat = currentQuotation?.items?.reduce((sum, q) => {
        return (
            sum +
            q.products.reduce((subSum, p) => {
                const lineTotal = p.price * p.quantity;
                return subSum + (lineTotal * p.vat) / 100;
            }, 0)
        );
    }, 0) ?? 0;

    const discountAmount = (totalPrice: number, totalVat: number, discountPercent: number) =>
        Math.round((totalPrice + totalVat) * (discountPercent / 100));

    return (
        <Table size="small" sx={{ mt: 2, tableLayout: "fixed", width: "100%" }}>
            <TableHead>
                <TableRow sx={{
                    borderBottom: '2px solid rgba(0, 137, 0, 0.6)'
                }}>
                    <TableCell width={50} sx={{ backgroundColor: 'transparent' }}>#</TableCell>
                    <TableCell width={160} sx={{ backgroundColor: 'transparent' }}>Tên SP/DV</TableCell>
                    <TableCell width={50} sx={{ backgroundColor: 'transparent', textAlign: 'center' }}>ĐVT</TableCell>
                    <TableCell width={50} sx={{ backgroundColor: 'transparent', textAlign: 'center' }}>SL</TableCell>
                    <TableCell width={100} sx={{ backgroundColor: 'transparent' }}>Đơn giá</TableCell>
                    <TableCell width={100} sx={{ backgroundColor: 'transparent', whiteSpace: 'nowrap' }}>Thành tiền</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {currentQuotation?.items?.flatMap((q) =>
                    q.products.map((item, idx) => (
                        <TableRow key={idx}>
                            <TableCell sx={{ verticalAlign: 'top' }}>{idx + 1}</TableCell>
                            <TableCell
                                sx={{
                                    maxWidth: 120,
                                }}
                            >
                                <ListItemText
                                    sx={{
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                    primary={
                                        item.productName
                                    }
                                    slotProps={{
                                        primary: { color: 'text.secondary', fontWeight: 600 },
                                        secondary: { color: 'text.secondary', fontWeight: 400 }
                                    }}
                                    secondary={
                                        `${item.vat}%`
                                    }
                                />
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center', verticalAlign: 'top' }}>{item.unit}</TableCell>
                            <TableCell sx={{ textAlign: 'center', verticalAlign: 'top' }}>{item.quantity}</TableCell>
                            <TableCell
                                sx={{
                                    maxWidth: 120,
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    verticalAlign: 'top'
                                }}
                            >
                                {fCurrencyNoUnit(item.price)}
                            </TableCell>
                            <TableCell
                                sx={{
                                    maxWidth: 120,
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    verticalAlign: 'top'
                                }}
                            >
                                <ListItemText
                                    sx={{
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                    primary={fCurrencyNoUnit(item.quantity * item.price * (1 + item.vat / 100))}

                                    slotProps={{
                                        primary: { textAlign: 'right', color: 'text.secondary', fontWeight: 600 },
                                        secondary: { textAlign: 'right', color: 'text.secondary', fontWeight: 400 }
                                    }}
                                    secondary={fCurrencyNoUnit(((item.price * item.quantity) * item.vat) / 100)}
                                />
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
            <TableFooter sx={{ borderTop: '2px solid rgba(0, 137, 0, 0.6)' }}>
                <TableRow>
                    <TableCell sx={{ borderBottom: 'unset!important' }} colSpan={4} />
                    <TableCell sx={{ fontWeight: 600, whiteSpace: "nowrap", textAlign: "left" }}>
                        Tổng:
                    </TableCell>
                    <TableCell align="right">
                        {fCurrencyNoUnit(totalPrice)}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell sx={{ borderBottom: 'unset!important' }} colSpan={4} />
                    <TableCell sx={{ fontWeight: 600, whiteSpace: "nowrap", textAlign: "left" }}>
                        VAT:
                    </TableCell>
                    <TableCell align="right">
                        {fCurrencyNoUnit(totalVat)}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell sx={{ borderBottom: 'unset!important' }} colSpan={4} />
                    <TableCell sx={{ fontWeight: 600, whiteSpace: "nowrap", textAlign: "left", borderBottom: '2px solid rgba(0, 137, 0, 1)' }}>
                        Khuyến mãi:
                    </TableCell>
                    <TableCell align="right" sx={{ borderBottom: '2px solid rgba(0, 137, 0, 1)' }}>
                        {fCurrencyNoUnit(discountAmount(totalPrice, totalVat, quotation.discount))}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell sx={{ borderBottom: 'unset!important' }} colSpan={4} >
                        <AmountByText roundedTotal={roundedTotal} />
                    </TableCell>
                    <TableCell
                        sx={{
                            borderTop: "2px solid rgba(0, 137, 0, 0.6)",
                            fontWeight: "bold",
                            textAlign: "right",
                            textTransform: 'uppercase',
                            whiteSpace: "nowrap"
                        }}
                    >
                        Tổng cộng:
                    </TableCell>
                    <TableCell
                        sx={{
                            borderTop: "2px solid rgba(0, 137, 0, 0.6)",
                            fontWeight: "bold",
                            textAlign: "right",
                        }}
                    >
                        {fCurrencyNoUnit(roundedTotal)}
                    </TableCell>
                </TableRow>
            </TableFooter>
        </Table >
    );
}

function AmountByText({ roundedTotal }: { roundedTotal: number }) {
    return (
        <Typography variant="body2" display="block">
            <b>Bằng chữ:</b> <i>{capitalizeFirstLetter(fRenderTextNumber(roundedTotal))}</i>
        </Typography>
    );
}

function Notes() {
    return (
        <Stack direction="column" gap={1} mt={2} ml={4} width="70%">
            <Box width="100%">
                <Typography fontWeight="bold" variant="body2">Ghi chú:</Typography>
            </Box>
            <Box width="100%">
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
    );
}