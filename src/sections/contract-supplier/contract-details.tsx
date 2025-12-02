import { Box, Button, Dialog, DialogActions, Menu, MenuItem, Skeleton, Stack } from "@mui/material";
import { JSX, MouseEvent, useEffect, useRef, useState } from "react";
import { Iconify } from "src/components/iconify";
import { useBoolean } from "minimal-shared/hooks";
import { IContractSupplyItem } from "src/types/contractSupplier";
import { useGetSupplierContract } from "src/actions/contractSupplier";
import { ContractPDFViewer } from "./contract-pdf";
import ContractSendMail from "./contract-sendmail";
import { ContractSpend } from "./contract-spend";
import { toast } from "sonner";
import { ContractWareHouse } from "./contract-warehouse";

type Props = {
    selectedContract: IContractSupplyItem;
    openDetail: boolean;
    copyContract: (obj: IContractSupplyItem) => void;
    onClose: () => void;
}

export function ContractDetails({ selectedContract, openDetail, copyContract, onClose }: Props) {
    const { contractRes: contract, contractLoading, contractError } = useGetSupplierContract({
        contractId: selectedContract?.id,
        pageNumber: 1,
        pageSize: 999,
        options: { enabled: !!selectedContract?.id }
    });

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [anchorTD, setAnchorTD] = useState<null | HTMLElement>(null);
    const [anchorBB, setAnchorBB] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const openTD = Boolean(anchorTD);
    const openBB = Boolean(anchorBB);

    const openFileAttach = useBoolean();
    const openReceipt = useBoolean();
    const openWareHouse = useBoolean();

    const openSendMail = useBoolean();

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

    const handleCloseBB = () => {
        setAnchorBB(null);
    };
    // const onPreviewReport = () => {
    //     const params = new URLSearchParams({
    //         id: String(selectedContract.id),
    //         contractNo: selectedContract.contractNo,
    //         customerID: String(selectedContract.customerID),
    //         customerName: selectedContract.customerName,
    //         customerEmail: selectedContract.customerEmail,
    //         customerPhone: selectedContract.customerPhone,
    //         customerAddress: selectedContract.customerAddress,
    //         customerTaxCode: selectedContract.customerTaxCode,
    //         companyName: selectedContract.companyName,
    //         customerBank: selectedContract.customerBank,
    //         customerBankNo: selectedContract.customerBankNo,
    //         position: selectedContract.position,
    //         signatureDate: selectedContract.signatureDate,
    //         deliveryAddress: selectedContract.deliveryAddress,
    //         deliveryTime: selectedContract.deliveryTime,
    //         downPayment: String(selectedContract.downPayment),
    //         nextPayment: String(selectedContract.nextPayment),
    //         lastPayment: String(selectedContract.lastPayment),
    //         total: String(selectedContract.total),
    //         copiesNo: String(selectedContract.copiesNo),
    //         keptNo: String(selectedContract.keptNo),
    //         status: String(selectedContract.status),
    //         createDate: selectedContract.createDate,
    //         createdBy: selectedContract.createdBy,
    //         modifyDate: selectedContract.modifyDate,
    //         modifiedBy: selectedContract.modifiedBy,
    //         note: selectedContract.note,
    //         seller: selectedContract.seller,
    //     } as Record<string, string>);
    //     const queryString = params.toString();
    //     window.open(`${paths.report}?${queryString}`, '_blank');
    // }


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
            <Dialog open={openDetail && !contractError} onClose={() => { onClose(); }} fullScreen>
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
                                    <Button onClick={() => { onClose(); }}>Đóng</Button>
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
                                            {/* <Button
                                                variant="contained"
                                                startIcon={<Iconify icon="streamline-plump:email-attachment-document" />}
                                                onClick={openFileAttach.onTrue}
                                            >
                                                File chứng từ
                                            </Button> */}
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
                                            {/* <Button
                                        variant="contained"
                                        startIcon={<Iconify icon="mdi:chart-line" />}
                                        endIcon={<Iconify icon={openTD ? 'solar:double-alt-arrow-up-bold-duotone' : 'solar:double-alt-arrow-down-bold-duotone'} />}
                                        onClick={handleClickTD}
                                    >
                                        Theo dõi
                                    </Button> */}
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
                                            {/* <Button
                                                variant="contained"
                                                startIcon={<Iconify icon="material-symbols:contract-edit-outline-sharp" />}
                                                endIcon={<Iconify icon={openBB ? 'solar:double-alt-arrow-up-bold-duotone' : 'solar:double-alt-arrow-down-bold-duotone'} />}
                                                onClick={handleClickBB}
                                            >
                                                Tạo biên bản
                                            </Button> */}
                                        </Stack>
                                    </Box>
                                    <Box>
                                        {/* <Button
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
                                </Button> */}
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
                                        <Iconify icon="hugeicons:payment-02" style={{ marginRight: 8 }} />
                                        Phiếu chi
                                    </MenuItem>
                                    <MenuItem onClick={() => { handleCloseLP(); openWareHouse.onTrue(); }}>
                                        <Iconify icon="lsicon:warehouse-into-outline" style={{ marginRight: 8 }} />
                                        Phiếu nhập kho
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
                                    <MenuItem onClick={handleCloseTD}>
                                        <Iconify icon="game-icons:pay-money" style={{ marginRight: 8 }} />
                                        Phải chi
                                    </MenuItem>
                                </Menu>
                                {/* <Menu
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
                            <MenuItem onClick={handleCloseBB}>
                                <Iconify icon="mdi:file-document-check-outline" style={{ marginRight: 8 }} />
                                BB thanh lý
                            </MenuItem>
                        </Menu> */}
                            </Stack>
                        </DialogActions>
                        <Box sx={{ flexGrow: 1, height: 1, overflow: 'hidden' }}>
                            {pdfRef.current}
                        </Box>
                        <ContractSpend
                            selectedContract={selectedContract}
                            open={openReceipt.value}
                            onClose={openReceipt.onFalse}
                        />
                        {/* <ContractAttachMent
                    selectedContract={selectedContract}
                    open={openFileAttach.value}
                    onClose={openFileAttach.onFalse}
                        />
                        */}
                        <ContractWareHouse
                            selectedContract={selectedContract}
                            open={openWareHouse.value}
                            onClose={openWareHouse.onFalse}
                        />
                    </>
                ) : null}
            </Dialog>

            <ContractSendMail
                openSendMail={openSendMail}
                email={selectedContract.supplierEmail}
                contract={selectedContract}
                currentContract={contract}
            />

        </>
    );
}