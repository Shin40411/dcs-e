import { Box, Button, Collapse, Dialog, DialogActions, DialogContent, Skeleton, Stack, Tooltip } from "@mui/material";
import { IQuotationData, IQuotationItem } from "src/types/quotation";
import { useGetQuotation } from "src/actions/quotation";
import { JSX, useEffect, useRef, useState } from "react";
import { QuotationPDFViewer } from "./quotation-pdf";
import { Iconify } from "src/components/iconify";
import QuotationSendMail from "./quotation-sendmail";
import { useBoolean } from "minimal-shared/hooks";

type Props = {
    selectedQuotation: IQuotationItem;
    openDetail: boolean;
    openForm: (obj: IQuotationItem) => void;
    onClose: () => void;
}

export function QuotationDetails({ selectedQuotation, openForm, openDetail = false, onClose }: Props) {
    const openSendMail = useBoolean();

    const { quotation, quotationLoading, quotationError } = useGetQuotation({
        quotationId: selectedQuotation?.id,
        pageNumber: 1,
        pageSize: 999,
        options: { enabled: !!selectedQuotation?.id }
    });

    const [showActions, setShowActions] = useState(false);

    const handleToggle = () => {
        setShowActions((prev) => !prev);
    };

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

    const pdfRef = useRef<JSX.Element | null>(null);
    if (!pdfRef.current && currentQuotation) {
        pdfRef.current = (
            <QuotationPDFViewer
                invoice={selectedQuotation}
                currentStatus={statusMap[selectedQuotation.status]}
                currentQuotation={currentQuotation}
            />
        );
    }

    return (
        <Dialog open={openDetail} onClose={onClose} fullScreen>
            <DialogActions sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 2 }}>
                <Stack direction="row" width="100%" justifyContent="space-between">
                    <Button onClick={onClose}>Đóng</Button>
                    <Stack direction="row" gap={2} justifyContent="space-between">
                        <Button
                            variant="contained"
                            type="button"
                            onClick={handleToggle}
                            startIcon={<Iconify icon="streamline-pixel:send-email" />}
                        >
                            {showActions ? 'Hủy' : 'Gửi báo giá'}
                        </Button>
                        <Button
                            variant="contained"
                            type="button"
                            onClick={() => {
                                onClose();
                                openForm(selectedQuotation);
                            }}
                            startIcon={<Iconify icon="solar:copy-linear" />}
                        >
                            Copy báo giá
                        </Button>
                        <Button
                            variant="contained"
                            type="button"
                            startIcon={<Iconify icon="clarity:contract-line" />}
                        >
                            Tạo hợp đồng
                        </Button>
                    </Stack>
                </Stack>
                <Collapse sx={{ width: '100%' }} in={showActions} timeout="auto" unmountOnExit>
                    <QuotationSendMail
                        email={selectedQuotation.email}
                        quotationId={selectedQuotation.id}
                    />
                </Collapse>
            </DialogActions>
            <Box sx={{ flexGrow: 1, height: 1, overflow: 'hidden' }}>
                {pdfRef.current}
            </Box>
        </Dialog>
    );
}