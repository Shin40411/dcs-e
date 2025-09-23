import { Box, Button, Dialog, DialogActions, DialogContent, Skeleton, Tooltip } from "@mui/material";
import { IQuotationData, IQuotationItem } from "src/types/quotation";
import html2pdf from "html2pdf.js";
import { useGetQuotation } from "src/actions/quotation";
import { useEffect, useState } from "react";
import { QuotationPDFViewer } from "./quotation-pdf";

type Props = {
    selectedQuotation: IQuotationItem;
    openDetail: boolean;
    onClose: () => void;
}

export function QuotationDetails({ selectedQuotation, openDetail = false, onClose }: Props) {
    const { quotation, quotationLoading, quotationError } = useGetQuotation({
        quotationId: selectedQuotation?.id,
        pageNumber: 1,
        pageSize: 999,
        options: { enabled: !!selectedQuotation?.id }
    });

    const [currentQuotation, setSelectQuotation] = useState<IQuotationData>();

    const statusMap: { [key: number]: string } = {
        0: "Bỏ qua",
        1: "Nháp",
        2: "Đang thực hiện",
        3: "Đã thanh toán",
    }

    useEffect(() => {
        if (quotation) {
            setSelectQuotation(quotation);
        }
    }, [quotation]);

    const handleExportPDF = () => {
        const element = document.getElementById("quotation-preview");
        if (element) {
            html2pdf()
                .from(element)
                .set({ margin: 10, filename: `${selectedQuotation?.quotationNo}.pdf`, html2canvas: { scale: 2 } })
                .save();
        }
    };

    const roundedTotal = Math.round(selectedQuotation.totalAmount);

    if (quotationLoading || !currentQuotation) {
        return (
            <Dialog open={openDetail} onClose={onClose} fullScreen>
                <DialogContent sx={{ pb: '5%' }}>
                    <Skeleton variant="text" width={200} />
                    <Skeleton variant="rectangular" height={200} sx={{ mt: 2 }} />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={openDetail} onClose={onClose} fullScreen>
            <DialogActions>
                <Button onClick={onClose}>Đóng</Button>
                {/* <Button variant="contained" onClick={handleExportPDF}>
                    Xuất PDF
                </Button> */}
                <Tooltip title="Chức năng đang phát triển">
                    <span style={{ marginLeft: 10 }}>
                        <Button variant="outlined" disabled>
                            Tạo hợp đồng
                        </Button>
                    </span>
                </Tooltip>
            </DialogActions>
            <Box sx={{ flexGrow: 1, height: 1, overflow: 'hidden' }}>
                <QuotationPDFViewer
                    invoice={selectedQuotation}
                    currentStatus={statusMap[selectedQuotation.status]}
                    currentQuotation={currentQuotation}
                />
            </Box>
        </Dialog>
    );
}