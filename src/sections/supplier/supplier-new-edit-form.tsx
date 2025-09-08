import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, CardActions, CardContent, Dialog, DialogContent, DialogTitle, Stack } from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createOrUpdateSupplier } from "src/actions/suppliers";
import { Field, Form } from "src/components/hook-form";
import { endpoints } from "src/lib/axios";
import { ISupplierDto, ISuppliersItem } from "src/types/suppliers";
import { mutate } from "swr";
import { z as zod } from 'zod';

type Props = {
    currentSupplier?: ISuppliersItem;
    open: boolean;
    onClose: () => void;
    selectedId?: number;
    page: number;
    rowsPerPage: number;
};

export const NewSupplierSchema = zod.object({
    name: zod.string().min(1, "Tên nhà cung cấp là bắt buộc"),
    phone: zod.string().min(8, "Số điện thoại không hợp lệ"),
    taxCode: zod.string().optional(),
    companyName: zod.string().optional(),
    email: zod.string().email("Email không hợp lệ").optional(),
    bankAccount: zod.string().optional(),
    bankName: zod.string().optional(),
    balance: zod.number().nonnegative().default(0),
    address: zod.string().optional(),
});

export type NewSupplierSchemaType = Zod.infer<typeof NewSupplierSchema>;

export function SupplierNewEditForm({ currentSupplier, open, onClose, selectedId, page, rowsPerPage }: Props) {
    const defaultValues: NewSupplierSchemaType = {
        name: "",
        phone: "",
        taxCode: "",
        companyName: "",
        email: "",
        bankAccount: "",
        bankName: "",
        balance: 0,
        address: "",
    };

    const methods = useForm<NewSupplierSchemaType>({
        resolver: zodResolver(NewSupplierSchema),
        defaultValues: currentSupplier
            ? {
                ...defaultValues,
                name: currentSupplier.name,
                phone: currentSupplier.phone,
                taxCode: currentSupplier.taxCode,
                companyName: currentSupplier.companyName,
                email: currentSupplier.email,
                bankAccount: currentSupplier.bankAccount,
                bankName: currentSupplier.bankName,
                balance: currentSupplier.balance,
                address: currentSupplier.address,
            }
            : defaultValues,
    });

    useEffect(() => {
        if (currentSupplier) {
            methods.reset({
                ...defaultValues,
                name: currentSupplier.name,
                phone: currentSupplier.phone,
                taxCode: currentSupplier.taxCode,
                companyName: currentSupplier.companyName,
                email: currentSupplier.email,
                bankAccount: currentSupplier.bankAccount,
                bankName: currentSupplier.bankName,
                balance: currentSupplier.balance,
                address: currentSupplier.address,
            });
        } else {
            methods.reset(defaultValues);
        }
    }, [currentSupplier, methods.reset]);

    const {
        reset,
        watch,
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            const payloadData: ISupplierDto = {
                name: data.name,
                phone: data.phone,
                taxCode: data.taxCode ?? '',
                companyName: data.companyName ?? '',
                email: data.email ?? '',
                bankAccount: data.bankAccount ?? '',
                bankName: data.bankName ?? '',
                balance: data.balance,
                address: data.address ?? '',
            };

            await createOrUpdateSupplier(selectedId ?? 0, payloadData);
            mutate(endpoints.suppliers.list(`?pageNumber=${page + 1}&pageSize=${rowsPerPage}`));
            toast.success(currentSupplier ? 'Dữ liệu nhà cung cấp đã được thay đổi!' : 'Tạo mới dữ liệu nhà cung cấp thành công!');
            onClose();
            reset();
        } catch (error) {
            console.error(error);
        }
    });

    const renderDetails = () => (
        <Stack spacing={3} pt={1}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Field.Text
                    name="name"
                    label="Họ và tên"
                    helperText="Nhập họ và tên nhà cung cấp"
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
                    name="taxCode"
                    label="Mã số thuế"
                    helperText="Nhập mã số thuế"
                    sx={{ flex: 1 }}
                />
                <Field.Text
                    name="companyName"
                    label="Tên công ty"
                    helperText="Nhập tên công ty"
                    sx={{ flex: 1 }}
                />
            </Stack>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Field.Text
                    name="email"
                    label="Email"
                    helperText="Nhập địa chỉ email"
                    sx={{ flex: 1 }}
                />
                <Field.Text
                    name="bankAccount"
                    label="Tài khoản ngân hàng"
                    helperText="Nhập tên tài khoản ngân hàng"
                    sx={{ flex: 1 }}
                />
            </Stack>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Field.Text
                    name="bankName"
                    label="Tên ngân hàng"
                    helperText="Nhập tên ngân hàng"
                />
                <Field.VNCurrencyInput
                    name="balance"
                    label="Số dư tài khoản"
                    sx={{ width: 120 }}
                />
            </Stack>
            <Field.Text
                name="address"
                label="Địa chỉ"
                helperText="Nhập địa chỉ nhà cung cấp"
                fullWidth
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
                    loading={isSubmitting}
                    fullWidth
                >
                    {!currentSupplier ? 'Tạo mới' : 'Lưu thay đổi'}
                </Button>
            </Stack>
        </Box>
    );
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth={'md'} scroll={'paper'}>
            <DialogTitle>
                {currentSupplier ? 'Chỉnh sửa nhà cung cấp' : 'Tạo nhà cung cấp'}
            </DialogTitle>
            <DialogContent dividers={true}>
                <Form methods={methods} onSubmit={onSubmit}>
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