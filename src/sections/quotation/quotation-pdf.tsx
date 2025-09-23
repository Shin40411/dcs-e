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
    PDFDownloadLink,
} from '@react-pdf/renderer';

import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';


import { Iconify } from 'src/components/iconify';
import { IQuotationData, IQuotationItem } from 'src/types/quotation';
import { Logo } from 'src/components/logo';
import { fCurrency, fRenderTextNumber } from 'src/utils/format-number';
import { fDate } from 'src/utils/format-time-vi';
import { sign } from 'crypto';
import { capitalizeFirstLetter } from 'src/utils/format-string';

// ----------------------------------------------------------------------

type QuotationPDFProps = {
    invoice: IQuotationItem;
    currentStatus: string;
    currentQuotation?: IQuotationData;
};

export function QuotationPDFDownload({ invoice, currentStatus }: QuotationPDFProps) {
    const renderButton = (loading: boolean) => (
        <Tooltip title="Tải xuống">
            <IconButton>
                {loading ? (
                    <CircularProgress size={24} color="inherit" />
                ) : (
                    <Iconify icon="eva:cloud-download-fill" />
                )}
            </IconButton>
        </Tooltip>
    );

    return (
        <PDFDownloadLink
            document={<QuotationPdfDocument invoice={invoice} currentStatus={currentStatus} />}
            fileName={invoice?.quotationNo}
            style={{ textDecoration: 'none' }}
        >
            {({ loading }) => renderButton(loading)}
        </PDFDownloadLink>
    );
}

// ----------------------------------------------------------------------

export function QuotationPDFViewer({ invoice, currentStatus, currentQuotation }: QuotationPDFProps) {
    return (
        <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
            <QuotationPdfDocument invoice={invoice} currentStatus={currentStatus} currentQuotation={currentQuotation} />
        </PDFViewer>
    );
}

// ----------------------------------------------------------------------

Font.register({
    family: 'Roboto',
    fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
});

