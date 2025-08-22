import { Divider, Drawer, DrawerProps, Stack, Typography } from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { ICategoryItem } from "src/types/category";
import { fDateTime } from "src/utils/format-time-vi";

type Props = DrawerProps & {
    categoryItem: ICategoryItem;
    onClose: () => void;
};

export function CategoryDetails({ categoryItem, open, onClose, ...other }: Props) {
    return (
        <Drawer
            open={open}
            onClose={onClose}
            anchor="right"
            slotProps={{
                backdrop: { invisible: true },
                paper: { sx: { width: 600 } },
            }}
            {...other}
        >
            <Scrollbar>
                <Stack spacing={3} sx={{ p: 3, bgcolor: 'background.neutral' }}>
                    <Typography variant="h6">Chi tiết nhóm sản phẩm</Typography>
                </Stack>

                <Stack spacing={2.5} sx={{ p: 3 }}>
                    {/* Tên nhóm */}
                    <Stack direction="row" spacing={2}>
                        <Typography variant="subtitle2" sx={{ minWidth: 150, color: 'text.secondary' }}>
                            Tên nhóm
                        </Typography>
                        <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                            {categoryItem?.name}
                        </Typography>
                    </Stack>
                    <Divider sx={{ borderStyle: 'dashed' }} />

                    {/* Mô tả */}
                    <Stack direction="row" spacing={2}>
                        <Typography variant="subtitle2" sx={{ minWidth: 150, color: 'text.secondary' }}>
                            Mô tả
                        </Typography>
                        <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                            {categoryItem?.description}
                        </Typography>
                    </Stack>
                    <Divider sx={{ borderStyle: 'dashed' }} />

                    {/* VAT */}
                    <Stack direction="row" spacing={2}>
                        <Typography variant="subtitle2" sx={{ minWidth: 150, color: 'text.secondary' }}>
                            VAT
                        </Typography>
                        <Typography variant="body1">
                            {categoryItem?.vat ?? '—'}
                        </Typography>
                    </Stack>
                    <Divider sx={{ borderStyle: 'dashed' }} />

                    {/* Trạng thái */}
                    <Stack direction="row" spacing={2}>
                        <Typography variant="subtitle2" sx={{ minWidth: 150, color: 'text.secondary' }}>
                            Trạng thái
                        </Typography>
                        <Typography
                            variant="body1"
                            color={categoryItem?.status ? 'success.main' : 'error.main'}
                        >
                            {categoryItem?.status ? 'Đang hoạt động' : 'Không hoạt động'}
                        </Typography>
                    </Stack>
                    <Divider sx={{ borderStyle: 'dashed' }} />

                    {/* Ngày tạo */}
                    <Stack direction="row" spacing={2}>
                        <Typography variant="subtitle2" sx={{ minWidth: 150, color: 'text.secondary' }}>
                            Ngày tạo
                        </Typography>
                        <Typography variant="body1">
                            {fDateTime(categoryItem?.createdAt)}
                        </Typography>
                    </Stack>
                </Stack>
            </Scrollbar>
        </Drawer>
    );
}
