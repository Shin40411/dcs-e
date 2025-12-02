import { Box, Button, Collapse, Dialog, DialogActions, DialogContent, Drawer, IconButton, Menu, MenuItem, Skeleton, Stack, Typography } from "@mui/material";
import { JSX, MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import { createReport, useGetContract } from "src/actions/contract";
import { Iconify } from "src/components/iconify";
import { IContractData, IContractItem, ReportDto } from "src/types/contract";
import { ContractPDFViewer } from "./contract-pdf";
import ContractAttachMent from "./contract-attachment";
import { useBoolean } from "minimal-shared/hooks";
import ContractSendMail from "./contract-sendmail";
import { ContractReceipt } from "./contract-receipt";
import { ContractWareHouse } from "./contract-warehouse";
import { paths } from "src/routes/paths";
import { ContractFollow } from "./contract-follow";
import { ContractFollowSpend } from "./contract-follow-spend";
import { toast } from "sonner";
import { generateLiquidationNo } from "src/utils/random-func";
import { ContractSpend } from "./contract-spend";

type Props = {
    selectedContract: IContractItem;
    openDetail: boolean;
    copyContract: (obj: IContractItem) => void;
    onClose: () => void;
    createSupplierContract: () => void;
}

export function ContractDetails({ selectedContract, openDetail, copyContract, onClose, createSupplierContract }: Props) {
    const { contract, contractLoading, contractError } = useGetContract({
        contractId: selectedContract?.id,
        pageNumber: 1,
        pageSize: 999,
        options: { enabled: !!selectedContract?.id }
    });

    const [createReportLoad, setCreateReportLoad] = useState(false);
    const [refetchFns, setRefetchFns] = useState<{
        refetchNeedCollect: () => void;
        refetchBatchCollect: () => void;
        refetchHistoryCollect: () => void;
    } | null>(null);

    const [refetchFns2, setRefetchFns2] = useState<{
        refetchNeedSpend: () => void;
        refetchNeedSpendForContract: () => void;
        refetchHistorySpend: () => void;
    } | null>(null);

    const openSendMail = useBoolean();

    const openFollow = useBoolean();
    const openFollowSpend = useBoolean();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [anchorTD, setAnchorTD] = useState<null | HTMLElement>(null);
    const [anchorBB, setAnchorBB] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const openTD = Boolean(anchorTD);
    const openBB = Boolean(anchorBB);

    const openFileAttach = useBoolean();
    const openReceipt = useBoolean();
    const openSpend = useBoolean();
    const openWareHouse = useBoolean();

    const handleClickLP = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClickTD = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorTD(event.currentTarget);
    };

    const handleClickBB = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorBB(event.currentTarget);
    };

    const handleCloseLP = () => {
        setAnchorEl(null);
    };

    const handleCloseTD = () => {
        setAnchorTD(null);
    };

    const handleTDPT = () => {
        setAnchorTD(null);
        openFollow.onTrue();
    };

    const handleTDPC = () => {
        setAnchorTD(null);
        openFollowSpend.onTrue();
    };

    const handleCloseBB = () => {
        setAnchorBB(null);
    };

    const onPreviewReport = () => {
        const params = new URLSearchParams({
            id: String(selectedContract.id),
            contractNo: selectedContract.contractNo,
            customerID: String(selectedContract.customerID),
            customerName: selectedContract.customerName,
            customerEmail: selectedContract.customerEmail,
            customerPhone: selectedContract.customerPhone,
            customerAddress: selectedContract.customerAddress,
            customerTaxCode: selectedContract.customerTaxCode,
            companyName: selectedContract.companyName,
            customerBank: selectedContract.customerBank,
            customerBankNo: selectedContract.customerBankNo,
            position: selectedContract.position,
            signatureDate: selectedContract.signatureDate,
            deliveryAddress: selectedContract.deliveryAddress,
            deliveryTime: selectedContract.deliveryTime,
            downPayment: String(selectedContract.downPayment),
            nextPayment: String(selectedContract.nextPayment),
            lastPayment: String(selectedContract.lastPayment),
            total: String(selectedContract.total),
            copiesNo: String(selectedContract.copiesNo),
            keptNo: String(selectedContract.keptNo),
            status: String(selectedContract.status),
            createDate: selectedContract.createDate,
            createdBy: selectedContract.createdBy,
            modifyDate: selectedContract.modifyDate,
            modifiedBy: selectedContract.modifiedBy,
            note: selectedContract.note,
            seller: selectedContract.seller,
        } as Record<string, string>);
        handleCloseBB();
        const queryString = params.toString();
        window.open(`${paths.report}?${queryString}`, '_blank');
    }

    const onPreviewLiquidation = async () => {
        const renderReportNo = generateLiquidationNo();
        try {
            setCreateReportLoad(true);
            const bodyPayload: ReportDto = {
                contractNo: selectedContract.contractNo,
                contractType: 'Customer',
                date: selectedContract.signatureDate,
                reportNo: renderReportNo,
                status: 1,
                type: 'Liquidation'
            }

            await createReport(bodyPayload);
        } catch (error) {
            console.log(error);
        } finally {
            setCreateReportLoad(false);
            const params = new URLSearchParams({
                id: String(selectedContract.id),
                renderReportNo: renderReportNo,
                contractNo: selectedContract.contractNo,
                customerID: String(selectedContract.customerID),
                customerName: selectedContract.customerName,
                customerEmail: selectedContract.customerEmail,
                customerPhone: selectedContract.customerPhone,
                customerAddress: selectedContract.customerAddress,
                customerTaxCode: selectedContract.customerTaxCode,
                companyName: selectedContract.companyName,
                customerBank: selectedContract.customerBank,
                customerBankNo: selectedContract.customerBankNo,
                position: selectedContract.position,
                signatureDate: selectedContract.signatureDate,
                deliveryAddress: selectedContract.deliveryAddress,
                deliveryTime: selectedContract.deliveryTime,
                downPayment: String(selectedContract.downPayment),
                nextPayment: String(selectedContract.nextPayment),
                lastPayment: String(selectedContract.lastPayment),
                total: String(selectedContract.total),
                copiesNo: String(selectedContract.copiesNo),
                keptNo: String(selectedContract.keptNo),
                status: String(selectedContract.status),
                createDate: selectedContract.createDate,
                createdBy: selectedContract.createdBy,
                modifyDate: selectedContract.modifyDate,
                modifiedBy: selectedContract.modifiedBy,
                note: selectedContract.note,
                seller: selectedContract.seller,
            } as Record<string, string>);

            handleCloseBB();

            const queryString = params.toString();

            window.open(`${paths.liquidation}?${queryString}`, '_blank');
        }
    }

    const statusMap: { [key: number]: string } = {
        0: "Bỏ qua",
        1: "Nháp",
        2: "Đang thực hiện",
        3: "Đã thanh toán",
    }

    const pdfRef = useRef<JSX.Element | null>(null);
    const pdfContractIdRef = useRef<number | string | null>(null);

    if (
        contract &&
        selectedContract &&
        pdfContractIdRef.current !== selectedContract.id
    ) {
        pdfRef.current = (
            <ContractPDFViewer
                key={selectedContract.id}
                contract={selectedContract}
                currentStatus={statusMap[selectedContract.status]}
                currentContract={contract}
                openDetail={openDetail}
            />
        );
        pdfContractIdRef.current = selectedContract.id;
    }

    useEffect(() => {
        if (contractError) {
            toast.error("Không thể xem! Hợp đồng này đang thiếu dữ liệu chi tiết");
        }
    }, [contractError]);

    return (
        <>
            <Dialog open={openDetail && !contractError} onClose={() => { onClose() }} fullScreen>
                {contractLoading ? (
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
                ) : contract && selectedContract ? (
                    <>
                        <DialogActions sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 2 }}>
                            <Stack direction="column" width="100%" alignItems="center">
                                <Stack direction="row" width="100%" justifyContent="space-between">
                                    <Button onClick={() => { onClose() }}>Đóng</Button>
                                    <Box
                                        sx={{
                                            width: '100%',
                                            overflowX: 'auto',
                                        }}
                                    >
                                        <Stack
                                            direction="row"
                                            spacing={2}
                                            sx={{
                                                flexWrap: 'nowrap',
                                                justifyContent: 'flex-end',
                                                minWidth: 'max-content',
                                                '& button': {
                                                    whiteSpace: 'nowrap',
                                                    flexShrink: 0,
                                                },
                                                '&::-webkit-scrollbar': { height: 6 },
                                                '&::-webkit-scrollbar-thumb': {
                                                    backgroundColor: '#ccc',
                                                    borderRadius: 3,
                                                },
                                            }}
                                        >
                                            <Button
                                                variant="contained"
                                                startIcon={<Iconify icon="streamline-pixel:send-email" />}
                                                onClick={openSendMail.onTrue}
                                            >
                                                Gửi hợp đồng
                                            </Button>
                                            <Button
                                                variant="contained"
                                                startIcon={<Iconify icon="streamline-plump:email-attachment-document" />}
                                                onClick={openFileAttach.onTrue}
                                            >
                                                File chứng từ
                                            </Button>
                                            {selectedContract.status !== 1 &&
                                                <Button
                                                    variant="contained"
                                                    startIcon={<Iconify icon="solar:document-add-bold" />}
                                                    endIcon={<Iconify icon={open ? 'solar:double-alt-arrow-up-bold-duotone' : 'solar:double-alt-arrow-down-bold-duotone'} />}
                                                    onClick={handleClickLP}
                                                >
                                                    Lập phiếu
                                                </Button>
                                            }
                                            <Button
                                                variant="contained"
                                                startIcon={<Iconify icon="mdi:chart-line" />}
                                                endIcon={<Iconify icon={openTD ? 'solar:double-alt-arrow-up-bold-duotone' : 'solar:double-alt-arrow-down-bold-duotone'} />}
                                                onClick={handleClickTD}
                                            >
                                                Theo dõi
                                            </Button>
                                            <Button
                                                variant="contained"
                                                startIcon={<Iconify icon="solar:copy-linear" />}
                                                type="button"
                                                onClick={() => {
                                                    onClose();
                                                    copyContract(selectedContract);
                                                }}
                                            >
                                                Copy hợp đồng
                                            </Button>
                                            {selectedContract.status !== 1 &&
                                                <Button variant="contained"
                                                    onClick={() => {
                                                        onClose();
                                                        createSupplierContract();
                                                    }}
                                                    startIcon={<Iconify icon="lsicon:report-filled" />}
                                                >
                                                    Lập hợp đồng
                                                </Button>
                                            }
                                            <Button
                                                variant="contained"
                                                startIcon={<Iconify icon="material-symbols:contract-edit-outline-sharp" />}
                                                endIcon={<Iconify icon={openBB ? 'solar:double-alt-arrow-up-bold-duotone' : 'solar:double-alt-arrow-down-bold-duotone'} />}
                                                onClick={handleClickBB}
                                            >
                                                Tạo biên bản
                                            </Button>
                                        </Stack>
                                    </Box>
                                </Stack>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleCloseLP}
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                                >
                                    <MenuItem onClick={() => { handleCloseLP(); openReceipt.onTrue(); }}>
                                        <Iconify icon="streamline-ultimate:receipt-bold" style={{ marginRight: 8 }} />
                                        Phiếu thu
                                    </MenuItem>
                                    <MenuItem onClick={() => { handleCloseLP(); openSpend.onTrue(); }}>
                                        <Iconify icon="hugeicons:payment-02" style={{ marginRight: 8 }} />
                                        Phiếu chi
                                    </MenuItem>
                                    <MenuItem onClick={() => { handleCloseLP(); openWareHouse.onTrue(); }}>
                                        <Iconify icon="lsicon:out-of-warehouse-filled" style={{ marginRight: 8 }} />
                                        Phiếu xuất kho
                                    </MenuItem>
                                </Menu>
                                <Menu
                                    anchorEl={anchorTD}
                                    open={openTD}
                                    onClose={handleCloseTD}
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                                    PaperProps={{
                                        sx: {
                                            width: anchorTD ? anchorTD.offsetWidth : undefined,
                                        },
                                    }}
                                >
                                    <MenuItem onClick={handleTDPT}>
                                        <Iconify icon="picon:receive" style={{ marginRight: 8 }} />
                                        Phải thu
                                    </MenuItem>
                                    <MenuItem onClick={handleTDPC}>
                                        <Iconify icon="game-icons:pay-money" style={{ marginRight: 8 }} />
                                        Phải chi
                                    </MenuItem>
                                </Menu>
                                <Menu
                                    anchorEl={anchorBB}
                                    open={openBB}
                                    onClose={handleCloseBB}
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                                    PaperProps={{
                                        sx: {
                                            width: anchorBB ? anchorBB.offsetWidth : undefined,
                                        },
                                    }}
                                >
                                    <MenuItem onClick={onPreviewReport}>
                                        <Iconify icon="mdi:file-document-edit" style={{ marginRight: 8 }} />
                                        BB nghiệm thu
                                    </MenuItem>
                                    <MenuItem onClick={onPreviewLiquidation} disabled={createReportLoad}>
                                        <Iconify icon="mdi:file-document-check-outline" style={{ marginRight: 8 }} />
                                        BB thanh lý
                                    </MenuItem>
                                </Menu>
                            </Stack>
                        </DialogActions>
                        <Box sx={{ flexGrow: 1, height: 1, overflow: 'hidden' }}>
                            {pdfRef.current}
                        </Box>
                        <ContractAttachMent
                            selectedContract={selectedContract}
                            open={openFileAttach.value}
                            onClose={openFileAttach.onFalse}
                        />
                        <ContractReceipt
                            selectedContract={selectedContract}
                            open={openReceipt.value}
                            onClose={openReceipt.onFalse}
                            refetchFns={refetchFns}
                            refetchFns2={refetchFns2}
                        />
                        <ContractSpend
                            selectedContract={selectedContract}
                            open={openSpend.value}
                            onClose={openSpend.onFalse}
                            refetchFns={refetchFns}
                            refetchFns2={refetchFns2}
                        />
                        <ContractWareHouse
                            selectedContract={selectedContract}
                            open={openWareHouse.value}
                            onClose={openWareHouse.onFalse}
                            refetchFns={refetchFns}
                            refetchFns2={refetchFns2}
                        />
                    </>
                ) : null}
            </Dialog>
            <ContractSendMail
                openSendMail={openSendMail}
                email={selectedContract.customerEmail}
                contract={selectedContract}
                currentContract={contract}
            />
            <ContractFollow
                openForm={openFollow}
                selectedContract={selectedContract}
                onExposeRefetch={(fns) => setRefetchFns(fns)}
            />

            <ContractFollowSpend
                openForm={openFollowSpend}
                selectedContract={selectedContract}
                onExposeRefetch={(fns) => setRefetchFns2(fns)}
            />
        </>
    );
}