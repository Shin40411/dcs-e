import { Box, Button, Collapse, Dialog, DialogActions, DialogContent, Skeleton, Stack, Tooltip } from "@mui/material";
import { IQuotationData, IQuotationItem } from "src/types/quotation";
import { useGetQuotation } from "src/actions/quotation";
import { JSX, useEffect, useRef, useState } from "react";
import { QuotationPDFViewer } from "./quotation-pdf";
import { Iconify } from "src/components/iconify";
import QuotationSendMail from "./quotation-sendmail";
import { useNavigate } from "react-router";
import { paths } from "src/routes/paths";
import { useBoolean } from "minimal-shared/hooks";
import { toast } from "sonner";
import { useGetCompanyInfo } from "src/actions/companyInfo";

type Props = {
    selectedQuotation: IQuotationItem;
    openDetail: boolean;
    openForm: (obj: IQuotationItem) => void;
    onClose: () => void;
}

export function QuotationDetails({ selectedQuotation, openForm, openDetail = false, onClose }: Props) {
    const navigate = useNavigate();

    const { quotation, quotationLoading, quotationError } = useGetQuotation({
        quotationId: selectedQuotation?.id,
        pageNumber: 1,
        pageSize: 999,
        options: { enabled: !!selectedQuotation?.id }
    });

    const { companyInfoData, mutation: refetchCompanyInfo } = useGetCompanyInfo();

    const handleCreateContract = () => {
        navigate(paths.dashboard.customerServices.contract, {
            state: {
                openForm: true,
                details: quotation,
                customer: selectedQuotation.customerId
            }
        });
    };
    const openSendMail = useBoolean();

    const statusMap: { [key: number]: string } = {
        0: "Bỏ qua",
        1: "Nháp",
        2: "Đang thực hiện",
        3: "Đã thanh toán",
    }
    const pdfRef = useRef<JSX.Element | null>(null);
    const pdfQuotationIdRef = useRef<number | string | null>(null);

    if (
        quotation &&
        selectedQuotation &&
        pdfQuotationIdRef.current !== selectedQuotation.id
    ) {
        pdfRef.current = (
            <QuotationPDFViewer
                invoice={selectedQuotation}
                currentStatus={statusMap[selectedQuotation.status]}
                currentQuotation={quotation}
                openDetail={openDetail}
                companyInfoData={companyInfoData}
            />
        );
        pdfQuotationIdRef.current = selectedQuotation.id;
    }

    useEffect(() => {
        if (quotationError) {
            toast.error("Không thể xem! Báo giá này đang thiếu dữ liệu chi tiết");
        }
    }, [quotationError]);

    useEffect(() => {
        refetchCompanyInfo();
    }, [openDetail]);

    return (
        <>
            <Dialog open={openDetail && !quotationError} onClose={onClose} fullScreen>
                {quotationLoading ? (
                    <Stack spacing={2} sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, overflowX: 'auto' }}>
                            <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 1, flexShrink: 0 }} />

                            <Box sx={{ display: 'flex', gap: 1 }}>
                                {Array.from({ length: 5 }).map((_, idx) => (
                                    <Skeleton
                                        key={idx}
                                        variant="rectangular"
                                        width={120}
                                        height={40}
                                        sx={{ borderRadius: 1, flexShrink: 0 }}
                                    />
                                ))}
                            </Box>
                        </Box>
                        <Skeleton
                            variant="rectangular"
                            sx={{ flexGrow: 1, width: '100%', height: '100vh', borderRadius: 1 }}
                        />
                    </Stack>
                ) : quotation && selectedQuotation ? (
                    <>
                        <DialogActions sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 2 }}>
                            <Stack direction="row" width="100%" justifyContent="space-between">
                                <Button onClick={onClose}>Đóng</Button>
                                <Stack direction="row" gap={2} justifyContent="space-between">
                                    <Button
                                        variant="contained"
                                        type="button"
                                        onClick={openSendMail.onTrue}
                                        startIcon={<Iconify icon="streamline-pixel:send-email" />}
                                    >
                                        Gửi báo giá
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
                                        onClick={handleCreateContract}
                                    >
                                        Tạo hợp đồng
                                    </Button>
                                </Stack>
                            </Stack>
                        </DialogActions>
                        <Box sx={{ flexGrow: 1, height: 1, overflow: 'hidden' }}>
                            {pdfRef.current}
                        </Box>
                    </>
                ) : null}
            </Dialog>
            <QuotationSendMail
                openSendMail={openSendMail}
                email={selectedQuotation.email}
                quotationId={selectedQuotation.id}
            />
        </>
    );
}