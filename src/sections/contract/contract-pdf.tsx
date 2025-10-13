import { Box, CircularProgress, Typography } from "@mui/material";
import { Page, Document, Font, View, PDFViewer } from "@react-pdf/renderer";
import { useEffect, useMemo, useState } from "react";
import { IContractData, IContractItem } from "src/types/contract";
import { renderTitle } from "./components/renderTitle";
import { renderHeader } from "./components/renderHeader";
import { renderLaw } from "./components/renderLaw";
import { renderTwoSides } from "./components/renderTwoSides";
import { renderRuleOne } from "./components/renderRuleOne";
import { renderTable } from "./components/renderTable";
import { renderRuleTwo } from "./components/renderRuleTwo";
import { renderFooter } from "./components/renderFooter";
import { useStyles } from "./components/useStyle";
import { renderRuleThree } from "./components/renderRuleThree";
import { renderRuleFour } from "./components/renderRuleFour";
import { renderRuleFive } from "./components/renderRuleFive";
import { renderRuleSix } from "./components/renderRuleSix";
import { renderSigner } from "./components/renderSigner";

type ContractPDFProps = {
    contract: IContractItem;
    currentStatus: string;
    currentContract?: IContractData;
};

export function ContractPDFViewer({ contract, currentStatus, currentContract }: ContractPDFProps) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    // useEffect(() => {
    //     console.log('render 0:', contract);
    //     console.log('render 1:', currentContract);
    // }, [contract, currentContract]);


    const memoizedDoc = useMemo(() => (
        <ContractPdfDocument
            contract={contract}
            currentStatus={currentStatus}
            currentContract={currentContract}
        />
    ), [contract, currentStatus, currentContract]);

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

type ContractPdfDocumentProps = {
    contract?: IContractItem;
    currentStatus: string;
    currentContract?: IContractData;
};

export function ContractPdfDocument({ contract, currentStatus, currentContract }: ContractPdfDocumentProps) {
    const styles = useStyles();

    const {
        contractNo,
        customerID,
        customerName,
        customerEmail,
        customerPhone,
        customerAddress,
        customerTaxCode,
        customerBank,
        customerBankNo,
        companyName,
        signatureDate,
        deliveryAddress,
        deliveryTime,
        downPayment,
        nextPayment,
        lastPayment,
        total,
        copiesNo,
        keptNo,
        status,
        createDate,
        createdBy,
        modifyDate,
        modifiedBy,
        note,
        seller,
        discount,
    } = contract ?? {};

    return (
        <Document
            title={`Hợp đồng số ${contractNo}`}
        >

            {currentContract?.totalRecord && currentContract.totalRecord > 3 ?
                (
                    <>
                        <Page size="A4" style={styles.page}>
                            {renderHeader()}
                            <View style={styles.body}>
                                {renderTitle(contractNo)}
                                {renderLaw()}
                                {renderTwoSides({
                                    customerAddress,
                                    companyName,
                                    customerBank,
                                    customerBankNo,
                                    customerName,
                                    customerPhone
                                })}
                                {renderRuleOne()}
                            </View>
                            {renderFooter()}
                        </Page>
                        <Page size="A4" style={styles.page}>
                            {renderHeader()}
                            <View style={styles.body}>
                                {renderTable({
                                    currentContract,
                                    discount,
                                    total
                                })}
                                {renderRuleTwo({
                                    downPayment,
                                    nextPayment,
                                    lastPayment,
                                    signatureDate,
                                    total
                                })}
                                {renderRuleThree()}
                                {renderRuleFour()}
                                {renderRuleFive()}
                                {renderRuleSix()}
                                {renderSigner({ companyName, customerName })}
                            </View>
                            {renderFooter()}
                        </Page>
                    </>
                )
                :
                <Page size="A4" style={styles.page}>
                    {renderHeader()}
                    <View style={styles.body}>
                        {renderTitle(contractNo)}
                        {renderLaw()}
                        {renderTwoSides({
                            customerAddress,
                            companyName,
                            customerBank,
                            customerBankNo,
                            customerName,
                            customerPhone
                        })}
                        {renderRuleOne()}
                        {renderTable({
                            currentContract,
                            discount,
                            total
                        })}
                        {renderRuleTwo({
                            downPayment,
                            nextPayment,
                            lastPayment,
                            signatureDate,
                            total
                        })}
                        {renderRuleThree()}
                        {renderRuleFour()}
                        {renderRuleFive()}
                        {renderRuleSix()}
                        {renderSigner({ companyName, customerName })}
                    </View>
                    {renderFooter()}
                </Page>
            }
        </Document>
    );
}