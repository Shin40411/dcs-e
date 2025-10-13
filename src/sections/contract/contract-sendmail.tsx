import Button from '@mui/material/Button';
import { Iconify } from 'src/components/iconify';
import { toast } from 'sonner';
import { Stack } from '@mui/material';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, Form } from 'src/components/hook-form';
import { sendEmailContract } from 'src/actions/contract';

type Props = {
    email?: string;
    contractId: number;
};

const schema = z.object({
    email: z.string().email("Email không hợp lệ"),
});

type FormValues = z.infer<typeof schema>;

export default function ContractSendMail({ email, contractId }: Props) {
    const methods = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: email ?? "",
        },
    });

    const { handleSubmit, formState: { isSubmitting }, reset } = methods;

    const onSubmit = async (data: FormValues) => {
        try {
            await sendEmailContract({ contractId, email: data.email });
            toast.success("Gửi hợp đồng thành công!");
            reset();
        } catch (error: any) {
            console.error("Gửi hợp đồng thất bại:", error);
            toast.warning(error.message);
        }
    };

    return (
        <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
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
                <Button
                    variant="contained"
                    type="submit"
                    disabled={isSubmitting}
                    sx={{ height: "max-content", padding: "10px" }}
                    startIcon={<Iconify icon="lsicon:email-send-filled" />}
                >
                    Gửi
                </Button>
            </Stack>
        </Form>
    );
}

