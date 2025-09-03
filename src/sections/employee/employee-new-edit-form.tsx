import { Box, Button, CardActions, CardContent, Dialog, DialogContent, DialogTitle, MenuItem, Stack, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { Field, Form } from "src/components/hook-form";

type Props = {
    open: boolean;
    onClose: () => void;
    selectedId?: number;
    page: number;
    rowsPerPage: number;
};

export function EmployeeNewEditForm({ open, onClose, selectedId, page, rowsPerPage }: Props) {
    const methods = useForm();
    const renderDetails = () => (
        <Stack spacing={3} pt={1}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                <Stack spacing={2} sx={{ flex: 1 }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        <Field.Text
                            name="name"
                            label="Họ và tên"
                            helperText="Nhập họ và tên khách hàng"
                            sx={{ flex: 1 }}
                        />
                        <Field.Text
                            name="phone"
                            label="Số điện thoại"
                            helperText="Nhập số điện thoại"
                            sx={{ flex: 1 }}
                        />
                    </Stack>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        <Field.Text
                            name="email"
                            label="Email"
                            helperText="Nhập địa chỉ email"
                        />
                        <Field.Select label='Giới tính' name="gender">
                            <MenuItem key={'Male'} value={'Male'} sx={{ textTransform: 'capitalize' }}>Nam</MenuItem>
                            <MenuItem key={'Female'} value={'Female'} sx={{ textTransform: 'capitalize' }}>Nữ</MenuItem>
                            <MenuItem key={'Other'} value={'Other'} sx={{ textTransform: 'capitalize' }}>Khác</MenuItem>
                        </Field.Select>
                    </Stack>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        <Field.Text
                            name="bankAccount"
                            label="Số tài khoản ngân hàng"
                            helperText="Nhập số tài khoản"
                        />
                        <Field.DatePicker name="birthday" label="Ngày sinh" />
                    </Stack>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        <Field.Text
                            name="bankName"
                            label="Tên ngân hàng"
                            helperText="Nhập tên ngân hàng"
                            sx={{ flex: 1 }}
                        />
                        <Field.NumberInput
                            name="balance"
                            helperText="Nhập số dư"
                            sx={{ width: 120 }}
                        />
                    </Stack>
                    <Field.Text
                        name="address"
                        label="Địa chỉ"
                        helperText="Nhập địa chỉ"
                        fullWidth
                    />
                </Stack>
                <Stack spacing={3} sx={{ flex: 1 }}>
                    <Stack spacing={1.5}>
                        <Typography variant="subtitle2">Ảnh nhân viên</Typography>
                        <Field.Upload
                            // multiple
                            thumbnail
                            name="image"
                            maxSize={3145728}
                            onUpload={() => console.log('ON UPLOAD')}
                        />
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    );


    const renderActions = () => (
        <Box sx={{ width: '100%' }}>
            <Stack direction="row" spacing={2} width="100%" minHeight={40}>
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
        <Dialog open={open} onClose={onClose} fullWidth maxWidth={"xl"} scroll={'paper'}>
            <DialogTitle>
                Tạo nhân viên
                {/* {currentEmployee ? 'Chỉnh sửa nhân viên' : 'Tạo nhân viên'} */}
            </DialogTitle>
            <DialogContent dividers={true}>
                <Form methods={methods} onSubmit={() => { }}>
                    <CardContent sx={{ pt: 0, px: 0 }}>
                        <Stack spacing={{ xs: 3, md: 5 }}>
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