import { useEffect, useMemo, useState } from 'react';
import {
    Page,
    View,
    Font,
    Document,
    PDFViewer,
} from '@react-pdf/renderer';

import { IQuotationData, IQuotationItem } from 'src/types/quotation';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useStyles } from './components/useStyle';
import { renderHeader } from './components/renderHeader';
import { renderDates } from './components/renderDates';
import { renderTitle } from './components/renderTitle';
import { renderBillingInfo } from './components/renderBillingInfo';
import { renderTable } from './components/renderTable';
import { renderByTextTotal } from './components/renderByTextTotal';
import { renderNotes } from './components/renderNotes';
import { renderFooter } from './components/renderFooter';

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
            title={`Báo giá số ${quotationNo}`}
        >
            <Page size="A4" style={styles.page}>
                {renderHeader()}
                <View
                    style={styles.body}
                >
                    {renderDates(createdDate, quotationNo)}
                    {renderTitle()}
                    {renderBillingInfo(companyName, customerName)}
                    {renderTable({ currentQuotation, totalAmount })}
                    {renderByTextTotal(totalAmount)}
                    {renderNotes({ note, employeeType, department, seller })}
                </View>
                {renderFooter()}
            </Page>
        </Document>
    );
}