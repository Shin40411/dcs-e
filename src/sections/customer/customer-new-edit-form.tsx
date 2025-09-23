import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, CardActions, CardContent, Dialog, DialogContent, DialogTitle, Stack } from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createOrUpdateCustomer } from "src/actions/customer";
import { Field, Form } from "src/components/hook-form";
import { ICustomerDto, ICustomerItem } from "src/types/customer";
import { mutate } from "swr";
import { NewCustomerSchema, NewCustomerSchemaType } from "./schema/customer-schema";

type Props = {
    currentCustomer?: ICustomerItem;
    open: boolean;
    onClose: () => void;
    selectedId?: number;
};

export function CustomerNewEditForm({ currentCustomer, open, onClose, selectedId }: Props) {
    const defaultValues: NewCustomerSchemaType = {
        name: "",
        phone: "",
        email: "",
        taxCode: "",
        companyName: "",
        bankAccount: "",
        bankName: "",
        address: "",
        isPartner: false,
        rewardPoint: 0,
        balance: null as unknown as number,
    };

    const methods = useForm<NewCustomerSchemaType>({
        resolver: zodResolver(NewCustomerSchema),
        defaultValues: currentCustomer
            ? {
                ...defaultValues,
                name: currentCustomer.name,
                phone: currentCustomer.phone,
                email: currentCustomer.email,
                taxCode: currentCustomer.taxCode ?? "",
                companyName: currentCustomer.companyName ?? "",
                bankAccount: currentCustomer.bankAccount ?? "",
                bankName: currentCustomer.bankName ?? "",
                address: currentCustomer.address ?? "",
                isPartner: currentCustomer.isPartner ?? false,
                rewardPoint: currentCustomer.rewardPoint ?? 0,
                balance: currentCustomer.balance ?? 0,
            }
            : defaultValues,
    });

    useEffect(() => {
        if (currentCustomer) {
            methods.reset({
                ...defaultValues,
                name: currentCustomer.name,
                phone: currentCustomer.phone,
                email: currentCustomer.email,
                taxCode: currentCustomer.taxCode ?? "",
                companyName: currentCustomer.companyName ?? "",
                bankAccount: currentCustomer.bankAccount ?? "",
                bankName: currentCustomer.bankName ?? "",
                address: currentCustomer.address ?? "",
                isPartner: currentCustomer.isPartner ?? false,
                rewardPoint: currentCustomer.rewardPoint ?? 0,
                balance: currentCustomer.balance ?? 0,
            });
        } else {
            methods.reset(defaultValues);
        }
    }, [currentCustomer, methods.reset]);

    const {
        reset,
        watch,
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;


    const onSubmit = handleSubmit(async (data) => {
        try {
            const payloadData: ICustomerDto = {
                phone: data.phone.replace(/\s+/g, ""),
                name: data.name,
                taxCode: data.taxCode ?? '',
                companyName: data.companyName ?? '',
                email: data.email,
                bankAccount: data.bankAccount ?? '',
                bankName: data.bankName ?? '',
                address: data.address ?? '',
                isPartner: data.isPartner,
                rewardPoint: data.rewardPoint,
                balance: data.balance ?? 0,
            };

            await createOrUpdateCustomer(selectedId ?? 0, payloadData);
            // mutate(endpoints.customer.list(`?pageNumber=${page + 1}&pageSize=${rowsPerPage}&Status=1`));

            mutate(
                (k) => typeof k === "string" && k.startsWith("/api/v1/customers/customers"),
                undefined,
                { revalidate: true }
            );

            toast.success(currentCustomer ? 'Dữ liệu khách hàng đã được thay đổi!' : 'Tạo mới dữ liệu khách hàng thành công!');
            onClose();
            reset();
        } catch (error: any) {
            console.error(error);
            if (error.message) {
                toast.error(error.message);
            } else {
                toast.error("Đã có lỗi xảy ra!");
            }
        }
    });

    const renderDetails = () => (
        <Stack spacing={3} pt={1}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Field.Text
                    name="name"
                    label="Họ và tên"
                    helperText="Nhập họ và tên khách hàng"
                    sx={{ flex: 1 }}
                    required
                />
                <Field.PhoneField
                    name="phone"
                    label="Số điện thoại"
                    helperText="Nhập số điện thoại"
                    sx={{ flex: 1 }}
                    required
                />
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Field.TaxCode
                    name="taxCode"
                    label="Mã số thuế"
                    helperText="Nhập mã số thuế"
                // required
                />
                <Field.Text
                    name="companyName"
                    label="Tên công ty"
                    helperText="Nhập tên công ty"
                />
            </Stack>

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
                required
            />
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

                <Stack direction="row" spacing={2}>
                    <Field.VNCurrencyInput
                        name="balance"
                        label="Số dư"
                    />
                    <Field.NumberInput
                        name="rewardPoint"
                        helperText="Nhập điểm thưởng"
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
                    loading={isSubmitting}
                    fullWidth
                >
                    {!currentCustomer ? 'Tạo mới' : 'Lưu thay đổi'}
                </Button>
            </Stack>
        </Box>
    );

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth={"md"} scroll={'paper'}>
            <DialogTitle>
                {currentCustomer ? 'Chỉnh sửa dữ liệu khách hàng' : 'Tạo dữ liệu khách hàng'}
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