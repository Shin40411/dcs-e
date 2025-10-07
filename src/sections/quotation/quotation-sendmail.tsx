import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { FormEvent, Fragment, useState } from 'react';
import { UseBooleanReturn } from 'minimal-shared/hooks';
import { Iconify } from 'src/components/iconify';
import { sendEmailQuotation } from 'src/actions/quotation';
import { toast } from 'sonner';
import { Stack } from '@mui/material';

type props = {
    email?: string;
    quotationId: number;
}

export default function QuotationSendMail({ email, quotationId }: props) {
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries((formData as any).entries());
        const email = formJson.email;
        try {
            await sendEmailQuotation({ quotationId, email });
            toast.success('Gửi báo giá thành công!');
        } catch (error: any) {
            console.error("Gửi báo giá thất bại:", error);
            toast.warning(error.message);
        }
    };

    return (
        <Stack direction="row" width="100%" alignItems="center" justifyContent="flex-end" gap={2}>
            <form style={{ width: '300px' }} onSubmit={handleSubmit} id="subscription-form">
                <TextField
                    autoFocus
                    required
                    margin="dense"
                    id="name"
                    name="email"
                    label="Địa chỉ Email"
                    type="email"
                    fullWidth
                    variant="standard"
                    value={email}
                />
            </form>
            <Button
                variant='contained'
                type="submit"
                form="subscription-form"
                sx={{
                    height: 'max-content',
                    padding: '10px'
                }}
                startIcon={<Iconify icon="lsicon:email-send-filled" />}
            >
                Gửi
            </Button>
        </Stack>
    );
}
