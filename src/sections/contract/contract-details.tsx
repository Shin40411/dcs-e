import { Box, Button, Collapse, Dialog, DialogActions, DialogContent, Drawer, IconButton, Menu, MenuItem, Skeleton, Stack, Typography } from "@mui/material";
import { JSX, MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import { useGetContract } from "src/actions/contract";
import { Iconify } from "src/components/iconify";
import { IContractData, IContractItem } from "src/types/contract";
import { ContractPDFViewer } from "./contract-pdf";
import ContractAttachMent from "./contract-attachment";
import { useBoolean } from "minimal-shared/hooks";
import ContractSendMail from "./contract-sendmail";

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

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [anchorTD, setAnchorTD] = useState<null | HTMLElement>(null);
    const [anchorBB, setAnchorBB] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const openTD = Boolean(anchorTD);
    const openBB = Boolean(anchorBB);

    const openFileAttach = useBoolean();

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

    const handleToggle = () => {
        setShowActions((prev) => !prev);
    };

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
            />
        );
        pdfContractIdRef.current = selectedContract.id;
    }

    return (
        <>
            <Dialog open={openDetail} onClose={onClose} fullScreen>
                <DialogActions sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 2 }}>
                    <Stack direction="column" width="100%" alignItems="center">
                        <Stack direction="row" width="100%" justifyContent="space-between">
                            <Button onClick={onClose}>Đóng</Button>
                            <Stack direction="row" flexWrap="wrap" justifyContent="flex-end" gap={4} width="100%" mt={2}>
                                <Button
                                    variant="contained"
                                    startIcon={<Iconify icon="streamline-pixel:send-email" />}
                                    onClick={handleToggle}
                                >
                                    {showActions ? 'Hủy' : 'Gửi hợp đồng'}
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={<Iconify icon="streamline-plump:email-attachment-document" />}
                                    onClick={openFileAttach.onTrue}
                                >
                                    File chứng từ
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={<Iconify icon="solar:document-add-bold" />}
                                    endIcon={<Iconify icon={open ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />}
                                    onClick={handleClickLP}
                                >
                                    Lập phiếu
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={<Iconify icon="mdi:chart-line" />}
                                    endIcon={<Iconify icon={openTD ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />}
                                    onClick={handleClickTD}
                                >
                                    Theo dõi
                                </Button>
                                <Button variant="contained" startIcon={<Iconify icon="solar:copy-linear" />}>Copy hợp đồng</Button>
                                <Button variant="contained" startIcon={<Iconify icon="lsicon:report-filled" />}>Lập hợp đồng </Button>
                                <Button
                                    variant="contained"
                                    startIcon={<Iconify icon="material-symbols:contract-edit-outline-sharp" />}
                                    endIcon={<Iconify icon={openBB ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />}
                                    onClick={handleClickBB}
                                >
                                    Tạo biên bản
                                </Button>
                            </Stack>
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
                        {/* <Collapse sx={{ width: '100%' }} in={showActions} timeout="auto" unmountOnExit>
                        </Collapse> */}
                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleCloseLP}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                        // PaperProps={{
                        //     sx: {
                        //         width: anchorEl ? anchorEl.offsetWidth : undefined,
                        //     },
                        // }}
                        >
                            <MenuItem onClick={handleCloseLP}>
                                <Iconify icon="streamline-ultimate:receipt-bold" style={{ marginRight: 8 }} />
                                Phiếu thu
                            </MenuItem>
                            <MenuItem onClick={handleCloseLP}>
                                <Iconify icon="hugeicons:payment-02" style={{ marginRight: 8 }} />
                                Phiếu chi
                            </MenuItem>
                            <MenuItem onClick={handleCloseLP}>
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
                            <MenuItem onClick={handleCloseTD}>
                                <Iconify icon="picon:receive" style={{ marginRight: 8 }} />
                                Phải thu
                            </MenuItem>
                            <MenuItem onClick={handleCloseTD}>
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
                            <MenuItem onClick={handleCloseBB}>
                                <Iconify icon="mdi:file-document-edit" style={{ marginRight: 8 }} />
                                BB nghiệm thu
                            </MenuItem>
                            <MenuItem onClick={handleCloseBB}>
                                <Iconify icon="mdi:file-document-check-outline" style={{ marginRight: 8 }} />
                                BB thanh lý
                            </MenuItem>
                        </Menu>
                    </Stack>
                    <Collapse sx={{ width: '100%' }} in={showActions} timeout="auto" unmountOnExit>
                        <ContractSendMail
                            email={selectedContract.customerEmail}
                            contractId={selectedContract.id}
                        />
                    </Collapse>
                </DialogActions>
                <Box sx={{ flexGrow: 1, height: 1, overflow: 'hidden' }}>
                    {pdfRef.current}
                </Box>
                <ContractAttachMent open={openFileAttach.value} onClose={openFileAttach.onFalse} />
            </Dialog>
        </>
    );
}