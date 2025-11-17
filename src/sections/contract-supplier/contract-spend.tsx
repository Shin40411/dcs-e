import { Box, Button, CardActions, CardContent, Dialog, DialogContent, DialogTitle, IconButton, Stack, TextField, Typography } from "@mui/material";
import { Iconify } from "src/components/iconify";
import { CloseIcon } from "yet-another-react-lightbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, Form } from "src/components/hook-form";
import { IReceiptContractDto } from "src/types/contract";
import { generateReceipt } from "src/utils/random-func";
import { createReceiptContract, useGetReceiptContract } from "src/actions/contract";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { mutate } from "swr";
import { paths } from "src/routes/paths";
import { fDate } from "src/utils/format-time-vi";
import { IContractSupplyItem } from "src/types/contractSupplier";
import { ContractSpendSchema, ContractSpendSchemaType } from "./schema/contract-spend-schema";

interface FileDialogProps {
    selectedContract: IContractSupplyItem;
    open: boolean;
    onClose: () => void;
}

export function ContractSpend({ selectedContract, open, onClose }: FileDialogProps) {
    const today = new Date();
    const { pagination: { totalRecord } } = useGetReceiptContract({
        pageNumber: 1,
        pageSize: 999,
        ContractNo: selectedContract.contractNo,
        enabled: open,
        ContractType: 'supplier',
        ReceiptType: 'spend'
    });

    const [watchTicket, setWatchTicket] = useState(true);

    const [receiptNo, setReceiptNo] = useState<string>('');

    const defaultValues: ContractSpendSchemaType = {
        companyName: selectedContract.companyName ?? "",
        customerName: selectedContract.supplierName ?? "",
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
        methods.setValue('receiptNo', generateReceipt('PC', selectedContract.contractNo, totalRecord));
        setReceiptNo(generateReceipt('PC', selectedContract.contractNo, totalRecord));
    }, [totalRecord, setReceiptNo]);

    const {
        reset,
        watch,
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            const payload: IReceiptContractDto = {
                receiptNo: data.receiptNo || "",
                contractNo: selectedContract.contractNo,
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

            await createReceiptContract(payload);

            toast.success("Tạo phiếu chi thành công!");
            reset();
            mutate(
                (k) => typeof k === "string" && k.startsWith("/api/v1/contract-receipts/get-receipts"),
                undefined,
                { revalidate: true }
            );
            onClose();
        } catch (error: any) {
            console.error(error);
            toast.error("Tạo phiếu chi thất bại!");
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
        } else {
            setWatchTicket(true);
        }
    }, [companyName, customerName, date, receiptNoToWatch, amount, payer]);

    const onPreViewSpend = () => {
        const params = new URLSearchParams({
            companyName,
            customerName,
            date: String(fDate(date)),
            receiptNoToWatch,
            amount: String(amount),
            payer,
            contractNo: selectedContract.contractNo,
            reason,
            address,
            createdBy: selectedContract.seller
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
                    helperText="Nhập tên công ty"
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
                    placeholder="Nhập số phiếu chi"
                    required
                    sx={{ flex: 1 }}
                />
            </Stack>
            <Stack direction="row" spacing={3}>
                <Field.Text name="payer" label="Người nhận tiền" required placeholder="Nhập tên người nhận tiền" sx={{ flex: 1.5 }} />
                <TextField defaultValue={selectedContract.seller} label="Tên nhân viên" disabled
                    sx={{
                        flex: 1,
                        '& .MuiInputBase-root.Mui-disabled': {
                            backgroundColor: '#ddd',
                        },
                    }} />
            </Stack>
            <Field.Text
                name="address"
                label="Địa chỉ"
                placeholder="Nhập địa chỉ người nhận tiền"
            />
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
                    onClick={onPreViewSpend}
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
                    <Typography fontWeight={700} textTransform="uppercase">Phiếu chi</Typography>
                </Box>
                <TextField
                    disabled
                    id="contractNo-disabled"
                    value={receiptNo}
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