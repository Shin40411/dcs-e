import { useEffect, useMemo, useState } from 'react';
import {
    Page,
    View,
    Font,
    Document,
    PDFViewer,
    Image,
} from '@react-pdf/renderer';

import { IQuotationData, IQuotationItem } from 'src/types/quotation';
import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { useStyles } from '../components/useStyle';
import { renderHeader } from '../components/renderHeader';
import { renderDates } from '../components/renderDates';
import { renderTitle } from '../components/renderTitle';
import { renderBillingInfo } from '../components/renderBillingInfo';
import { renderTable } from '../components/renderTable';
import { renderByTextTotal } from '../components/renderByTextTotal';
import { renderNotes } from '../components/renderNotes';
import { renderFooter } from '../components/renderFooter';
import { generatePdfBlob } from 'src/utils/generateblob-func';
import { downloadPdf, printPdf } from 'src/utils/random-func';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type QuotationPDFProps = {
    invoice: IQuotationItem;
    currentStatus: string;
    currentQuotation?: IQuotationData;
    openDetail: boolean;
};
// ----------------------------------------------------------------------

export function QuotationPDFViewer({ invoice, currentStatus, currentQuotation, openDetail }: QuotationPDFProps) {

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (openDetail) {
            document.querySelectorAll('iframe[data-print="1"]').forEach((iframe) => {
                iframe.remove();
            });
        }

        return () => {
            document.querySelectorAll('iframe[data-print="1"]').forEach((iframe) => {
                iframe.remove();
            });
        };
    }, [openDetail]);

    const handleDownload = async () => {
        const blob = await generatePdfBlob(
            <QuotationPdfDocument
                invoice={invoice}
                currentStatus={currentStatus}
                currentQuotation={currentQuotation}
            />
        );

        await downloadPdf(blob, `${invoice.quotationNo}.pdf`);
    };

    const handlePrint = async () => {
        const blob = await generatePdfBlob(
            <QuotationPdfDocument
                invoice={invoice}
                currentStatus={currentStatus}
                currentQuotation={currentQuotation}
            />
        );

        await printPdf(blob);
    };

    const memoizedDoc = useMemo(() => (
        <QuotationPdfDocument
            invoice={invoice}
            currentStatus={currentStatus}
            currentQuotation={currentQuotation}
        />
    ), [invoice, currentStatus, currentQuotation]);

    return (
        <Box height="100%" overflow="hidden" pb={8}>
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
            <Stack direction="row" spacing={1} padding={2} bgcolor="rgb(60,60,60)" justifyContent="space-between">
                <Box>
                    <Typography variant="caption" sx={{ color: '#fff' }} fontWeight={700}>{invoice.quotationNo}</Typography>
                </Box>
                <Box>
                    <Button variant="text" onClick={handleDownload} title="Tải về">
                        <Iconify icon="material-symbols:download" color="#fff" />
                    </Button>
                    <Button variant="text" onClick={handlePrint} title="In">
                        <Iconify icon="material-symbols:print-outline" color="#fff" />
                    </Button>
                </Box>
            </Stack>
            <PDFViewer width="100%" height="100%" style={{ border: "none" }} showToolbar={false}>
                {memoizedDoc}
            </PDFViewer>
        </Box>
    );
}

// ----------------------------------------------------------------------

Font.register({
    family: 'Niramit-Medium',
    fonts: [{ src: '/fonts/Niramit/Niramit-Medium.ttf' }],
});

Font.register({
    family: 'Niramit-MediumItalic',
    fonts: [{ src: '/fonts/Niramit/Niramit-MediumItalic.ttf' }],
});

Font.register({
    family: 'Niramit-LightItalic',
    fonts: [{ src: '/fonts/Niramit/Niramit-LightItalic.ttf' }],
});

Font.register({
    family: 'Niramit-Bold',
    fonts: [{ src: '/fonts/Niramit/Niramit-Bold.ttf' }],
});

Font.register({
    family: 'Niramit-Light',
    fonts: [{ src: '/fonts/Niramit/Niramit-Light.ttf' }],
});

Font.register({
    family: 'Niramit-ExtraLight',
    fonts: [{ src: '/fonts/Niramit/Niramit-ExtraLight.ttf' }],
});

Font.register({
    family: 'Niramit-SemiBold',
    fonts: [{ src: '/fonts/Niramit/Niramit-SemiBold.ttf' }],
});

Font.register({
    family: 'Niramit-italic',
    fonts: [{ src: '/fonts/Niramit/Niramit-MediumItalic.ttf' }],
});

Font.register({
    family: 'Niramit-BoldItalic',
    fonts: [
        {
            src: '/fonts/Niramit/Niramit-BoldItalic.ttf',
        },
    ],
});

Font.register({
    family: 'Niramit',
    fonts: [
        {
            src: '/fonts/Niramit/Niramit-Light.ttf',
        },
    ],
});

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

    return (
        <Document
            title={`Đơn đặt hàng số ${quotationNo}`}
        >
            <Page size="A4" style={styles.page}>
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
                </View>
                <View
                    style={{
                        position: 'absolute',
                        top: 8,
                        left: styles.header?.left ?? 0,
                        right: styles.header?.right ?? 0,
                        marginLeft: 10,
                        marginBottom: 8,
                    }}
                >
                    {renderHeader()}
                </View>
                <View
                    style={styles.body}
                >
                    {renderDates(createdDate, quotationNo)}
                    {renderTitle('Đơn đặt hàng')}
                    {renderBillingInfo(companyName, customerName, 'Công ty TNHH Giải Pháp DCS có nhu cầu đặt mua hàng hóa, dịch vụ từ Quý Công ty với các nội dung cụ thể như sau:')}
                    {renderTable({ currentQuotation, totalAmount })}
                    {renderByTextTotal(totalAmount)}
                    {renderNotes({ note, employeeType, department, seller })}
                </View>
                {renderFooter()}
            </Page>
        </Document>
    );
}