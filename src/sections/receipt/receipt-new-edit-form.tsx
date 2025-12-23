import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Card, CardActions, CardContent, Dialog, DialogContent, DialogTitle, IconButton, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createReceiptContract, updateReceiptContract, useGetContracts, useGetReceiptContract, useGetVoucherCode } from "src/actions/contract";
import { Field, Form } from "src/components/hook-form";
import { Iconify } from "src/components/iconify";
import { IContractItem, IReceiptContract, IReceiptContractDto, VoucherItem } from "src/types/contract";
import { fDate } from "src/utils/format-time-vi";
import { CloseIcon } from "yet-another-react-lightbox";
import { useGetBankAccounts } from "src/actions/bankAccount";
import { useDebounce } from "minimal-shared/hooks";
import { IBankAccountItem } from "src/types/bankAccount";
import { ReceiptSchema, ReceiptSchemaType } from "./schema/receipt-schema";
import { generateReceipt } from "src/utils/random-func";

interface FormDialogProps {
    selectedReceipt: IReceiptContract | null;
    open: boolean;
    onClose: () => void;
    mutation: () => void;
    onPreviewReceipt: (params: URLSearchParams) => void;
}

export function ReceiptNewEditForm({ selectedReceipt, open, onClose, mutation, onPreviewReceipt }: FormDialogProps) {
    const today = new Date();
    const isEdit = Boolean(selectedReceipt);

    const [bankKeyword, setbankKeyword] = useState('');
    const debouncedbankKw = useDebounce(bankKeyword, 300);
    const [selectedBank, setSelectedBank] = useState<IBankAccountItem | null>(null);

    const [contractkeyword, setContractKeyword] = useState('');
    const debouncedContractKw = useDebounce(contractkeyword, 300);
    const [selectedVoucher, setSelectedVoucher] = useState<VoucherItem | null>(null);

    const { vouchers, vouchersLoading, mutate: refetchVoucher } = useGetVoucherCode({
        pageNumber: 1,
        pageSize: 20,
        key: debouncedContractKw,
        enabled: open
    });

    const { pagination: { totalRecord } } = useGetReceiptContract({
        pageNumber: 1,
        pageSize: 999,
        ContractNo: selectedReceipt ? selectedReceipt.contractNo
            : selectedVoucher ? selectedVoucher.contractNo : "",
        enabled: open,
        ContractType: 'Customer',
        ReceiptType: 'Collect'
    });

    const { bankAccounts, bankAccountsLoading } = useGetBankAccounts({
        pageNumber: 1,
        pageSize: 10,
        enabled: open,
        key: debouncedbankKw
    });

    const [watchTicket, setWatchTicket] = useState(true);

    const defaultValues: ReceiptSchemaType = isEdit
        ? {
            companyName: selectedReceipt?.companyName ?? "",
            customerName: selectedReceipt?.customerName ?? "",
            amount: selectedReceipt?.amount ?? 0,
            receiptNo: selectedReceipt?.receiptNo ?? "",
            date: selectedReceipt?.date ?? today.toISOString(),
            address: selectedReceipt?.address ?? "",
            payer: selectedReceipt?.payer ?? "",
            contract: selectedReceipt?.contractNo ?? "",
            reason: selectedReceipt?.reason ?? "",
            bankAccId: selectedReceipt?.bankAccountID ?? 0,
            bankNo: selectedReceipt?.bankNo ?? "",
        }
        : {
            companyName: "",
            customerName: "",
            amount: 0,
            receiptNo: "",
            date: today.toISOString(),
            address: "",
            payer: "",
            contract: "",
            reason: "",
            bankAccId: 0,
            bankNo: "",
        };

    const methods = useForm<ReceiptSchemaType>({
        resolver: zodResolver(ReceiptSchema),
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
                contractNo:
                    isEdit && selectedReceipt
                        ? selectedReceipt?.contractNo
                        : data.contract,
                date: data.date,
                receiptType: "Collect",
                amount: data.amount,
                note: data.reason || "",
                contractType: "Customer",
                bankAccountID: data.bankAccId || undefined,
                companyName: data.companyName,
                customerName: data.customerName,
                address: data.address || "",
                payer: data.payer,
                reason: data.reason || "",
            };

            if (isEdit) {
                if (!selectedReceipt) return;
                await updateReceiptContract(payload, selectedReceipt.receiptId);
                toast.success("Dữ liệu phiếu thu đã được thay đổi!");
            } else {
                await createReceiptContract(payload);
                toast.success("Tạo phiếu thu thành công!");
            }

            reset();
            mutation();
            onClose();
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Đã có lỗi xảy ra!");
        }
    });

    const bankAccId = methods.watch('bankAccId');
    const contractNo = methods.watch('contract');
    const companyName = watch('companyName');
    const customerName = watch('customerName');
    const date = watch('date');
    const receiptNoToWatch = watch('receiptNo');
    const amount = watch('amount');
    const payer = watch('payer');
    const reason = watch('reason');
    const address = watch('address');

    useEffect(() => {
        if (!open) return;
        if (!isEdit) {
            reset(defaultValues);
            setbankKeyword("");
            setSelectedBank(null);
            return;
        }

        reset(defaultValues);
    }, [open, selectedReceipt]);

    useEffect(() => {
        if (!open) return;
        if (isEdit) return;
        if (bankAccounts.length === 0) return;
        if (methods.getValues("bankAccId")) return;

        const first = bankAccounts[0];
        setValue("bankAccId", Number(first.id), { shouldValidate: true });
        setValue("bankNo", first.bankNo);
        setSelectedBank(first);

    }, [bankAccounts, open, isEdit]);

    useEffect(() => {
        if (!open) return;
        if (isEdit) return;
        if (!contractNo) {
            setSelectedVoucher(null);
            methods.setValue("amount", defaultValues.amount);
            methods.setValue("customerName", defaultValues.customerName);
            methods.setValue("companyName", defaultValues.companyName);
            methods.setValue('receiptNo', defaultValues.receiptNo);
            return;
        }

        const foundVoucher = vouchers.find((vou) => vou.contractNo === contractNo);

        if (foundVoucher) {
            setSelectedVoucher(foundVoucher);
            methods.setValue("amount", foundVoucher.remainingAmount);
            methods.setValue("companyName", foundVoucher.companyName);
            methods.setValue("customerName", foundVoucher.customerName);
            methods.setValue('receiptNo', generateReceipt('PT', totalRecord));
        }
    }, [
        open,
        contractNo,
        vouchers
    ]);

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
        if (companyName && customerName && date && receiptNoToWatch && amount && payer) {
            setWatchTicket(false);
        }
    }, [companyName, customerName, date, receiptNoToWatch, amount, payer]);

    useEffect(() => {
        if (!open) return;
        refetchVoucher();
    }, [open]);

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

    const handleCancel = () => {
        onClose();
        reset();
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
                {isEdit ?
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
                        name="contract"
                        label={`Số hợp đồng`}
                        options={vouchers || []}
                        loading={vouchersLoading}
                        onInputChange={(_, value) => setContractKeyword(value)}
                        getOptionLabel={(opt) => opt?.fullContractInfo ?? ''}
                        isOptionEqualToValue={(opt, val) => opt?.contractNo === val?.contractNo}
                        value={selectedVoucher}
                        fullWidth
                        onChange={(_, newValue) => {
                            methods.setValue('contract', newValue?.contractNo ?? "", { shouldValidate: true });
                            setContractKeyword(newValue.contractNo);
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
                            <li {...props} key={option.contractNo}>
                                {option.fullContractInfo ? option.fullContractInfo : ''}
                            </li>
                        )}
                        required
                        disabled={isEdit}
                    />
                }
            </Stack>
            <Stack direction="row" spacing={3}>
                <Field.Text
                    name="payer"
                    label="Tên người nộp"
                    required
                    helperText="Nhập tên người nộp"
                    sx={{ flex: 1.5 }}
                />
                <Field.Text
                    name="receiptNo"
                    label="Số phiếu thu"
                    required
                    sx={{
                        flex: 1,
                        '& .MuiInputBase-root.Mui-disabled': {
                            backgroundColor: '#ddd',
                        },
                    }}
                    disabled
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
                <Field.DatePicker
                    name="date"
                    label="Ngày lập phiếu"
                    sx={{ flex: 1 }}
                />
            </Stack>
            <Field.Text
                name="address"
                label="Địa chỉ"
                helperText="Nhập địa chỉ người nộp tiền"
            />
            <Stack direction="row" spacing={3}>
                <Box
                    flex={1.5}
                    display="flex"
                    flexDirection="column"
                    gap={3}
                >
                    <Field.Text
                        name="reason"
                        label="Lý do nộp"
                    />
                    <Field.VNCurrencyInput
                        name="amount"
                        label="Số tiền nộp"
                        helperText="Nhập số tiền nộp"
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
                    {isEdit ? 'Lưu' : 'Tạo mới'}
                </Button>
                {isEdit &&
                    <Button
                        type="button"
                        variant="contained"
                        sx={{ ml: 1 }}
                        disabled={watchTicket}
                        fullWidth
                        onClick={() => onPreviewReceipt(params)}
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
                    <Typography fontWeight={700} textTransform="uppercase">{isEdit ? "Chỉnh sửa phiếu thu" : "Tạo phiếu thu mới"}</Typography>
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