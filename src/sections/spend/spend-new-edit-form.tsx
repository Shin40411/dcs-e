import { useEffect, useState } from "react";
import { IReceiptContract, IReceiptContractDto } from "src/types/contract";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createReceiptContract, updateReceiptContract, useGetTotalSpendByCustomerContract } from "src/actions/contract";
import { toast } from "sonner";
import { fDate } from "src/utils/format-time-vi";
import { Box, Button, Card, CardActions, CardContent, Dialog, DialogContent, DialogTitle, IconButton, Stack, TextField, Typography } from "@mui/material";
import { Field, Form } from "src/components/hook-form";
import { Iconify } from "src/components/iconify";
import { CloseIcon } from "yet-another-react-lightbox";
import { useDebounce } from "minimal-shared/hooks";
import { useGetBankAccounts } from "src/actions/bankAccount";
import { IBankAccountItem } from "src/types/bankAccount";
import { VoucherSupItem } from "src/types/contractSupplier";
import { useGetVoucherCode } from "src/actions/contractSupplier";
import { SpendSchema, SpendSchemaType } from "./schema/spend-schema";
import { generateReceipt } from "src/utils/random-func";

interface FormDialogProps {
    selectedReceipt: IReceiptContract | null;
    contractType: string;
    open: boolean;
    onClose: () => void;
    onPreviewReceipt: (params: URLSearchParams) => void;
    mutation: () => void;
}

