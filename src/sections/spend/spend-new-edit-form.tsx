import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { IReceiptContract, IReceiptContractDto } from "src/types/contract";
import { ContractSpendSchema, ContractSpendSchemaType } from "../contract-supplier/schema/contract-spend-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateReceiptContract } from "src/actions/contract";
import { toast } from "sonner";
import { fDate } from "src/utils/format-time-vi";
import { paths } from "src/routes/paths";
import { Box, Button, CardActions, CardContent, Dialog, DialogContent, DialogTitle, IconButton, Stack, TextField, Typography } from "@mui/material";
import { Field, Form } from "src/components/hook-form";
import { Iconify } from "src/components/iconify";
import { CloseIcon } from "yet-another-react-lightbox";

interface FormDialogProps {
    selectedReceipt: IReceiptContract | null;
    open: boolean;
    onClose: () => void;
    mutation: () => void;
}

export function SpendNewEditForm({ selectedReceipt, open, onClose, mutation }: FormDialogProps) {
    const today = new Date();
    const navigate = useNavigate();

    const [watchTicket, setWatchTicket] = useState(true);

    const defaultValues: ContractSpendSchemaType = {
        companyName: selectedReceipt?.companyName ?? "",
        customerName: selectedReceipt?.customerName ?? "",
        amount: 0,
        receiptNo: '',
        date: today.toISOString(),
        address: "",
        payer: "",
        reason: ""
    };

    const methods = useForm<ContractSpendSchemaType>({
        resolver: zodResolver(ContractSpendSchema),
        defaultValues
    });

    useEffect(() => {
        if (!selectedReceipt) return;
        methods.setValue('companyName', selectedReceipt.companyName);
        methods.setValue('customerName', selectedReceipt.customerName);
        methods.setValue('address', selectedReceipt.address);
        methods.setValue('amount', selectedReceipt.amount);
        methods.setValue('date', selectedReceipt.date);
        methods.setValue('payer', selectedReceipt.payer);
        methods.setValue('reason', selectedReceipt.reason);
        methods.setValue('receiptNo', selectedReceipt.receiptNo);
    }, [selectedReceipt, methods.reset]);

    const {
        reset,
        watch,
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            if (!selectedReceipt) return;

            const payload: IReceiptContractDto = {
                receiptNo: data.receiptNo || "",
                contractNo: selectedReceipt?.contractNo || "",
                date: data.date,
                receiptType: "Spend",
                amount: data.amount,
                note: data.reason || "",
                contractType: "Supplier",
                companyName: data.companyName,
                customerName: data.customerName,
                address: data.address || "",
                payer: data.payer,
                reason: data.reason || "",
            };

            await updateReceiptContract(payload, selectedReceipt.receiptId);

            toast.success("Dữ liệu phiếu chi đã được thay đổi!");
            reset();
            mutation();
            onClose();
        } catch (error: any) {
            console.error(error);
            toast.error("Đã có lỗi xảy ra!");
        }
    });

    const companyName = watch('companyName');
    const customerName = watch('customerName');
    const date = watch('date');
    const receiptNoToWatch = watch('receiptNo');
    const amount = watch('amount');
    const payer = watch('payer');
    const reason = watch('reason');
    const address = watch('address');

    useEffect(() => {
        if (companyName && customerName && date && receiptNoToWatch && amount && payer) {
            setWatchTicket(false);
        }
    }, [companyName, customerName, date, receiptNoToWatch, amount, payer]);

    const onPreviewReceipt = () => {
        const params = new URLSearchParams({
            companyName,
            customerName,
            date: String(fDate(date)),
            receiptNoToWatch,
            amount: String(amount),
            payer,
            contractNo: selectedReceipt?.contractNo || "",
            reason,
            address,
            createdBy: selectedReceipt?.createdBy
        } as Record<string, string>);
        const queryString = params.toString();
        window.open(`${paths.spend}?${queryString}`, '_blank');
    }

    const renderDetails = () => (
        <>
            <Stack direction="row" spacing={3} pt={3}>
                <Field.Text
                    name="companyName"
                    label="Tên công ty"
                    required
                    sx={{
                        flex: 1.5,
                        '& .MuiInputBase-root.Mui-disabled': {
                            backgroundColor: '#ddd',
                        },
                    }}
                    disabled
                />
                <Field.DatePicker
                    name="date"
                    label="Ngày lập phiếu"
                    sx={{ flex: 1 }}
                />
            </Stack>
            <Stack direction="row" spacing={3}>
                <Field.Text
                    name="customerName"
                    label="Tên khách hàng"
                    helperText="Nhập tên khách hàng"
                    required
                    sx={{
                        flex: 1.5,
                        '& .MuiInputBase-root.Mui-disabled': {
                            backgroundColor: '#ddd',
                        },
                    }}
                />
                <Field.Text
                    name="receiptNo"
                    label="Số phiếu chi"
                    helperText="Nhập số phiếu chi"
                    required
                    sx={{ flex: 1 }}
                />
            </Stack>
            <Stack direction="row" spacing={3}>
                <Field.Text
                    name="address"
                    label="Địa chỉ"
                    placeholder="Nhập địa chỉ người nhận tiền"
                    sx={{ flex: 1.5 }}
                />
                <Field.Text name="payer" label="Tên người nhận" required placeholder="Nhập tên người nhận tiền" sx={{ flex: 1 }} />
            </Stack>
            <Field.Text
                name="reason"
                label="Lý do chi"
                placeholder="Nhập lý do chi tiền"
            />
            <Field.VNCurrencyInput
                name="amount"
                label="Số tiền chi"
                helperText="Nhập số tiền chi"
                required
                sx={{ width: 500 }}
            />
        </>
    );

    const renderActions = () => (
        <Box sx={{ width: '100%' }}>
            <Stack direction="row" spacing={2} width="100%">
                <Button
                    type="submit"
                    variant="contained"
                    sx={{ ml: 1 }}
                    loading={isSubmitting}
                    fullWidth
                >
                    {'Lưu'}
                </Button>
                <Button
                    type="button"
                    variant="contained"
                    sx={{ ml: 1 }}
                    disabled={watchTicket}
                    fullWidth
                    onClick={onPreviewReceipt}
                >
                    Xem phiếu
                </Button>
                <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => { onClose(); reset(); }}
                    fullWidth
                    disabled={isSubmitting}
                >
                    Hủy bỏ
                </Button>
            </Stack>
        </Box>
    );

    return (
        <Dialog
            PaperProps={{
                sx: {
                    borderRadius: 0,
                },
            }}
            open={open}
            onClose={() => { onClose(); reset(); }}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid #e0e0e0',
                }}
            >
                <Box display="flex" alignItems="center" gap={1}>
                    <Iconify icon="ph:file-x-bold" width={24} />
                    <Typography fontWeight={700} textTransform="uppercase">Chỉnh sửa phiếu chi</Typography>
                </Box>
                <TextField
                    disabled
                    id="contractNo-disabled"
                    value={selectedReceipt?.receiptNo}
                    sx={{ width: 400 }}
                />
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 2 }}>
                <Form methods={methods} onSubmit={onSubmit}>
                    <CardContent sx={{ pt: 0, px: 0 }}>
                        <Stack spacing={{ xs: 3, md: 2 }} direction="column">
                            {renderDetails()}
                        </Stack>
                    </CardContent>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }} />
                    <CardActions>
                        {renderActions()}
                    </CardActions>
                </Form>
            </DialogContent>
        </Dialog>
    );
}