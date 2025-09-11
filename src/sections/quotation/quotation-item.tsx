import { Box, Card, CardProps, Chip, Divider, IconButton, ListItemText, MenuItem, MenuList, Stack, Typography } from "@mui/material";
import { usePopover } from "minimal-shared/hooks";
import { CustomPopover } from "src/components/custom-popover";
import { Iconify } from "src/components/iconify";
import { IQuotation } from "src/types/quotation";
import { fCurrency } from "src/utils/format-number";
import { fDate } from "src/utils/format-time-vi";

type Props = CardProps & {
    quotate: IQuotation;
    onViewDetails: () => void;
};


export function QuotationItem({ quotate, onViewDetails, sx, ...other }: Props) {
    const menuActions = usePopover();

    const renderMenuActions = () => (
        <CustomPopover
            open={menuActions.open}
            anchorEl={menuActions.anchorEl}
            onClose={menuActions.onClose}
            slotProps={{ arrow: { placement: "right-top" } }}
        >
            <MenuList>
                <li>
                    <MenuItem
                        onClick={() => {
                            onViewDetails();
                            menuActions.onClose();
                        }}
                    >
                        <Iconify icon="solar:eye-bold" />
                        Xem trước báo giá
                    </MenuItem>
                </li>

                <li>
                    <MenuItem onClick={() => menuActions.onClose()}>
                        <Iconify icon="solar:pen-bold" />
                        Chỉnh sửa
                    </MenuItem>
                </li>

                <MenuItem
                    onClick={() => {
                        menuActions.onClose();
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
                sx={{
                    position: "relative",
                    borderRadius: 2,
                    overflow: "hidden",
                    ...sx,
                }}
                {...other}
            >
                {/* nút menu */}
                <IconButton
                    onClick={menuActions.onOpen}
                    sx={{ position: "absolute", top: 8, right: 0 }}
                >
                    <Iconify icon="eva:more-vertical-fill" />
                </IconButton>

                {/* Header: ID + Trạng thái */}
                <Box
                    sx={{
                        px: 3,
                        py: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                        justifyContent: "flex-start",
                        bgcolor: "background.neutral",
                    }}
                >
                    <Typography variant="subtitle2">#{quotate.id}</Typography>
                    <Chip
                        size="small"
                        color={quotate.status ? "success" : "warning"}
                        icon={
                            <Iconify
                                icon={
                                    quotate.status
                                        ? "solar:check-circle-bold"
                                        : "solar:clock-circle-bold"
                                }
                            />
                        }
                        label={quotate.status ? "Đã duyệt" : "Chưa duyệt"}
                    />
                </Box>

                {/* Nội dung chính */}
                <Box sx={{ p: 3 }}>
                    <Stack spacing={1.5}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Iconify
                                width={18}
                                icon="solar:buildings-2-bold"
                                sx={{ color: "text.secondary" }}
                            />
                            <Typography variant="subtitle1" noWrap>
                                {quotate.customer}
                            </Typography>
                        </Stack>

                        <Stack direction="row" spacing={1} alignItems="center">
                            <Iconify
                                width={18}
                                icon="solar:calendar-bold"
                                sx={{ color: "text.secondary" }}
                            />
                            <Typography variant="body2">
                                Ngày lập: {fDate(quotate.date)}
                            </Typography>
                        </Stack>

                        <Stack direction="row" spacing={1} alignItems="center">
                            <Iconify
                                width={18}
                                icon="solar:user-rounded-bold"
                                sx={{ color: "text.secondary" }}
                            />
                            <Typography variant="body2">NV phụ trách: {quotate.staff}</Typography>
                        </Stack>
                    </Stack>
                </Box>

                <Divider />

                {/* Footer: Tổng tiền */}
                <Box
                    sx={{
                        px: 3,
                        py: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        Tổng cộng
                    </Typography>
                    <Typography variant="subtitle1" color="primary">
                        {fCurrency(quotate.total)}
                    </Typography>
                </Box>
            </Card>

            {renderMenuActions()}
        </>
    );
}

