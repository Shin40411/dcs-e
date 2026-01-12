import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Card, CardActions, CardContent, Dialog, DialogContent, DialogTitle, FormControlLabel, IconButton, Radio, RadioGroup, Stack, TextField, Typography } from "@mui/material";
import { memo, useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Field, Form } from "src/components/hook-form";
import { Iconify } from "src/components/iconify";
import { CloseIcon } from "yet-another-react-lightbox";
import { ReceiptAndSpendCreateDto, ReceiptAndSpendData, ReceiptAndSpendUpdateDto } from "src/types/internal";
import { InternalSpendSchema, InternalSpendSchemaType } from "./schema/spend-schema";
import { useDebounce } from "minimal-shared/hooks";
import { useGetBankAccounts } from "src/actions/bankAccount";
import { generateInternalReceipt } from "src/utils/random-func";
import { IBankAccountItem } from "src/types/bankAccount";
import { createOrUpdateReceipt } from "src/actions/internal";
import { useGetEmployees } from "src/actions/employee";
import { IEmployeeItem } from "src/types/employee";

interface FormDialogProps {
    selectedReceipt: ReceiptAndSpendData | null;
    open: boolean;
    onClose: () => void;
    mutation: () => void;
    totalRecord: number;
}

export function SpendNewEditForm({ selectedReceipt, open, onClose, mutation, totalRecord }: FormDialogProps) {
    const today = new Date();
    const [bankKeyword, setbankKeyword] = useState('');
    const debouncedbankKw = useDebounce(bankKeyword, 300);

    const [employeeKeyword, setEmployeeKeyword] = useState('');
    const debouncedEmployeeKw = useDebounce(employeeKeyword, 300);

    const { employees, employeesLoading } = useGetEmployees({
        pageNumber: 1,
        pageSize: 10,
        key: debouncedEmployeeKw,
        enabled: open
    });

    const { bankAccounts, bankAccountsLoading } = useGetBankAccounts({
        pageNumber: 1,
        pageSize: 20,
        enabled: open,
        key: debouncedbankKw
    });

    const getDefaultValues = (): InternalSpendSchemaType => ({
        spendType: "salary",
        employeeId: "",
        department: "",
        name: "",
        cost: 0,
        receiptDate: today.toISOString(),
        receiptNo: generateInternalReceipt('PC', totalRecord),
        address: "",
        reason: "",
        bankAccId: 0,
        bankNo: ""
    });

    const [selectedBank, setSelectedBank] = useState<IBankAccountItem | null>(null);
    const [selectedEmployee, setSelectedEmployee] = useState<IEmployeeItem | null>(null);

    const methods = useForm<InternalSpendSchemaType>({
        resolver: zodResolver(InternalSpendSchema),
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

    const spendType = useWatch({
        control,
        name: "spendType",
    });

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
                isReceive: false,
                name: data.name || "",
                reason: data.reason || "",
                receiptDate: data.receiptDate,
                targetCode: data.employeeId || "",
                targetType: spendType === "salary" ? "Salary" : "Other"
            };

            const updateBody: ReceiptAndSpendUpdateDto = {
                address: data.address || "",
                bankAccountID: data.bankAccId,
                bookKeeping: 1,
                cost: data.cost,
                credit: 0,
                debit: 0,
                isReceive: false,
                name: data.name || "",
                reason: data.reason || "",
                receiptDate: data.receiptDate,
            };

            await createOrUpdateReceipt(createBody, updateBody, selectedReceipt?.receiptId);

            toast.success(selectedReceipt?.receiptId ? "Dữ liệu phiếu chi đã được thay đổi!" : "Tạo phiếu chi thành công!");
            reset();
            mutation();
            onClose();
        } catch (error: any) {
            console.error(error);
            toast.error("Đã có lỗi xảy ra!");
        }
    });

    const bankAccId = watch('bankAccId');
    const employeeId = watch('employeeId');

    useEffect(() => {
        if (!open) return;
        if (selectedReceipt) {
            methods.reset({
                spendType: selectedReceipt.targetType === "Salary" ? "salary" : "other",
                name: selectedReceipt.name,
                cost: selectedReceipt.cost,
                receiptDate: selectedReceipt.receiptDate,
                receiptNo: selectedReceipt.receiptNo,
                address: selectedReceipt.address,
                reason: selectedReceipt.reason,
                bankAccId: selectedReceipt.bankAccountID,
                bankNo: selectedReceipt.bankNo,
                employeeId: selectedReceipt.targetCode,
            });

            if (selectedReceipt.bankAccountName) {
                setbankKeyword(selectedReceipt.bankAccountName);
                const found = bankAccounts.find((acc) => Number(acc.id) === Number(selectedReceipt.bankAccountID));
                if (found) {
                    setSelectedBank(found);
                }
            }
        } else {
            if (bankAccounts.length > 0) {
                const first = bankAccounts[0];
                setValue("bankAccId", Number(first.id), { shouldValidate: true });
                setValue("bankNo", first.bankNo);
                setSelectedBank(first);
            }
        }
    }, [open, selectedReceipt, bankAccounts]);

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
        if (!employeeId) {
            setSelectedEmployee(null);
            methods.setValue("department", "");
            return;
        }

        const found = employees.find((em) => em.code === employeeId);
        if (found) {
            setSelectedEmployee(found);
            methods.setValue("department", found.department);
        }
    }, [spendType, employeeId, employees]);

    const AddressField = memo(() => {
        return (
            <Field.Text
                name="address"
                label="Địa chỉ"
                required
                sx={{ flex: 1.5 }}
            />
        );
    });

    const DepartmentField = memo(() => {
        return (
            <Field.Text
                name="department"
                label="Phòng ban"
                sx={{
                    flex: 1.5,
                    '& .MuiInputBase-root.Mui-disabled': {
                        backgroundColor: '#ddd',
                    },
                }}
                disabled
            />
        );
    });

    const renderDetails = () => (
        <>
            <Stack direction="row" spacing={3} pt={3} mb={2}>
                {spendType === "other" ?
                    <Field.Text
                        name="name"
                        label="Người nhận tiền"
                        required
                        sx={{
                            flex: 1.5,
                        }}
                    />
                    :
                    <Field.Autocomplete
                        name="employeeId"
                        label={`Nhân viên nhận lương`}
                        options={employees}
                        loading={employeesLoading}
                        getOptionLabel={(opt) => opt?.name ?
                            opt.name : ''}
                        isOptionEqualToValue={(opt, val) => opt?.code === val?.code}
                        onInputChange={(_, value) => setEmployeeKeyword(value)}
                        value={selectedEmployee}
                        fullWidth
                        onChange={(_, newValue) => {
                            methods.setValue('employeeId', newValue?.code ?? "", { shouldValidate: true });
                            setEmployeeKeyword(newValue?.code ?? '');
                        }}
                        noOptionsText="Không tìm thấy nhân viên, vui lòng nhập mã"
                        sx={{ flex: 1.5 }}
                        renderOption={(props, option) => (
                            <li {...props} key={option.id}>
                                {option.name ? option.name : ''}
                            </li>
                        )}
                        required
                    />
                }
                <Field.DatePicker
                    name="receiptDate"
                    label="Ngày lập phiếu"
                    sx={{ flex: 1 }}
                />
            </Stack>
            <Stack direction="row" spacing={3} mb={2}>
                {spendType === "other"
                    ? <AddressField />
                    :
                    <DepartmentField />
                }
                <Field.Text
                    name="receiptNo"
                    label="Số phiếu chi"
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
                        label="Lý do chi tiền"
                    />
                    <Field.VNCurrencyInput
                        name="cost"
                        label="Số tiền chi"
                        helperText="Nhập số tiền chi"
                        required
                    />
                </Box>
                <Box flex={1} position="relative">
                    <Box position="absolute" top={-10} left={10} zIndex={1000} bgcolor="common.white">
                        <Typography variant="subtitle2" color="textSecondary">Tài khoản chi tiền</Typography>
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
        methods.reset(getDefaultValues());
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
                    {selectedReceipt ? 'Lưu' : 'Tạo phiếu chi'}
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
                                ? `Chỉnh sửa phiếu chi`
                                : 'Tạo phiếu chi'
                        }
                    </Typography>
                </Box>
                <Controller
                    name="spendType"
                    control={control}
                    render={({ field }) => (
                        <RadioGroup
                            row
                            // {...field}
                            value={field.value}
                            onChange={(e) => {
                                const newType = e.target.value as "salary" | "other";
                                field.onChange(newType);

                                if (newType === "salary") {
                                    methods.setValue("address", "");
                                } else {
                                    methods.setValue("department", "");
                                    methods.setValue("employeeId", "");
                                }
                            }}
                        >
                            <FormControlLabel value="salary" control={<Radio />} label="Chi lương" />
                            <FormControlLabel value="other" control={<Radio />} label="Chi khác" />
                        </RadioGroup>
                    )}
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