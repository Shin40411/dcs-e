import {
    Box,
    Card,
    CardProps,
    Chip,
    Divider,
    IconButton,
    MenuItem,
    MenuList,
    Stack,
    Typography
} from "@mui/material";
import { usePopover } from "minimal-shared/hooks";
import { CustomPopover } from "src/components/custom-popover";
import { Iconify } from "src/components/iconify";
import { IQuotationItem } from "src/types/quotation";
import { fCurrency } from "src/utils/format-number";
import { fDate } from "src/utils/format-time-vi";

type Props = CardProps & {
    quotate: IQuotationItem;
    onViewDetails: () => void;
};

const statusMap = {
    0: { label: "Bỏ qua", color: "warning", icon: "fluent-color:dismiss-circle-16" },
    1: { label: "Chờ khách chốt", color: "info", icon: "fluent-color:clock-16" },
    2: { label: "Hết hiệu lực", color: "error", icon: "fluent-color:error-circle-16" },
    3: { label: "Đang thực hiện", color: "primary", icon: "fluent-color:arrow-sync-16" },
    4: { label: "Đã hoàn thành", color: "success", icon: "fluent-color:checkmark-circle-16" },
} as const;

export function QuotationItem({ quotate, onViewDetails, sx, ...other }: Props) {
    const menuActions = usePopover();

    const statusInfo = statusMap[quotate.status as keyof typeof statusMap];

    const renderMenuActions = () => (
        <CustomPopover
            open={menuActions.open}
            anchorEl={menuActions.anchorEl}
            onClose={menuActions.onClose}
            slotProps={{ arrow: { placement: "right-top" } }}
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

                <MenuItem onClick={() => menuActions.onClose()}>
                    <Iconify icon="solar:pen-bold" />
                    Chỉnh sửa
                </MenuItem>

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
                    <Typography variant="subtitle2">#{quotate.quotationNo}</Typography>
                    <Chip
                        size="small"
                        color={statusInfo.color}
                        icon={<Iconify icon={statusInfo.icon} />}
                        label={statusInfo.label}
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
                                {quotate.customerName}
                            </Typography>
                        </Stack>

                        <Stack direction="row" spacing={1} alignItems="center">
                            <Iconify
                                width={18}
                                icon="solar:calendar-bold"
                                sx={{ color: "text.secondary" }}
                            />
                            <Typography variant="body2">
                                Ngày lập: {fDate(quotate.createdDate)}
                            </Typography>
                        </Stack>

                        <Stack direction="row" spacing={1} alignItems="center">
                            <Iconify
                                width={18}
                                icon="solar:user-rounded-bold"
                                sx={{ color: "text.secondary" }}
                            />
                            <Typography variant="body2">NV phụ trách: {quotate.seller || 'Chưa có'}</Typography>
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
                        {fCurrency(quotate.totalAmount)}
                    </Typography>
                </Box>
            </Card>

            {renderMenuActions()}
        </>
    );
}

