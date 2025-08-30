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

export function CustomerNewEditForm({ open, onClose, selectedId, page, rowsPerPage }: Props) {
    const methods = useForm();
    const renderDetails = () => (
        <Stack spacing={3} pt={1}>
            {/* Họ tên + Số điện thoại */}
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

            {/* Công ty */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Field.Text
                    name="taxCode"
                    label="Mã số thuế"
                    helperText="Nhập mã số thuế (nếu có)"
                    sx={{ flex: 1 }}
                />
                <Field.Text
                    name="companyName"
                    label="Tên công ty"
                    helperText="Nhập tên công ty"
                    sx={{ flex: 1 }}
                />
            </Stack>

            {/* Email + Ngân hàng */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Field.Text
                    name="bankAccount"
                    label="Số tài khoản ngân hàng"
                    helperText="Nhập số tài khoản"
                    sx={{ flex: 1 }}
                />
                <Field.Text
                    name="bankName"
                    label="Tên ngân hàng"
                    helperText="Nhập tên ngân hàng"
                    sx={{ flex: 1 }}
                />
            </Stack>
            <Field.Text
                name="email"
                label="Email"
                helperText="Nhập địa chỉ email"
                sx={{ flex: 1 }}
            />
            {/* Địa chỉ */}
            <Field.Text
                name="address"
                label="Địa chỉ"
                helperText="Nhập địa chỉ"
                fullWidth
            />

            <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={2}
                alignItems="center"
                justifyContent="space-between"
            >
                <Box sx={{ flexShrink: 0 }}>
                    <Field.Switch name="isPartner" label="Là đối tác" />
                </Box>

                {/* Hai ô số liệu nằm ngang, đều nhau */}
                <Stack direction="row" spacing={2}>
                    <Field.NumberInput
                        name="rewardPoint"
                        helperText="Nhập điểm thưởng"
                        sx={{ width: 120 }}
                    />
                    <Field.NumberInput
                        name="balance"
                        helperText="Nhập số dư"
                        sx={{ width: 120 }}
                    />
                </Stack>
            </Stack>
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
        <Dialog open={open} onClose={onClose} fullWidth maxWidth={"md"} scroll={'paper'}>
            <DialogTitle>
                Tạo khách hàng
                {/* {currentCustomer ? 'Chỉnh sửa khách hàng' : 'Tạo khách hàng'} */}
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