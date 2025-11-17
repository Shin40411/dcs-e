import { Box } from "@mui/material";
import { Font, PDFViewer } from "@react-pdf/renderer";
import { useSearchParams } from "react-router";
import { useGetContract, useGetReportLiquidation } from "src/actions/contract";
import { EmptyContent } from "src/components/empty-content";
import { RenderLiquidation } from "./components/renderLiquidation";

export function ContractLiquidation() {
    const [searchParams] = useSearchParams();
    const contractBody = {
        id: searchParams.get('id') || 0,
        renderReportNo: searchParams.get('renderReportNo') || '',
        contractNo: searchParams.get('contractNo') || '',
        customerID: Number(searchParams.get('customerID')) || 0,
        customerName: searchParams.get('customerName') || '',
        customerEmail: searchParams.get('customerEmail') || '',
        customerPhone: searchParams.get('customerPhone') || '',
        customerAddress: searchParams.get('customerAddress') || '',
        customerTaxCode: searchParams.get('customerTaxCode') || '',
        companyName: searchParams.get('companyName') || '',
        customerBank: searchParams.get('customerBank') || '',
        customerBankNo: searchParams.get('customerBankNo') || '',
        position: searchParams.get('position') || '',
        signatureDate: searchParams.get('signatureDate'),
        deliveryAddress: searchParams.get('deliveryAddress') || '',
        deliveryTime: searchParams.get('deliveryTime'),
        downPayment: Number(searchParams.get('downPayment')) || 0,
        nextPayment: Number(searchParams.get('nextPayment')) || 0,
        lastPayment: Number(searchParams.get('lastPayment')) || 0,
        total: Number(searchParams.get('total')) || 0,
        copiesNo: Number(searchParams.get('copiesNo')) || 0,
        keptNo: Number(searchParams.get('keptNo')) || 0,
        status: Number(searchParams.get('status')) || 0,
        createDate: searchParams.get('createDate'),
        createdBy: searchParams.get('createdBy') || '',
        modifyDate: searchParams.get('modifyDate'),
        modifiedBy: searchParams.get('modifiedBy') || '',
        note: searchParams.get('note') || '',
        seller: searchParams.get('seller') || '',
    };

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

    const { contract, contractError } = useGetContract({
        contractId: Number(contractBody.id) || 0,
        pageNumber: 1,
        pageSize: 999,
        options: { enabled: true }
    });

    const { report } = useGetReportLiquidation({
        contractNo: contractBody.contractNo,
        pageNumber: 1,
        pageSize: 999,
        enabled: true
    });

    return (
        <>
            {contractError || !contractBody.id
                ?
                <Box height="100vh" overflow="hidden">
                    <EmptyContent content="Không có dữ liệu để tạo biên bản" />
                </Box>
                :
                <Box height="100vh" overflow="hidden">
                    <PDFViewer width="100%" height="100%" style={{ border: "none", overflow: 'hidden' }}>
                        <RenderLiquidation
                            contractNo={contractBody.contractNo}
                            customerName={contractBody.customerName}
                            customerAddress={contractBody.customerAddress}
                            customerPhone={contractBody.customerPhone}
                            companyName={contractBody.companyName}
                            position={contractBody.position}
                            keptNo={contractBody.keptNo}
                            copiesNo={contractBody.copiesNo}
                            downPayment={contractBody.downPayment}
                            nextPayment={contractBody.nextPayment}
                            lastPayment={contractBody.lastPayment}
                            signatureDate={contractBody.signatureDate}
                            total={contractBody.total}
                            deliveryAddress={contractBody.deliveryAddress}
                            customerTaxCode={contractBody.customerTaxCode}
                            customerBankNo={contractBody.customerBankNo}
                            customerBank={contractBody.customerBank}
                            currentContract={contract}
                            renderReportNo={contractBody.renderReportNo}
                            paid={report?.[0]?.reports?.[0]?.totalPaid ?? 0}
                            debt={report?.[0]?.reports?.[0]?.debt ?? 0}
                        />
                    </PDFViewer>
                </Box>
            }
        </>
    )
}