export function SpendNewEditForm({ selectedReceipt, contractType, open, onPreviewReceipt, onClose, mutation }: FormDialogProps) {
    const today = new Date();
    const [bankKeyword, setbankKeyword] = useState('');
    const debouncedbankKw = useDebounce(bankKeyword, 300);
    const [watchTicket, setWatchTicket] = useState(true);
    const [selectedBank, setSelectedBank] = useState<IBankAccountItem | null>(null);

    const [contractkeyword, setContractKeyword] = useState('');
    const debouncedContractKw = useDebounce(contractkeyword, 300);
    const [selectedVoucher, setSelectedVoucher] = useState<VoucherSupItem | null>(null);

    const { bankAccounts, bankAccountsLoading } = useGetBankAccounts({
        pageNumber: 1,
        pageSize: 10,
        enabled: open,
        key: debouncedbankKw
    });

    const { vouchers, vouchersLoading, mutate: refetchVoucher } = useGetVoucherCode({
        pageNumber: 1,
        pageSize: 20,
        key: debouncedContractKw,
        enabled: open
    });

    const {
        spenRecords: totalRecord,
    } = useGetTotalSpendByCustomerContract(
        selectedReceipt ? selectedReceipt.contractNo
            : selectedVoucher ? selectedVoucher.contractNo : "",
        open
    );

    const defaultValues: SpendSchemaType = {
        companyName: "",
        customerName: "",
        amount: 0,
        receiptNo: "",
        supplierContract: "",
        date: today.toISOString(),
        address: "",
        payer: "",
        reason: "",
        bankAccId: 0,
        bankNo: ""
    };

    const methods = useForm<SpendSchemaType>({
        resolver: zodResolver(SpendSchema),
        defaultValues
    });

    const {
        reset,
        watch,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            const payload: IReceiptContractDto = {
                receiptNo: data.receiptNo || "",
                contractNo: selectedReceipt
                    ? selectedReceipt?.contractNo
                    : data.supplierContract,
                date: data.date,
                receiptType: "Spend",
                amount: data.amount,
                note: data.reason || "",
                bankAccountID: data.bankAccId || undefined,
                contractType: contractType,
                companyName: data.companyName,
                customerName: data.customerName,
                address: data.address || "",
                payer: data.payer || "",
                reason: data.reason || "",
            };

            if (!selectedReceipt) {
                await createReceiptContract(payload);
                toast.success("Tạo phiếu chi thành công!");
            } else {
                await updateReceiptContract(payload, selectedReceipt.receiptId);
                toast.success("Dữ liệu phiếu chi đã được thay đổi!");
            }

            reset();
            mutation();
            setSelectedBank(null);
            setbankKeyword('');
            onClose();
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Đã có lỗi xảy ra!");
        }
    });

    const companyName = watch('companyName');
    const customerName = watch('customerName');
    const contractNo = methods.watch('supplierContract');
    const date = watch('date');
    const receiptNoToWatch = watch('receiptNo');
    const amount = watch('amount');
    const payer = watch('payer');
    const reason = watch('reason');
    const address = watch('address');
    const bankAccId = methods.watch('bankAccId');

    useEffect(() => {
        if (!open) return;

        if (selectedReceipt) {
            methods.reset({
                supplierContract: selectedReceipt.contractNo,
                companyName: selectedReceipt.companyName,
                customerName: selectedReceipt.customerName,
                address: selectedReceipt.address,
                amount: selectedReceipt.amount,
                date: selectedReceipt.date,
                payer: selectedReceipt.payer,
                reason: selectedReceipt.reason,
                receiptNo: selectedReceipt.receiptNo,
                bankAccId: selectedReceipt.bankAccountID,
                bankNo: selectedReceipt.bankNo
            });
        } else {
            methods.reset(defaultValues);
            setbankKeyword("");
            setSelectedBank(null);

            if (bankAccounts.length > 0) {
                const first = bankAccounts[0];
                setValue("bankAccId", Number(first.id), { shouldValidate: true });
                setValue("bankNo", first.bankNo);
                setSelectedBank(first);
            }
        }
    }, [open, selectedReceipt]);

    useEffect(() => {
        if (selectedReceipt) return;
        if (!contractNo) {
            setSelectedVoucher(null);
            methods.setValue("customerName", defaultValues.customerName);
            methods.setValue("companyName", defaultValues.companyName);
            methods.setValue("payer", defaultValues.payer);
            methods.setValue('receiptNo', defaultValues.receiptNo);
            methods.setValue('amount', defaultValues.amount);
            return;
        }

        const found = vouchers.find((vou) => vou.contractNo === contractNo);

        if (found) {
            setSelectedVoucher(found);
            methods.setValue('receiptNo', generateReceipt('PC', totalRecord));
            methods.setValue("customerName", found.supplierName);
            methods.setValue("companyName", found.companyName);
            methods.setValue("payer", found.companyName);
            methods.setValue('amount', found.remainingAmount);
        }
    }, [contractNo, vouchers]);

    useEffect(() => {
        if (!bankAccId) {
            setSelectedBank(null);
            methods.setValue("bankNo", "");
            return;
        }

        const found = bankAccounts.find((cus) => Number(cus.id) === Number(bankAccId));
        if (found) {
            setSelectedBank(found);
            methods.setValue("bankNo", found.bankNo);
        }
    }, [bankAccId, bankAccounts]);

    useEffect(() => {
        if (companyName && customerName && date && receiptNoToWatch && amount) {
            setWatchTicket(false);
        }
    }, [companyName, customerName, date, receiptNoToWatch, amount]);

    useEffect(() => {
        if (!open) return;
        refetchVoucher();
    }, [open]);

    const paramsPreview = new URLSearchParams({
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

    const handleCancel = () => {
        onClose();
        methods.reset(defaultValues);
        setSelectedBank(null);
        setbankKeyword('');
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
                {selectedReceipt ?
                    <TextField
                        value={selectedReceipt?.contractNo || ""}
                        label="Số hợp đồng"
                        disabled
                        sx={{
                            flex: 1,
                            '& .MuiInputBase-root.Mui-disabled': {
                                backgroundColor: '#ddd',
                            },
                        }}
                    />
                    :
                    <Field.Autocomplete
                        name="supplierContract"
                        label={`Số hợp đồng`}
                        options={vouchers}
                        loading={vouchersLoading}
                        getOptionLabel={(opt) => opt?.fullContractNoInfo ?? ''}
                        isOptionEqualToValue={(opt, val) => opt?.contractNo === val?.contractNo}
                        onInputChange={(_, value) => setContractKeyword(value)}
                        value={selectedVoucher}
                        fullWidth
                        onChange={(_, newValue) => {
                            methods.setValue('supplierContract', newValue?.contractNo ?? "", { shouldValidate: true });
                            setContractKeyword(newValue?.contractNo ?? '');
                        }}
                        noOptionsText="Không có dữ liệu"
                        sx={{
                            flex: 1,
                            minWidth: 200,
                            '& .MuiInputBase-root.Mui-disabled': {
                                backgroundColor: '#ddd',
                            },
                        }}
                        renderOption={(props, option) => (
                            <li {...props} key={option.id}>
                                {option.fullContractNoInfo ? option.fullContractNoInfo : ''}
                            </li>
                        )}
                        required
                        disabled={!!selectedReceipt}
                    />
                }
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
                    disabled={!!selectedReceipt}
                    sx={{ flex: 1 }}
                />
            </Stack>
            <Stack direction="row" spacing={3}>
                <Field.Text
                    name="payer"
                    label="Tên người nhận"
                    placeholder="Nhập tên người nhận tiền"
                    sx={{ flex: 1.5 }}
                />
                <Field.DatePicker
                    name="date"
                    label="Ngày lập phiếu"
                    sx={{ flex: 1 }}
                />
            </Stack>
            <Stack direction="row" spacing={3} mt={1.5}>
                <Box
                    flex={1.5}
                    display="flex"
                    flexDirection="column"
                    gap={3}
                >
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
                    {selectedReceipt ? "Lưu" : "Tạo phiếu chi"}
                </Button>
                {selectedReceipt &&
                    <Button
                        type="button"
                        variant="contained"
                        sx={{ ml: 1 }}
                        disabled={watchTicket}
                        fullWidth
                        onClick={() => { onPreviewReceipt(paramsPreview); }}
                    >
                        Xem phiếu
                    </Button>
                }
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
                        {selectedReceipt ? "Chỉnh sửa phiếu chi" : "Tạo phiếu chi"}
                    </Typography>
                </Box>
                <TextField
                    disabled
                    id="contractNo-disabled"
                    value={receiptNoToWatch}
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