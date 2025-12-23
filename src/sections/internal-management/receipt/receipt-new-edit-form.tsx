import { zodResolver } from "@hookform/resolvers/zod";
import {
    Box, Button,
    Card,
    CardActions,
    CardContent,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Field, Form } from "src/components/hook-form";
import { Iconify } from "src/components/iconify";
import { CloseIcon } from "yet-another-react-lightbox";
import { InternalReceiptSchema, InternalReceiptSchemaType } from "./schema/receipt-schema";
import { ReceiptAndSpendCreateDto, ReceiptAndSpendData, ReceiptAndSpendUpdateDto } from "src/types/internal";
import { useGetBankAccounts } from "src/actions/bankAccount";
import { useDebounce } from "minimal-shared/hooks";
import { IBankAccountItem } from "src/types/bankAccount";
import { createOrUpdateReceipt } from "src/actions/internal";
import { generateInternalReceipt } from "src/utils/random-func";

interface FormDialogProps {
    selectedReceipt: ReceiptAndSpendData | null;
    open: boolean;
    onClose: () => void;
    mutation: () => void;
    totalRecord: number;
}

export function ReceiptNewEditForm({ selectedReceipt, open, onClose, mutation, totalRecord }: FormDialogProps) {
    const today = new Date();
    const [bankKeyword, setbankKeyword] = useState('');
    const debouncedbankKw = useDebounce(bankKeyword, 300);

    const { bankAccounts, bankAccountsLoading } = useGetBankAccounts({
        pageNumber: 1,
        pageSize: 10,
        enabled: open,
        key: debouncedbankKw
    });

    const getDefaultValues = () => ({
        name: "",
        cost: 0,
        receiptDate: today.toISOString(),
        receiptNo: generateInternalReceipt('PT', totalRecord),
        address: "",
        reason: "",
        bankAccId: 0,
        bankNo: ""
    });

    const [selectedBank, setSelectedBank] = useState<IBankAccountItem | null>(null);

    const methods = useForm<InternalReceiptSchemaType>({
        resolver: zodResolver(InternalReceiptSchema),
        defaultValues: getDefaultValues(),
    });

    const {
        reset,
        watch,
        control,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            const createBody: ReceiptAndSpendCreateDto = {
                address: data.address || "",
                ReceiptNo: data.receiptNo,
                bankAccountID: data.bankAccId,
                bookKeeping: 1,
                cost: data.cost,
                credit: 0,
                debit: 0,
                isReceive: true,
                name: data.name,
                reason: data.reason || "",
                receiptDate: data.receiptDate,
                targetCode: "",
                targetType: null
            };

            const updateBody: ReceiptAndSpendUpdateDto = {
                address: data.address || "",
                bankAccountID: data.bankAccId,
                bookKeeping: 1,
                cost: data.cost,
                credit: 0,
                debit: 0,
                isReceive: true,
                name: data.name,
                reason: data.reason || "",
                receiptDate: data.receiptDate,
            };

            await createOrUpdateReceipt(createBody, updateBody, selectedReceipt?.receiptId);

            toast.success(selectedReceipt?.receiptId ? "Dữ liệu phiếu thu đã được thay đổi!" : "Tạo phiếu thu thành công!");
            reset();
            mutation();
            onClose();
        } catch (error: any) {
            console.error(error);
            toast.error("Đã có lỗi xảy ra!");
        }
    });

    useEffect(() => {
        if (!open) return;

        if (selectedReceipt) {
            reset({
                name: selectedReceipt.name,
                cost: selectedReceipt.cost,
                receiptDate: selectedReceipt.receiptDate,
                receiptNo: selectedReceipt.receiptNo,
                address: selectedReceipt.address,
                reason: selectedReceipt.reason,
                bankAccId: selectedReceipt.bankAccountID,
                bankNo: selectedReceipt.bankNo,
            });

            setbankKeyword(selectedReceipt.bankAccountName ?? "");

            const found = bankAccounts.find(
                x => Number(x.id) === Number(selectedReceipt.bankAccountID)
            );
            setSelectedBank(found ?? null);

        } else {
            reset(getDefaultValues());
            setbankKeyword("");
            setSelectedBank(null);

            if (bankAccounts.length > 0) {
                const first = bankAccounts[0];
                setValue("bankAccId", Number(first.id), { shouldValidate: true });
                setValue("bankNo", first.bankNo);
                setSelectedBank(first);
            }
        }
    }, [open, selectedReceipt, bankAccounts]);

    const renderDetails = () => (
        <>
            <Stack direction="row" spacing={3} pt={3} mb={2}>
                <Field.Text
                    name="name"
                    label="Người nộp tiền"
                    required
                    sx={{
                        flex: 1.5,
                    }}
                />
                <Field.DatePicker
                    name="receiptDate"
                    label="Ngày lập phiếu"
                    sx={{ flex: 1 }}
                />
            </Stack>
            <Stack direction="row" spacing={3} mb={2}>
                <Field.Text
                    name="address"
                    label="Địa chỉ"
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
                    label="Số phiếu thu"
                    disabled
                    sx={{ flex: 1 }}
                />
            </Stack>
            <Stack direction="row" spacing={3}>
                <Box
                    flex={1.5}
                    display="flex"
                    flexDirection="column"
                    gap={3}
                >
                    <Field.Text
                        name="reason"
                        label="Lý do nộp tiền"
                    />
                    <Field.VNCurrencyInput
                        name="cost"
                        label="Số tiền nộp"
                        helperText="Nhập số tiền nộp"
                        required
                    />
                </Box>
                <Box flex={1} position="relative">
                    <Box position="absolute" top={-10} left={10} zIndex={1000} bgcolor="common.white">
                        <Typography variant="subtitle2" color="textSecondary">Tài khoản nhận tiền</Typography>
                    </Box>
                    <Card
                        sx={{
                            px: 2,
                            py: 3,
                            borderRadius: 0.5,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2
                        }}
                    >
                        <Field.Autocomplete
                            name="bankAccId"
                            label={`Tài khoản`}
                            options={bankAccounts}
                            loading={bankAccountsLoading}
                            getOptionLabel={(opt) => opt?.name ?
                                opt.name : ''}
                            isOptionEqualToValue={(opt, val) => opt?.id === val?.id}
                            onInputChange={(_, value) => setbankKeyword(value)}
                            value={selectedBank}
                            fullWidth
                            onChange={(_, newValue) => {
                                methods.setValue('bankAccId', newValue?.id ?? 0, { shouldValidate: true });
                                setbankKeyword(newValue?.name ?? '');
                            }}
                            noOptionsText="Không có dữ liệu"
                            sx={{ flex: 1, minWidth: 200 }}
                            renderOption={(props, option) => (
                                <li {...props} key={option.id}>
                                    {option.name ? option.name : ''}
                                </li>
                            )}
                            required
                        />
                        <Field.Text name="bankNo" label="Số tài khoản" type="number" disabled />
                    </Card>
                </Box>
            </Stack>
        </>
    );

    const handleCancel = () => {
        onClose();
        reset();
        setSelectedBank(null);
        setbankKeyword('');
    }

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
                    {selectedReceipt ? 'Lưu' : 'Tạo phiếu thu'}
                </Button>
                <Button
                    variant="outlined"
                    color="inherit"
                    onClick={handleCancel}
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
            onClose={handleCancel}
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
                    <Typography fontWeight={700} textTransform="uppercase">
                        {
                            selectedReceipt
                                ? `Chỉnh sửa phiếu thu`
                                : 'Tạo phiếu thu'
                        }
                    </Typography>
                </Box>
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