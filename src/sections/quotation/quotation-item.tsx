import {
    Box,
    Card,
    CardProps,
    Chip,
    Divider,
    IconButton,
    List,
    ListItem,
    MenuItem,
    MenuList,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
    Typography
} from "@mui/material";
import { UseBooleanReturn, usePopover } from "minimal-shared/hooks";
import { useEffect, useState } from "react";
import { useGetQuotation } from "src/actions/quotation";
import { CustomPopover } from "src/components/custom-popover";
import { Iconify } from "src/components/iconify";
import { Logo } from "src/components/logo";
import { IQuotationData, IQuotationItem } from "src/types/quotation";
import { fCurrency, fRenderTextNumber } from "src/utils/format-number";
import { capitalizeFirstLetter } from "src/utils/format-string";
import { fDate } from "src/utils/format-time-vi";
import { QuotationPreview } from "./quotation-preview";

type Props = CardProps & {
    openDeleteDialog: UseBooleanReturn;
    setId: (value: any) => void;
    quotate: IQuotationItem;
    onViewDetails: () => void;
    onEditing: () => void;
};

const statusMap = {
    0: { label: "Bỏ qua", color: "default", icon: "fluent-color:dismiss-circle-16" },
    1: { label: "Nháp", color: "info", icon: "material-symbols:draft" },
    2: { label: "Đang thực hiện", color: "warning", icon: "line-md:uploading-loop" },
    3: { label: "Đã hoàn thành", color: "success", icon: "fluent-color:checkmark-circle-16" },
} as const;

export function QuotationItem({ openDeleteDialog, setId, quotate, onViewDetails, onEditing, sx, ...other }: Props) {
    const menuActions = usePopover();

    const statusValue = quotate.status;
    const statusInfo = statusMap[statusValue as keyof typeof statusMap] ?? statusMap[0];

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
                >
                    <Iconify icon="solar:eye-bold" />
                    Xem trước
                </MenuItem>

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
                <QuotationPreview quotation={quotate} />
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
                            <Tooltip title={`Báo giá số ${quotate.quotationNo}`}>
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
                                    {quotate.quotationNo}
                                </Typography>
                            </Tooltip>

                        </Box>
                        {/* <IconButton
                            onClick={menuActions.onOpen}
                        >
                            <Iconify icon="eva:more-vertical-fill" />
                        </IconButton> */}
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
                            <Tooltip title={`Tổng cộng ${fCurrency(quotate.totalAmount)}`}>
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

