import { Box, Button, Stack, Typography } from "@mui/material";
import { Font, PDFViewer } from "@react-pdf/renderer";
import { RenderWarehouseImport } from "./components/renderWarehouseExport";
import { useSearchParams } from "react-router";
import { EmptyContent } from "src/components/empty-content";
import { useEffect, useMemo } from "react";
import { useGetDetailWarehouseImportProduct, useGetUnImportProduct } from "src/actions/contractSupplier";
import { IImportRemainingProduct } from "src/types/contractSupplier";
import { Iconify } from "src/components/iconify";
import { generatePdfBlob } from "src/utils/generateblob-func";
import { downloadPdf, printPdf } from "src/utils/random-func";
import { useGetCompanyInfo } from "src/actions/companyInfo";

export function ContractWarehousePdf() {
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
    const [searchParams] = useSearchParams();
    const contractBody = Object.fromEntries(searchParams.entries());
    const invalidContract = !contractBody.contractId;

    const contractId = Number(contractBody.contractId);
    const exportId = Number(contractBody.exportId);
    const isCreating = contractBody.isCreating === "true";

    const hookParams = useMemo(() => ({
        contractId,
        exportId: exportId || 0,
        isCreating
    }), [contractId, exportId, isCreating]);

    const { remainingProduct, remainingProductEmpty } = useGetUnImportProduct(
        hookParams.contractId,
        hookParams.isCreating
    );

    const { detailsProduct, detailsProductEmpty } = useGetDetailWarehouseImportProduct(
        hookParams.exportId,
        !hookParams.isCreating
    );

    const { companyInfoData } = useGetCompanyInfo();

    const mappedProducts = useMemo<IImportRemainingProduct[]>(() => {
        if (isCreating) {
            return remainingProduct || [];
        }

        return (detailsProduct || []).map((p) => ({
            productID: p.productID,
            productName: p.productName,
            unit: p.unitProductName,
            quantity: p.quantity,
            price: p.price,
            vat: p.vat,
            amounts: p.total,
        }));
    }, [isCreating, remainingProduct, detailsProduct]);

    const isProductEmpty = isCreating ? remainingProductEmpty : detailsProductEmpty;

    useEffect(() => {
        const isEmpty = isProductEmpty;

        if (isEmpty) {
            document.querySelectorAll('iframe[data-print="1"]').forEach((iframe) => {
                iframe.remove();
            });
        }

        return () => {
            document.querySelectorAll('iframe[data-print="1"]').forEach((iframe) => {
                iframe.remove();
            });
        };
    }, [isProductEmpty]);

    const handleDownload = async () => {
        const blob = await generatePdfBlob(
            <RenderWarehouseImport contractBody={contractBody} productsUnExported={mappedProducts} companyInfoData={companyInfoData} />
        );

        await downloadPdf(blob, `${contractBody.warehouseExportNo}.pdf`);
    };

    const handlePrint = async () => {
        const blob = await generatePdfBlob(
            <RenderWarehouseImport contractBody={contractBody} productsUnExported={mappedProducts} companyInfoData={companyInfoData} />
        );

        await printPdf(blob);
    };

    if (invalidContract) {
        return (
            <Box height="100vh" overflow="hidden">
                <EmptyContent title="Không có dữ liệu để tạo phiếu nhập kho" />
            </Box>
        );
    }

    if (isProductEmpty) {
        return (
            <Box height="100vh" overflow="hidden">
                <EmptyContent title="Không có dữ liệu để tạo phiếu nhập kho" />
            </Box>
        );
    }

    return (
        <Box height="100vh" overflow="hidden" pb={8}>
            <Stack direction="row" spacing={1} padding={2} bgcolor="rgb(60,60,60)" justifyContent="space-between">
                <Box>
                    <Typography variant="caption" sx={{ color: '#fff' }} fontWeight={700}>{contractBody.warehouseExportNo}</Typography>
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
            <PDFViewer width="100%" height="100%" style={{ border: "none", overflow: 'hidden' }} showToolbar={false}>
                <RenderWarehouseImport contractBody={contractBody} productsUnExported={mappedProducts} companyInfoData={companyInfoData} />
            </PDFViewer>
        </Box>
    );
}