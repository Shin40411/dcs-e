import { useEffect, useMemo, useState } from 'react';
import {
    Page,
    Text,
    View,
    Font,
    Image,
    Document,
    PDFViewer,
    StyleSheet,
} from '@react-pdf/renderer';

import { IQuotationData, IQuotationItem } from 'src/types/quotation';
import { fCurrency, fCurrencyNoUnit, fRenderTextNumber } from 'src/utils/format-number';
import { fDate } from 'src/utils/format-time-vi';
import { capitalizeFirstLetter } from 'src/utils/format-string';
import { Box, CircularProgress, Typography } from '@mui/material';

// ----------------------------------------------------------------------

type QuotationPDFProps = {
    invoice: IQuotationItem;
    currentStatus: string;
    currentQuotation?: IQuotationData;
};
// ----------------------------------------------------------------------

export function QuotationPDFViewer({ invoice, currentStatus, currentQuotation }: QuotationPDFProps) {

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    const memoizedDoc = useMemo(() => (
        <QuotationPdfDocument
            invoice={invoice}
            currentStatus={currentStatus}
            currentQuotation={currentQuotation}
        />
    ), [invoice, currentStatus, currentQuotation]);

    return (
        <>
            {loading && (
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        zIndex: 10,
                    }}
                >
                    <CircularProgress sx={{ color: "#fff" }} />
                    <Typography variant="body1" sx={{ mt: 2, color: "#fff", fontWeight: "bold" }}>
                        Đang tạo bản xem trước...
                    </Typography>
                </Box>
            )}
            <PDFViewer width="100%" height="100%" style={{ border: "none" }}>
                {memoizedDoc}
            </PDFViewer>
        </>
    );
}

// ----------------------------------------------------------------------

Font.register({
    family: 'Montserrat-Semi',
    fonts: [{ src: '/fonts/Montserrat/static/Montserrat-Medium.ttf' }],
});

Font.register({
    family: 'Montserrat-bold',
    fonts: [{ src: '/fonts/Montserrat/static/Montserrat-Bold.ttf' }],
});

Font.register({
    family: 'Montserrat-italic',
    fonts: [{ src: '/fonts/Montserrat/static/Montserrat-MediumItalic.ttf' }],
});

Font.register({
    family: 'Montserrat',
    fonts: [
        {
            src: '/fonts/Montserrat/static/Montserrat-Light.ttf',
        },
    ],
});

const HEADER_HEIGHT = 80;
const FOOTER_HEIGHT = 80;

const useStyles = () =>
    useMemo(
        () =>
            StyleSheet.create({
                // layout
                page: {
                    fontSize: 9,
                    fontFamily: 'Montserrat-Semi',
                    backgroundColor: '#FFFFFF',
                    paddingTop: HEADER_HEIGHT,
                    paddingBottom: FOOTER_HEIGHT,
                    paddingHorizontal: 24,
                    flexDirection: 'column',
                },
                body: {
                    flex: 1,
                    paddingTop: 25,
                },
                signature: {
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                },
                header: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: HEADER_HEIGHT,
                    padding: 24,
                },
                footer: {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: FOOTER_HEIGHT,
                    padding: 24,
                },
                container: { flexDirection: 'row', justifyContent: 'space-between' },
                containerColumn: { flexDirection: 'column', justifyContent: 'center', gap: 10 },
                containerEvenly: { flexDirection: 'row', justifyContent: 'space-evenly' },
                containerEnd: { flexDirection: 'row', justifyContent: 'flex-end' },
                containerStart: { flexDirection: 'row', justifyContent: 'flex-start' },
                alignItemsCenter: { alignItems: "center" },
                alignItemsStart: { alignItems: "flex-start" },
                // margin
                mt80: { marginTop: 80 },
                mb4: { marginBottom: 4 },
                mb8: { marginBottom: 8 },
                mt4: { marginTop: 4 },
                mt8: { marginTop: 8 },
                mt20: { marginTop: 20 },
                mt40: { marginTop: 40 },
                mb40: { marginBottom: 40 },
                mb80: { marginBottom: 80 },
                mb100: { marginBottom: 100 },
                ml10: { marginLeft: 10 },
                // text
                h3: { fontSize: 16, fontWeight: 700, lineHeight: 1.2 },
                h4: { fontSize: 12, fontWeight: 700 },
                h5: { fontSize: 10, fontWeight: 700 },
                text1: { fontSize: 10 },
                text2: { fontSize: 9 },
                text4: { fontSize: 10 },
                textBoldHeader: { fontFamily: 'Montserrat-bold', fontSize: 12, fontWeight: 700 },
                text1Bold: { fontFamily: 'Montserrat-bold', fontSize: 10, fontWeight: 700 },
                text2Bold: { fontFamily: 'Montserrat-bold', fontSize: 9, fontWeight: 700 },
                text3Bold: { fontFamily: 'Montserrat-bold', fontSize: 10, fontWeight: 700 },
                text2Semi: { fontFamily: 'Montserrat-Semi', fontSize: 9, fontWeight: 700 },
                text3Semi: { fontFamily: 'Montserrat-Semi', fontSize: 10, fontWeight: 700 },
                text4Semi: { fontFamily: 'Montserrat-Semi', fontSize: 9, fontWeight: 500 },
                textItalic: { fontFamily: 'Montserrat-italic', fontSize: 10, fontWeight: 700 },
                textUnderline: { textDecoration: 'underline' },
                textMontserrat: {
                    fontFamily: 'Montserrat',
                    fontSize: 8,
                },
                // table
                table: { display: 'flex', width: '100%', padding: '0 40px' },
                row: {
                    padding: '10px 0 0 0',
                    flexDirection: 'row',
                    borderBottomWidth: 1,
                    borderStyle: 'solid',
                    borderColor: '#e9ecef',
                    alignItems: 'flex-start',
                    lineHeight: 1
                },
                rowHeader: {
                    padding: '10px 0',
                    flexDirection: 'row',
                    borderBottomWidth: 2,
                    borderStyle: 'solid',
                    borderColor: 'rgba(0, 137, 0, 1)',
                    alignItems: 'center',
                },
                rowFooter: {
                    padding: '10px 0',
                    flexDirection: 'row',
                    borderTopWidth: 2,
                    borderStyle: 'solid',
                    borderColor: 'rgba(0, 137, 0, 1)',
                    alignItems: 'center',
                },
                cell_1: { width: '5%' },
                cell_2: { width: '50%' },
                cell_3: { width: '15%' },
                cell_4: { width: '15%', paddingLeft: 0 },
                cell_5: { width: '15%' },
                noBorder: { paddingTop: '10px', paddingBottom: 0, borderBottomWidth: 0 },
            }),
        []
    );