const useStyles = () =>
    useMemo(
        () =>
            StyleSheet.create({
                // layout
                page: {
                    fontSize: 9,
                    lineHeight: 1.6,
                    fontFamily: 'Roboto',
                    backgroundColor: '#FFFFFF',
                    padding: '40px 24px 120px 24px',
                },
                signature: {
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                },
                footer: {
                    left: 0,
                    right: 0,
                    bottom: 0,
                    padding: 24,
                    margin: 'auto',
                    borderTopWidth: 1,
                    borderStyle: 'solid',
                    position: 'absolute',
                    borderColor: '#e9ecef',
                },
                container: { flexDirection: 'row', justifyContent: 'space-between' },
                // margin
                mt80: { marginTop: 80 },
                mb4: { marginBottom: 4 },
                mb8: { marginBottom: 8 },
                mt40: { marginTop: 40 },
                mb40: { marginBottom: 40 },
                mb80: { marginBottom: 80 },
                mb100: { marginBottom: 100 },
                // text
                h3: { fontSize: 16, fontWeight: 700, lineHeight: 1.2 },
                h4: { fontSize: 12, fontWeight: 700 },
                text1: { fontSize: 10 },
                text2: { fontSize: 9 },
                text1Bold: { fontSize: 10, fontWeight: 700 },
                text2Bold: { fontSize: 9, fontWeight: 700 },
                // table
                table: { display: 'flex', width: '100%' },
                row: {
                    padding: '10px 0 8px 0',
                    flexDirection: 'row',
                    borderBottomWidth: 1,
                    borderStyle: 'solid',
                    borderColor: '#e9ecef',
                },
                cell_1: { width: '5%' },
                cell_2: { width: '50%' },
                cell_3: { width: '15%' },
                cell_4: { width: '15%', paddingLeft: 8 },
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

function QuotationPdfDocument({ invoice, currentStatus, currentQuotation }: InvoicePdfDocumentProps) {
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
    } = invoice ?? {};

    const styles = useStyles();

    const roundedTotal = Math.round(totalAmount ?? 0);

    const totalQuantity = currentQuotation?.items?.reduce(
        (sum, q) => sum + q.products.reduce((acc, p) => acc + p.quantity, 0),
        0
    ) ?? 0;

    const renderHeader = () => (
        <View style={[styles.container, styles.mb40]}>
            <Image source="/logo/DCS9.png" style={{ width: 100, height: 60 }} />

            <View style={{ alignItems: 'flex-end', flexDirection: 'column' }}>
                <Text style={[styles.h3, styles.mb8, { textTransform: 'capitalize' }]}>
                    {currentStatus}
                </Text>
                <Text style={[styles.text2]}>{quotationNo}</Text>
            </View>
        </View>
    );

    const renderFooter = () => (
        <View style={[styles.container, styles.footer]} fixed>
            <View style={{ width: '65%' }}>
                <Text style={[styles.text2Bold, styles.mb4]}>Ghi chú</Text>
                <Text style={[styles.text2]}>
                    {note || 'Giá trên đã bao gồm chi phí giao hàng tận nơi nội thành'}
                </Text>
            </View>
            <View style={{ width: '35%', textAlign: 'right' }}>
                <Text style={[styles.text2Bold, styles.mb4]}>TP.HCM, ngày {fDate(createdDate)}</Text>
                <Text style={[styles.text2]}>ncnnghia@gmail.com &nbsp;|&nbsp; dcsketoan@gmail.com</Text>
            </View>
        </View>
    );

    const renderBillingInfo = () => (
        <View style={[styles.container, styles.mb40]}>
            <View style={{ width: '50%' }}>
                <Text style={[styles.text1Bold, styles.mb4]}>Kính gửi</Text>
                <Text style={[styles.text2]}>Khách hàng: {customerName}</Text>
                {companyName && <Text style={[styles.text2]}>Tên công ty: {companyName}</Text>}
                {address && <Text style={[styles.text2]}>ĐC: {address}</Text>}
                {customerPhone && <Text style={[styles.text2]}>ĐT: {customerPhone}</Text>}
                {email && <Text style={[styles.text2]}>Email: {email}</Text>}
            </View>

            <View style={{ width: '50%' }}>
                <Text style={[styles.text1Bold, styles.mb4]}>CÔNG TY TNHH GIẢI PHÁP DCS</Text>
                <Text style={[styles.text2]}>MST: 0318436084</Text>
                <Text style={[styles.text2]}>ĐC: Số 1/50/5/16, Thanh Đa, Phường Bình Quới, TP.Hồ Chí Minh</Text>
                <Text style={[styles.text2]}>ĐT: 0932090207</Text>
                <Text style={[styles.text2]}>Email: ncnnghia@gmail.com &nbsp;|&nbsp; dcsketoan@gmail.com</Text>
            </View>
        </View>
    );

    const renderDates = () => (
        <View style={[styles.mt80, styles.signature]}>
            <View style={{ width: '50%', marginLeft: 50 }}>
                <Text style={[styles.text1Bold, styles.mb80]}> Khách hàng</Text>
                <Text style={[styles.text2]}>(Ký, ghi rõ họ tên)</Text>
            </View>
            <View style={{ width: '50%', marginLeft: 270 }}>
                <Text style={[styles.text1Bold, styles.mb80]}>Người lập</Text>
                <Text style={[styles.text2]}>(Ký, ghi rõ họ tên)</Text>
            </View>
        </View>
    );

    const renderTable = () => (
        <>
            <Text style={[styles.text1Bold]}>Chi tiết báo giá</Text>

            <View style={styles.table}>
                <View>
                    <View style={styles.row}>
                        <View style={styles.cell_1}>
                            <Text style={[styles.text2Bold]}>#</Text>
                        </View>
                        <View style={styles.cell_2}>
                            <Text style={[styles.text2Bold]}>Tên SP/DV</Text>
                        </View>
                        <View style={styles.cell_3}>
                            <Text style={[styles.text2Bold]}>Đơn vị tính</Text>
                        </View>
                        <View style={styles.cell_4}>
                            <Text style={[styles.text2Bold]}>Số lượng</Text>
                        </View>
                        <View style={styles.cell_4}>
                            <Text style={[styles.text2Bold]}>Đơn giá</Text>
                        </View>
                        <View style={[styles.cell_5, { textAlign: 'right' }]}>
                            <Text style={[styles.text2Bold]}>Thành tiền</Text>
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
                                    <Text style={[styles.text2Bold]}>{p.productName}</Text>
                                    <Text style={[styles.text2]}>{p.vat}% VAT</Text>
                                </View>
                                <View style={styles.cell_3}>
                                    <Text style={[styles.text2]}>{p.unit}</Text>
                                </View>
                                <View style={styles.cell_3}>
                                    <Text style={[styles.text2]}>{p.quantity}</Text>
                                </View>
                                <View style={styles.cell_4}>
                                    <Text style={[styles.text2]}>{fCurrency(p.price)}</Text>
                                </View>
                                <View style={[styles.cell_5, { textAlign: 'right' }]}>
                                    <Text style={[styles.text2]}>{fCurrency(p.price * p.quantity)}</Text>
                                </View>
                            </View>
                        ))
                    )}

                    {[
                        { name: 'Tổng số lượng', value: totalQuantity },
                        { name: 'Khuyến mãi', value: '-' + (discount ?? 0) + '%' },
                        { name: 'Tổng cộng', value: fCurrency(totalAmount), styles: styles.h4 },
                    ].map((item) => (
                        <View key={item.name} style={[styles.row, styles.noBorder]}>
                            <View style={styles.cell_1} />
                            <View style={styles.cell_2} />
                            <View style={styles.cell_3} />
                            <View style={styles.cell_4}>
                                <Text style={[item.styles ?? styles.text2]}>{item.name}</Text>
                            </View>
                            <View style={[styles.cell_5, { textAlign: 'right' }]}>
                                <Text style={[item.styles ?? styles.text2]}>{item.value}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </>
    );

    const renderByTextTotal = () => (
        <View style={[styles.mt40]}>
            <View style={{ width: '20%' }}>
                <Text style={[styles.text2, styles.h4]}>
                    Bằng chữ:
                </Text>
            </View>
            <View style={{ width: '30%' }}>
                <Text style={[styles.text2, styles.h4]}>
                    <Text style={{ textTransform: 'capitalize' }}>{capitalizeFirstLetter(fRenderTextNumber(roundedTotal))}</Text>
                </Text>
            </View>
        </View>
    );

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {renderHeader()}
                {renderBillingInfo()}
                {renderTable()}
                {/* {renderByTextTotal()} */}
                {renderDates()}
                {renderFooter()}
            </Page>
        </Document>
    );
}
