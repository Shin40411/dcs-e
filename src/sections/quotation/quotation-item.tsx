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
    Tooltip,
    Typography
} from "@mui/material";
import { UseBooleanReturn, usePopover } from "minimal-shared/hooks";
import { CustomPopover } from "src/components/custom-popover";
import { Iconify } from "src/components/iconify";
import { IQuotationItem } from "src/types/quotation";
import { fCurrency } from "src/utils/format-number";
import { fDate } from "src/utils/format-time-vi";

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
                sx={{
                    position: "relative",
                    borderRadius: 2,
                    overflow: "hidden",
                    ...sx,
                }}
                {...other}
            >
                <IconButton
                    onClick={menuActions.onOpen}
                    sx={{ position: "absolute", top: 8, right: 0 }}
                >
                    <Iconify icon="eva:more-vertical-fill" />
                </IconButton>

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
                    <Tooltip title={statusInfo.label} sx={{ width: '100px', cursor: 'pointer' }}>
                        <Chip
                            size="small"
                            color={statusInfo.color}
                            icon={<Iconify icon={statusInfo.icon} />}
                            label={statusInfo.label}
                        />
                    </Tooltip>
                </Box>

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

                <Box
                    sx={{
                        px: 3,
                        py: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Stack direction="row" gap={1}>
                        <Iconify icon="fluent-mdl2:total" />
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                            Tổng cộng
                        </Typography>
                    </Stack>
                    <Typography variant="subtitle1" color="primary">
                        {fCurrency(quotate.totalAmount)}
                    </Typography>
                </Box>
            </Card>

            {renderMenuActions()}
        </>
    );
}

