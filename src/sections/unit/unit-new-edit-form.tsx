import { Box, Button, CardActions, CardContent, Dialog, DialogContent, DialogTitle, Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import { Field, Form } from "src/components/hook-form";

type Props = {
    open: boolean;
    onClose: () => void;
    selectedId?: number;
    page: number;
    rowsPerPage: number;
};

export function UnitNewEditForm({ open, onClose, selectedId, page, rowsPerPage }: Props) {
    const methods = useForm();
    const renderDetails = () => (
        <Stack spacing={3} pt={1}>
            <Field.Text
                name="name"
                label="Tên đơn vị tính"
                helperText="Nhập tên đơn vị tính"
                sx={{ flex: 1 }}
            />
        </Stack>
    );
    const renderActions = () => (
        <Box sx={{ width: '100%' }}>
            <Stack direction="row" spacing={2} width="100%">
                <Button
                    variant="outlined"
                    color="inherit"
                    onClick={onClose}
                    fullWidth
                >
                    Hủy bỏ
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    sx={{ ml: 1 }}
                    // loading={isSubmitting}
                    fullWidth
                >
                    {/* {!currentProduct ? 'Tạo mới' : 'Lưu thay đổi'} */}
                    Tạo mới
                </Button>
            </Stack>
        </Box>
    );

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth={"sm"} scroll={'paper'}>
            <DialogTitle>
                Tạo đơn vị tính
                {/* {currentUnit ? 'Chỉnh sửa đơn vị tính' : 'Tạo đơn vị tính'} */}
            </DialogTitle>
            <DialogContent dividers={true}>
                <Form methods={methods} onSubmit={() => { }}>
                    <CardContent sx={{ pt: 0, px: 0 }}>
                        <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
                            {renderDetails()}
                        </Stack>
                    </CardContent>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }} />
                    <CardActions>
                        {renderActions()}
                    </CardActions>
                </Form>
            </DialogContent>
        </Dialog >
    )
}