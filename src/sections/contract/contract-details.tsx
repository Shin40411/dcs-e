import { Box, Button, Collapse, Dialog, DialogActions, DialogContent, Drawer, IconButton, Skeleton, Stack, Typography } from "@mui/material";
import { JSX, useEffect, useMemo, useRef, useState } from "react";
import { useGetContract } from "src/actions/contract";
import { Iconify } from "src/components/iconify";
import { IContractData, IContractItem } from "src/types/contract";
import { ContractPDFViewer } from "./contract-pdf";

type Props = {
    selectedContract: IContractItem;
    openDetail: boolean;
    openForm: (obj: IContractItem) => void;
    onClose: () => void;
}

export function ContractDetails({ selectedContract, openDetail, openForm, onClose }: Props) {
    const { contract, contractLoading, contractError } = useGetContract({
        contractId: selectedContract?.id,
        pageNumber: 1,
        pageSize: 999,
        options: { enabled: !!selectedContract?.id }
    });

    const [showActions, setShowActions] = useState(false);

    const handleToggle = () => {
        setShowActions((prev) => !prev);
    };

    const [currentContract, setSelectContract] = useState<IContractData>();

    const statusMap: { [key: number]: string } = {
        0: "Bỏ qua",
        1: "Nháp",
        2: "Đang thực hiện",
        3: "Đã thanh toán",
    }

    useEffect(() => {
        if (contract) {
            setSelectContract(contract);
        }
    }, [contract]);

    const pdfRef = useRef<JSX.Element | null>(null);

    if (!pdfRef.current && currentContract) {
        pdfRef.current = (
            <ContractPDFViewer
                contract={selectedContract}
                currentStatus={statusMap[selectedContract.status]}
                currentContract={currentContract}
            />
        );
    }

    return (
        <>
            <Dialog open={openDetail} onClose={onClose} fullScreen>
                <DialogActions>
                    <Stack direction="column" width="100%" alignItems="center">
                        <Stack direction="row" width="100%" justifyContent="space-between">
                            <Button onClick={onClose}>Đóng</Button>
                            <Box>
                                <Button
                                    type="button"
                                    onClick={handleToggle}
                                    variant="contained"
                                    sx={{
                                        minWidth: 'auto',
                                        padding: '5px',
                                        borderRadius: '50%'
                                    }}
                                >
                                    <Iconify
                                        icon={
                                            showActions
                                                ? "tabler:layout-navbar-collapse"
                                                : "tabler:layout-bottombar-collapse"
                                        }
                                    />
                                </Button>
                            </Box>
                        </Stack>
                        <Collapse sx={{ width: '100%' }} in={showActions} timeout="auto" unmountOnExit>
                            <Stack direction="row" flexWrap="wrap" justifyContent="space-between" width="100%" mt={2}>
                                <Button variant="contained" startIcon={<Iconify icon="streamline-pixel:send-email" />}>Gửi hợp đồng</Button>
                                <Button variant="contained" startIcon={<Iconify icon="streamline-plump:email-attachment-document" />}>Đính kèm chứng từ</Button>
                                <Button variant="contained" startIcon={<Iconify icon="streamline-ultimate:receipt-bold" />}>Lập phiếu thu</Button>
                                <Button variant="contained" startIcon={<Iconify icon="hugeicons:payment-02" />}>Lập phiếu chi</Button>
                                <Button variant="contained" startIcon={<Iconify icon="picon:receive" />}>Phải thu</Button>
                                <Button variant="contained" startIcon={<Iconify icon="game-icons:pay-money" />}>Phải chi</Button>
                                <Button variant="contained" startIcon={<Iconify icon="solar:copy-linear" />}>Copy hợp đồng</Button>
                                <Button variant="contained" startIcon={<Iconify icon="lsicon:out-of-warehouse-filled" />}>Phiếu xuất kho</Button>
                                <Button variant="contained" startIcon={<Iconify icon="lsicon:report-filled" />}>Tạo biên bản nghiệm thu</Button>
                                <Button variant="contained" startIcon={<Iconify icon="material-symbols:contract-edit-outline-sharp" />}>Lập hợp đồng</Button>
                            </Stack>
                        </Collapse>
                    </Stack>
                </DialogActions>
                <Box sx={{ flexGrow: 1, height: 1, overflow: 'hidden' }}>
                    {pdfRef.current}
                </Box>
            </Dialog>
        </>
    );
}