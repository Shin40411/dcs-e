import {
    Box,
    Card,
    CardProps,
    MenuItem,
    MenuList,
    Stack,
    Tooltip,
    Typography
} from "@mui/material";
import { UseBooleanReturn, usePopover } from "minimal-shared/hooks";
import { CustomPopover } from "src/components/custom-popover";
import { Iconify } from "src/components/iconify";
import { IQuotationData, IQuotationItem } from "src/types/quotation";
import { fCurrency } from "src/utils/format-number";
import { useGetQuotation } from "src/actions/quotation";
import { useEffect, useState } from "react";
import { useSettingsContext } from "src/components/settings";
import { QuotationPreview } from "./quotation-preview";

type Props = CardProps & {
    openDeleteDialog: UseBooleanReturn;
    setId: (value: any) => void;
    quotate: IQuotationItem;
    onViewDetails: () => void;
    onEditing: () => void;
};

// const statusMap = {
//     0: { label: "Bỏ qua", color: "default", icon: "fluent-color:dismiss-circle-16" },
//     1: { label: "Nháp", color: "info", icon: "material-symbols:draft" },
//     2: { label: "Đang thực hiện", color: "warning", icon: "line-md:uploading-loop" },
//     3: { label: "Đã hoàn thành", color: "success", icon: "fluent-color:checkmark-circle-16" },
// } as const;

const statusMap: { [key: number]: [string, string] } = {
    0: ["Bỏ qua", "fluent-color:dismiss-circle-16"],
    1: ["Nháp", "material-symbols:draft"],
    2: ["Đang thực hiện", "streamline-pixel:interface-essential-waiting-hourglass-loading"],
    3: ["Đã hoàn thành", "fluent-color:checkmark-circle-16"],
}

export function QuotationItem({ openDeleteDialog, setId, quotate, onViewDetails, onEditing, sx, ...other }: Props) {
    const menuActions = usePopover();
    const settings = useSettingsContext();
    const statusValue = quotate.status;

    const { quotation } = useGetQuotation({
        quotationId: quotate?.id,
        pageNumber: 1,
        pageSize: 999,
        options: { enabled: !!quotate?.id }
    });

    const [currentQuotation, setSelectQuotation] = useState<IQuotationData>();
    useEffect(() => {
        if (quotation) {
            setSelectQuotation(quotation);
        }
    }, [quotation]);

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
                <MenuItem
                    onClick={() => {
                        onViewDetails();
                        menuActions.onClose();
                    }}
                    sx={{ display: { xs: 'none', sm: 'none', md: 'inline-flex' } }}
                >
                    <Iconify icon="solar:eye-bold" />
                    Xem đơn đặt hàng
                </MenuItem>

                {/* <PDFDownloadLink
                    document={
                        <QuotationPdfDocument
                            invoice={quotate}
                            currentStatus={statusMap[quotate.status]}
                            currentQuotation={currentQuotation}
                        />
                    }
                    fileName={`${quotate?.quotationNo}.pdf`}
                    style={{ textDecoration: "none" }}
                >
                    {({ loading }) => (
                        <MenuItem onClick={menuActions.onClose}>
                            <Iconify icon="eva:cloud-download-fill" />
                            {loading ? "Đang tạo..." : "Tải xuống"}
                        </MenuItem>
                    )}
                </PDFDownloadLink> */}

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
                        setId(quotate.id);
                    }}
                    sx={{ color: "error.main" }}
                >
                    <Iconify icon="solar:trash-bin-trash-bold" />
                    Xóa
                </MenuItem>
            </MenuList>
        </CustomPopover>
    );

    const totalDirection = settings.state.navLayout === 'vertical' ? 'column' : 'row';

    const darkMode = settings.state.colorScheme;

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
                    bgcolor: darkMode === 'light' ? "#fdfdfd" : 'unset',
                    boxShadow: 3,
                    transition: "0.2s",
                    maxHeight: { lg: 240, md: 250, sm: 170 },
                    "&:hover": { boxShadow: 6, transform: "scale(1.02)" },
                    ...sx,
                }}
                {...other}
            >
                <Box sx={{ position: "absolute", top: 8, right: 8, zIndex: 9 }}>
                    <Tooltip title={statusMap[statusValue][0]}>
                        <Box component="span" sx={{ display: 'inline-flex' }}>
                            <Iconify icon={statusMap[statusValue][1]} />
                        </Box>
                    </Tooltip>
                </Box>
                <QuotationPreview quotation={quotate} />
                <Stack direction={{ md: totalDirection, sm: "column" }} justifyContent={'space-around'} alignContent={"center"} py={1} spacing={1}>
                    <Stack width="50%" direction={"row"} alignContent={"center"} justifyContent={"space-between"}>
                        <Box
                            sx={{
                                pl: 2.5,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                justifyContent: 'flex-end',
                            }}
                        >
                            <Iconify icon="ri:contract-fill" sx={{ width: { md: 14, sm: 15, xs: 13 } }} />
                            <Tooltip title={`Đơn đặt hàng số: ${quotate.quotationNo}`}>
                                <Typography
                                    variant="body2"
                                    fontSize={{ lg: 10, md: 10, sm: 9.5, xs: 9 }}
                                    fontWeight={700}
                                    sx={{
                                        maxWidth: { xl: 100, lg: 100, md: 100, sm: 95 },
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        display: "block",
                                    }}
                                >
                                    {quotate.quotationNo}
                                </Typography>
                            </Tooltip>

                        </Box>
                    </Stack>
                    <Stack width="50%" direction={"row"} alignContent={"center"}>
                        <Box
                            sx={{
                                pl: 2.5,
                                pr: { md: 0, sm: 2.5 },
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                            }}
                        >
                            <Iconify icon="stash:badge-dollar-solid" sx={{ width: { md: 16, sm: 15, xs: 14 } }} />
                            <Tooltip title={`Tổng cộng ${fCurrency(quotate.totalAmount)}`}>
                                <Typography
                                    variant="body2"
                                    fontSize={{ lg: 10, md: 10, sm: 9.5, xs: 9 }}
                                    fontWeight={700}
                                    sx={{
                                        maxWidth: { xl: 160, lg: 100, md: 100 },
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        display: "block",
                                    }}
                                >
                                    {fCurrency(quotate.totalAmount)}
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

