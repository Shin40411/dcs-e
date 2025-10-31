import { Font, PDFViewer, StyleSheet } from "@react-pdf/renderer";
import { RenderReceipt } from "./components/renderReceiptTicket";
import { Box } from "@mui/material";
import { useSearchParams } from "react-router";

export function ContractReceiptPdf() {
    const [searchParams] = useSearchParams();
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    Font.register({
        family: 'Niramit-Medium',
        fonts: [{ src: '/fonts/Niramit/Niramit-Medium.ttf' }],
    });

    Font.register({
        family: 'Niramit-Bold',
        fonts: [{ src: '/fonts/Niramit/Niramit-Bold.ttf' }],
    });

    Font.register({
        family: 'Niramit-SemiBold',
        fonts: [{ src: '/fonts/Niramit/Niramit-SemiBold.ttf' }],
    });

    Font.register({
        family: 'Niramit-ExtraLight',
        fonts: [{ src: '/fonts/Niramit/Niramit-ExtraLight.ttf' }],
    });

    Font.register({
        family: 'Niramit-Light',
        fonts: [{ src: '/fonts/Niramit/Niramit-Light.ttf' }],
    });

    Font.register({
        family: 'Niramit-italic',
        fonts: [{ src: '/fonts/Niramit/Niramit-MediumItalic.ttf' }],
    });

    Font.register({
        family: 'Niramit-LightItalic',
        fonts: [{ src: '/fonts/Niramit/Niramit-LightItalic.ttf' }],
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
        family: 'Montserrat-bold',
        fonts: [{ src: '/fonts/Montserrat/static/Montserrat-Bold.ttf' }],
    });

    Font.register({
        family: 'Montserrat-Semi',
        fonts: [{ src: '/fonts/Montserrat/static/Montserrat-Medium.ttf' }],
    });

    Font.register({
        family: 'Montserrat',
        fonts: [
            {
                src: '/fonts/Montserrat/static/Montserrat-Light.ttf',
            },
        ],
    });

    const receiptBody = {
        companyName: searchParams.get("companyName") || "",
        customerName: searchParams.get("customerName") || "",
        date: searchParams.get("date") || `ngày ${dd} tháng ${mm} năm ${yyyy}`,
        receiptNoToWatch: searchParams.get("receiptNoToWatch") || "",
        amount: Number(searchParams.get("amount")) || 0,
        payer: searchParams.get("payer") || "",
        contractNo: searchParams.get("contractNo") || "",
        address: searchParams.get("address") || "",
        reason: searchParams.get("reason") || "",
        createdBy: searchParams.get("createdBy") || ""
    };

    return (
        <Box height="100vh" overflow="hidden">
            <PDFViewer width="100%" height="100%" style={{ border: "none", overflow: 'hidden' }}>
                <RenderReceipt
                    data={{
                        date: receiptBody.date,
                        contractNo: receiptBody.contractNo,
                        receiptNo: receiptBody.receiptNoToWatch,
                        payerName: receiptBody.payer,
                        address: receiptBody.address,
                        reason: receiptBody.reason,
                        amount: receiptBody.amount,
                        attachment: "",
                        createdBy: receiptBody.createdBy
                    }}
                />
            </PDFViewer>
        </Box>
    )
}