import Button from '@mui/material/Button';
import { Iconify } from 'src/components/iconify';
import { sendEmailQuotation } from 'src/actions/quotation';
import { toast } from 'sonner';
import { Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, Form } from 'src/components/hook-form';
import { UseBooleanReturn } from 'minimal-shared/hooks';

type Props = {
    openSendMail: UseBooleanReturn;
    email?: string;
    quotationId: number;
};

const schema = z.object({
    email: z.string().email("Email không hợp lệ"),
});

type FormValues = z.infer<typeof schema>;

export default function QuotationSendMail({ openSendMail, email, quotationId }: Props) {
    const methods = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: email ?? "",
        },
    });

    const { handleSubmit, formState: { isSubmitting }, reset } = methods;

    const onSubmit = async (data: FormValues) => {
        try {
            await sendEmailQuotation({ quotationId, email: data.email });
            toast.success("Gửi báo giá thành công!");
            reset();
            openSendMail.onFalse();
        } catch (error: any) {
            console.error("Gửi báo giá thất bại:", error);
            toast.warning(error.message);
        }
    };

    return (
        <Dialog open={openSendMail.value} onClose={openSendMail.onFalse} PaperProps={{
            sx: {
                borderRadius: 0,
            },
        }}>
            <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle>Gửi báo giá</DialogTitle>
                <DialogContent dividers>
                    <Stack direction="row" width="100%" alignItems="center" justifyContent="flex-end" gap={2}>
                        <Field.Text
                            margin="dense"
                            name="email"
                            label="Địa chỉ Email"
                            type="email"
                            fullWidth
                            variant="standard"
                            required
                            sx={{ width: "300px" }}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button variant="outlined" onClick={openSendMail.onFalse}>Đóng</Button>
                    <Button
                        variant="contained"
                        type="submit"
                        disabled={isSubmitting}
                        sx={{ height: "max-content", padding: "10px" }}
                        startIcon={<Iconify icon="lsicon:email-send-filled" />}
                    >
                        Gửi
                    </Button>
                </DialogActions>
            </Form>
        </Dialog >
    );
}