type InvoicePdfDocumentProps = {
    invoice?: IQuotationItem;
    currentStatus: string;
    currentQuotation?: IQuotationData;
};

export function QuotationPdfDocument({ invoice, currentStatus, currentQuotation }: InvoicePdfDocumentProps) {
    const {
        customerName,
        address,
        companyName,
        createdDate,
        quotationNo,
        customerPhone,
        email,
        expiryDate,
        note,
        paid,
        discount,
        seller,
        status,
        totalAmount,
        department,
        employeeType
    } = invoice ?? {};

    const styles = useStyles();

    const roundedTotal = Math.round(totalAmount ?? 0);

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

    const renderHeader = () => (
        <View style={[styles.header, styles.containerStart, styles.alignItemsStart, styles.ml10, styles.mb8]} fixed>
            <Image
                source="/assets/illustrations/bgpdf.png"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: 1,
                }}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ width: '50%' }}>
                    <Image source="/logo/DCS9.png" style={{ width: 100, height: 60 }} />
                </View>

                <View style={{ width: '50%', alignItems: 'flex-start', gap: 5, flexDirection: 'column' }}>
                    <Text style={[styles.textBoldHeader]}>CÔNG TY TNHH GIẢI PHÁP DCS</Text>
                    <Text style={[styles.text2]}>Số 1/50/5/16, Thanh Đa, Phường Bình Quới, TP.Hồ Chí Minh</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
                        <Text style={[styles.text2]}>0932090207</Text>
                        {/* <Text style={[styles.text2, styles.textUnderline]}>lienhe@dcse.vn</Text> */}
                        <Text style={[styles.textMontserrat, styles.mb4]}>
                            {`W.  http://dcse.vn   |   E.  lienhe@dcse.vn`}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );

    const renderDates = () => (
        <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
            <View style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
                <Text style={[styles.text4]}>TP. HCM, {fDate(createdDate)}</Text>
                <Text style={[styles.text2, styles.text1Bold]}>Số: {quotationNo}</Text>
            </View>
        </View>
    );

    const renderTitle = () => (
        <View style={{ width: '100%', margin: '10px 0', textAlign: 'center' }}>
            <Text style={{ fontFamily: 'Montserrat-bold', fontSize: 18, fontWeight: 600, textTransform: 'uppercase' }}>Bảng báo giá</Text>
            <View
                style={{
                    height: 1,
                    width: 60,
                    backgroundColor: 'rgba(0, 137, 0, 1)',
                    marginTop: 8,
                    alignSelf: 'center',
                }}
            />
        </View>
    );

    const renderBillingInfo = () => {
        const intro = companyName ? 'Kính gửi:' : 'Kính gửi ông/bà:';
        return (
            <View style={[styles.containerColumn, styles.mb8, { padding: '0 40px' }]}>
                <Text style={[styles.text1Bold, styles.mb4]}>{intro}{'   '}{companyName ? companyName : customerName}</Text>
                <Text style={{ fontSize: 12, fontFamily: 'Montserrat' }}>
                    {'\u00A0\u00A0\u00A0\u00A0'}Xin chân thành cảm ơn sự quan tâm của Quý khách.
                    Chúng tôi xin gửi đến Quý khách bảng báo giá sản phẩm theo yêu cầu như sau:
                </Text>
            </View>
        );
    };

    const renderTable = () => (
        <View style={styles.table}>
            <View>
                <View style={styles.rowHeader}>
                    <View style={styles.cell_1}>
                        <Text style={[styles.text2Bold]}>#</Text>
                    </View>
                    <View style={styles.cell_2}>
                        <Text style={[styles.text2Bold]}>Tên SP/DV</Text>
                    </View>
                    <View style={[styles.cell_3, { textAlign: 'center' }]}>
                        <Text style={[styles.text2Bold]}>ĐVT</Text>
                    </View>
                    <View style={[styles.cell_4, { textAlign: 'center' }]}>
                        <Text style={[styles.text2Bold]}>SL</Text>
                    </View>
                    <View style={[styles.cell_4, { flexDirection: 'column', alignItems: 'center' }]}>
                        <Text style={[styles.text2Bold]}>Đơn giá</Text>
                        <Text style={[styles.text2Bold]}>{`(VNĐ)`}</Text>
                    </View>
                    <View style={[styles.cell_5, { textAlign: 'right', flexDirection: 'column', alignItems: 'center' }]}>
                        <Text style={[styles.text2Bold]}>Thành tiền</Text>
                        <Text style={[styles.text2Bold]}>{`(VNĐ)`}</Text>
                    </View>
                </View>
            </View>

            <View>
                {currentQuotation?.items?.flatMap((q) =>
                    q.products.map((p, index) => (
                        <View key={p.id} style={styles.row}>
                            <View style={styles.cell_1}>
                                <Text>{index + 1}</Text>
                            </View>
                            <View style={styles.cell_2}>
                                <Text style={[styles.text2Semi]}>{p.productName}</Text>
                                <Text style={[styles.textMontserrat]}>{p.vat}% VAT</Text>
                            </View>
                            <View style={[styles.cell_3, { textAlign: 'center' }]}>
                                <Text style={[styles.text2]}>{p.unit}</Text>
                            </View>
                            <View style={[styles.cell_3, { textAlign: 'center' }]}>
                                <Text style={[styles.text2]}>{p.quantity}</Text>
                            </View>
                            <View style={[styles.cell_4, { textAlign: 'center' }]}>
                                <Text style={[styles.text2]}>{fCurrencyNoUnit(p.price)}</Text>
                            </View>
                            <View style={[styles.cell_5, {
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-end',
                                textAlign: 'right'
                            }]}>
                                <Text style={[styles.text2]}>{fCurrencyNoUnit(p.price * p.quantity)}</Text>
                                <Text style={[styles.textMontserrat]}>{fCurrencyNoUnit(((p.price * p.quantity) * p.vat) / 100)}</Text>
                            </View>
                        </View>
                    ))
                )}

                {[
                    { name: 'Tổng:', value: fCurrencyNoUnit(totalPrice) },
                    { name: 'VAT:', value: fCurrencyNoUnit(totalVat), styles: styles.textMontserrat },
                    { name: 'Khuyến mãi:', value: (discount ? fCurrencyNoUnit(discountAmount(totalPrice, totalVat, discount)) : 0) },
                    { name: 'Tổng cộng:', value: fCurrencyNoUnit(totalAmount), styles: styles.h5, isTotal: true },
                ].map((item, index) => (
                    <View key={item.name}
                        style={[
                            styles.row,
                            styles.noBorder,
                            index === 0 ? styles.rowFooter : {}
                        ]}>
                        <View style={styles.cell_1} />
                        <View style={styles.cell_2} />
                        <View style={styles.cell_3} />

                        <View style={[styles.cell_4, { flexDirection: 'column' }]}>
                            {item.isTotal && (
                                <View
                                    style={{
                                        height: 1,
                                        backgroundColor: 'rgba(0, 137, 0, 1)',
                                        width: 100,
                                        alignSelf: 'flex-start',
                                        marginBottom: 2,
                                    }}
                                />
                            )}
                            <Text
                                style={[
                                    item.styles ?? styles.text2,
                                    item.isTotal ? {
                                        textTransform: item.styles ?
                                            'uppercase' : 'none', fontFamily: 'Montserrat-bold'
                                    } : {}
                                ]}
                            >
                                {item.name}
                            </Text>
                        </View>

                        <View style={[styles.cell_5, { flexDirection: 'column', textAlign: 'right' }]}>
                            {item.isTotal && (
                                <View
                                    style={{
                                        height: 1,
                                        backgroundColor: 'rgba(0, 137, 0, 1)',
                                        width: 50,
                                        alignSelf: 'flex-end',
                                        marginBottom: 2,
                                    }}
                                />
                            )}
                            <Text style={[item.styles ?? styles.text2]}>{item.value}</Text>
                        </View>
                    </View>
                ))}

            </View>
        </View>
    );

    const renderByTextTotal = () => (
        <View style={[styles.mt8, {
            width: '100%',
            flexDirection: 'row',
            padding: '0 60px',
            gap: 5
        }]}>
            <Text style={[styles.text3Bold]}>
                Bằng chữ:
            </Text>
            <Text style={[styles.textItalic]}>
                <Text style={{ textTransform: 'capitalize' }}>{capitalizeFirstLetter(fRenderTextNumber(roundedTotal))}</Text>
            </Text>
        </View>
    );

    const renderNotes = () => (
        <View
            style={[
                styles.mt20,
                {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingLeft: 40,
                    paddingRight: 40,
                },
            ]}
        >
            <View style={{ alignItems: 'flex-start', lineHeight: 1 }}>
                <Text style={styles.text1Bold}>Ghi chú</Text>
                <View style={{ flexDirection: 'column', justifyContent: 'flex-start', marginLeft: 20, marginRight: 20 }}>
                    {note ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={[styles.text4]}>
                                {note}
                            </Text>
                        </View>
                    ) : (
                        <>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={[styles.text4, { fontSize: 16, lineHeight: 2, marginRight: 6 }]}>
                                    {'\u2022'}
                                </Text>
                                <Text style={[styles.text4, { lineHeight: 1.5, width: 200 }]}>
                                    Giá trên đã bao gồm chi phí giao hàng tận nơi nội thành
                                </Text>
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={[styles.text4, { fontSize: 16, lineHeight: 2, marginRight: 6 }]}>
                                    {'\u2022'}
                                </Text>
                                <Text style={[styles.text4, { lineHeight: 2.3 }]}>
                                    Báo giá có giá trị trong vòng 30 ngày
                                </Text>
                            </View>

                        </>
                    )}
                </View>
            </View>

            <View style={{ alignItems: 'center', lineHeight: 1 }}>
                <Text style={styles.text1Bold}>Người lập</Text>
                {(employeeType && department) &&
                    <Text style={[styles.text1Bold, { textTransform: 'uppercase' }]}>{`${employeeType ?? ''}/ ${department ?? ''}`}</Text>
                }

                <View style={{ height: 60 }} />

                <Text style={styles.text1Bold}>{seller ?? `Họ và tên`}</Text>
            </View>
        </View>
    );

    const renderFooter = () => (
        {/*
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderWidth: 1,
                            borderColor: '#000',
                            borderStyle: 'solid',
                            borderRadius: 20,
                            paddingHorizontal: 6,
                            paddingVertical: 2,
                        }}
                    >
                        <Image
                            src={`${CONFIG.assetsDir}/assets/images/contact/phone.png`}
                            style={{ width: 12, height: 12, marginRight: 4 }}
                        />
                        <Text style={styles.text1}>0932 090 207</Text>
                    </View>
                    */}
    );

    return (
        <Document
            title={`Báo giá số ${quotationNo}`}
        >
            <Page size="A4" style={styles.page}>
                {renderHeader()}
                <View
                    style={styles.body}
                >
                    {renderDates()}
                    {renderTitle()}
                    {renderBillingInfo()}
                    {renderTable()}
                    {renderByTextTotal()}
                    {renderNotes()}
                </View>
                <View style={[styles.container, styles.footer]} fixed>
                    <Image
                        src="/assets/illustrations/bgpdf.png"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            opacity: 1,
                        }}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ width: '65%' }}>
                        </View>
                        <View style={{ flexDirection: 'column', width: '35%', alignItems: 'flex-end' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ width: 1, height: '100%', backgroundColor: '#ddd', marginRight: 4 }} />
                                <Text
                                    style={styles.textMontserrat}
                                    render={({ pageNumber, totalPages }) =>
                                        `Trang ${pageNumber}/${totalPages}`
                                    }
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
}
