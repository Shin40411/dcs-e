import { Box, Card, CardProps, MenuItem, MenuList, Stack, Tooltip, Typography } from "@mui/material";
import { UseBooleanReturn, usePopover } from "minimal-shared/hooks";
import { CustomPopover } from "src/components/custom-popover";
import { Iconify } from "src/components/iconify";
import { IContractItem } from "src/types/contract";
import { ContractPreview } from "./contract-preview";
import { fCurrency } from "src/utils/format-number";

type Props = CardProps & {
    openDeleteDialog: UseBooleanReturn;
    setId: (value: any) => void;
    contract: IContractItem;
    onViewDetails: () => void;
    onEditing: () => void;
};

// const statusMap: { [key: number]: string } = {
//     0: "Bỏ qua",
//     1: "Nháp",
//     2: "Đang thực hiện",
//     3: "Đã thanh toán",
// }

export function ContractItem({ openDeleteDialog, setId, contract, onViewDetails, onEditing, sx, ...other }: Props) {
    const menuActions = usePopover();

    const renderMenuActions = () => (
        <CustomPopover
            open={menuActions.open}
            anchorEl={menuActions.anchorEl}
            onClose={menuActions.onClose}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "left",
            }}
            slotProps={{
                arrow: { placement: "left-top" },
            }}
        >
            <MenuList>
                {/* <MenuItem
                    onClick={() => {
                        onViewDetails();
                        menuActions.onClose();
                    }}
                >
                    <Iconify icon="solar:eye-bold" />
                    Xem báo giá
                </MenuItem> */}

                {/* <MenuItem
                    component={PDFDownloadLink}
                    document={
                        <QuotationPdfDocument
                            invoice={quotate}
                            currentStatus={statusMap[quotate.status]}
                            currentQuotation={currentQuotation}
                        />}
                    fileName={quotate?.quotationNo}
                    onClick={menuActions.onClose}
                    style={{ textDecoration: 'none' }}
                >
                    <Iconify icon="eva:cloud-download-fill" />
                    Tải xuống
                </MenuItem> */}


                <MenuItem onClick={() => {
                    onEditing();
                    menuActions.onClose();
                }
                }>
                    <Iconify icon="solar:pen-bold" />
                    Chỉnh sửa
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        menuActions.onClose();
                        openDeleteDialog.onTrue();
                        setId(contract.id);
                    }}
                    sx={{ color: "error.main" }}
                >
                    <Iconify icon="solar:trash-bin-trash-bold" />
                    Xóa
                </MenuItem>
            </MenuList>
        </CustomPopover>
    );

    return (
        <>
            <Card
                onClick={menuActions.onOpen}
                sx={{
                    position: "relative",
                    cursor: 'pointer',
                    borderRadius: 1,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    aspectRatio: { md: "210/297", sm: "210/200", xs: "210/200" },
                    bgcolor: "#fdfdfd",
                    boxShadow: 3,
                    transition: "0.2s",
                    maxHeight: { lg: 250, md: 250, sm: 170 },
                    "&:hover": { boxShadow: 6, transform: "scale(1.02)" },
                    ...sx,
                }}
                {...other}
            >
                <ContractPreview contract={contract} />
                <Stack direction={"column"} alignContent={"center"} py={1} spacing={1}>
                    <Stack direction={"row"} alignContent={"center"} justifyContent={"space-between"}>
                        <Box
                            sx={{
                                pl: 2.5,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                justifyContent: 'flex-end',
                            }}
                        >
                            <Iconify icon="ri:contract-fill" color="#000cff" />
                            <Tooltip title={`Hợp đồng số ${contract.contractNo}`}>
                                <Typography
                                    variant="body2"
                                    fontSize={{ lg: 12, md: 10 }}
                                    fontWeight={700}
                                    sx={{
                                        maxWidth: { lg: 160, md: 100, sm: 90 },
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        display: "block",
                                    }}
                                >
                                    {contract.contractNo}
                                </Typography>
                            </Tooltip>

                        </Box>

                    </Stack>
                    <Stack direction={"row"} alignContent={"center"}>
                        <Box
                            sx={{
                                pl: 2.5,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                justifyContent: 'flex-end',
                            }}
                        >
                            <Iconify icon="carbon:cost-total" />
                            <Tooltip title={`Tổng cộng ${fCurrency(contract.total)}`}>
                                <Typography
                                    variant="body2"
                                    fontSize={{ lg: 12, md: 10 }}
                                    fontWeight={700}
                                    sx={{
                                        maxWidth: { lg: 160, md: 100, sm: 90 },
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        display: "block",
                                    }}
                                >
                                    {fCurrency(contract.total)}
                                </Typography>
                            </Tooltip>
                        </Box>
                    </Stack>
                </Stack>
            </Card >

            {renderMenuActions()}
        </>
    );
}
