import { Box } from "@mui/material";
import { Font, PDFViewer } from "@react-pdf/renderer";
import { RenderWarehouseExport } from "./components/renderWarehouseExport";
import { useSearchParams } from "react-router";
import { useGetDetailWarehouseExportProduct, useGetUnExportProduct } from "src/actions/contract";
import { EmptyContent } from "src/components/empty-content";
import { useEffect, useMemo, useState } from "react";
import { IContractRemainingProduct } from "src/types/contract";

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


    if (!contractBody.contractId) {
        return (<Box height="100vh" overflow="hidden">
            <EmptyContent content="Không có dữ liệu để tạo phiếu xuất kho" />
        </Box>);
    }

    const contractId = Number(contractBody.contractId);
    const exportId = Number(contractBody.exportId);
    const isCreating = contractBody.isCreating === "true";

    const hookParams = useMemo(() => ({
        contractId,
        exportId: exportId || 0,
        isCreating
    }), [contractId, exportId, isCreating]);

    const { remainingProduct, remainingProductEmpty } = useGetUnExportProduct(
        hookParams.contractId,
        hookParams.isCreating
    );

    const { detailsProduct, detailsProductEmpty } = useGetDetailWarehouseExportProduct(
        hookParams.exportId,
        !hookParams.isCreating
    );

    const mappedProducts = useMemo<IContractRemainingProduct[]>(() => {
        if (isCreating) {
            return remainingProduct || [];
        }

        return (detailsProduct || []).map((p) => ({
            productID: p.productID,
            name: p.productName,
            price: p.price,
            quantity: p.quantity,
            productUnitID: p.unitProductID,
            productUnitName: p.unitProductName,
            total: p.total,
            vat: p.vat,
            warranty: 0,
            exported: 0,
            remaining: p.quantity,
        }));
    }, [isCreating, remainingProduct, detailsProduct]);

    const isProductEmpty = isCreating ? remainingProductEmpty : detailsProductEmpty;

    if (isProductEmpty) {
        return (
            <Box height="100vh" overflow="hidden">
                <EmptyContent content="Không có dữ liệu để tạo phiếu xuất kho" />
            </Box>
        );
    }

    return (
        <Box height="100vh" overflow="hidden">
            <PDFViewer width="100%" height="100%" style={{ border: "none", overflow: 'hidden' }}>
                <RenderWarehouseExport contractBody={contractBody} productsUnExported={mappedProducts} />
            </PDFViewer>
        </Box>
    );
}