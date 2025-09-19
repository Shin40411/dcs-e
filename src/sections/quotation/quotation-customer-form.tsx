import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from "@mui/material";
import { useForm, UseFormReturn } from "react-hook-form";
import { Field, Form } from "src/components/hook-form";
import { CustomerFormValues, customerSchema } from "./schema/new-customer-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ICustomerDto } from "src/types/customer";
import { createOrUpdateCustomer } from "src/actions/customer";
import { mutate } from "swr";
import { endpoints } from "src/lib/axios";
import { QuotationFormValues } from "./schema/quotation-schema";

type props = {
    openChild: boolean;
    setOpenChild: (value: any) => void;
    quotationMethods: UseFormReturn<QuotationFormValues>;
}

export function QuotationCustomerForm({ openChild, setOpenChild, quotationMethods }: props) {
    const defaultValues: CustomerFormValues =
    {
        name: "",
        companyName: "",
        email: "",
        phone: ""
    };

    const methods = useForm<CustomerFormValues>({
        mode: 'onSubmit',
        resolver: zodResolver(customerSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(async (data: CustomerFormValues) => {
        try {
            const payloadData: ICustomerDto = {
                phone: data.phone.replace(/\s+/g, ""),
                name: data.name,
                taxCode: '',
                companyName: data.companyName ?? '',
                email: data.email,
                bankAccount: '',
                bankName: '',
                address: '',
                isPartner: false,
                rewardPoint: 0,
                balance: 0
            };

            const { data: idCreated } = await createOrUpdateCustomer(undefined, payloadData);
            reset();
            setOpenChild(false);
            mutate(endpoints.customer.list(`?pageNumber=1&pageSize=999&Status=1`));
            quotationMethods.setValue('customer', Number(idCreated) ?? 0, { shouldValidate: true });
            toast.success('Tạo mới dữ liệu khách hàng thành công!');

        } catch (error: any) {
            console.error(error);
            if (error.message) {
                toast.error(error.message);
            } else {
                toast.error("Đã có lỗi xảy ra!");
            }
        }
    });

    return (
        <Dialog open={openChild} onClose={() => setOpenChild(false)} fullWidth maxWidth="sm">
            <Form methods={methods} onSubmit={onSubmit}>
                <DialogTitle>Tạo khách hàng mới</DialogTitle>
                <DialogContent>
                    <Box mt={1}>
                        <Stack direction="row" gap={2}>
                            <Field.Text name="name" label="Tên khách hàng" />
                            <Field.Text name="companyName" label="Tên công ty" />
                        </Stack>
                        <Stack direction="row" gap={2} mt={2}>
                            <Field.Text name="email" label="Email khách hàng" />
                            <Field.PhoneField name="phone" label="Số điện thoại" />
                        </Stack>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Box sx={{ width: '100%' }}>
                        <Stack direction="row" spacing={2} width="100%" minHeight={40}>
                            <Button
                                variant="outlined"
                                color="inherit"
                                onClick={() => setOpenChild(false)}
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
                                Tạo mới
                            </Button>
                        </Stack>
                    </Box>
                </DialogActions>
            </Form>
        </Dialog>
    );
}