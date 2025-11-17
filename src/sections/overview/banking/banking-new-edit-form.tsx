import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, CardActions, CardContent, Dialog, DialogContent, DialogTitle, MenuItem, Stack, Typography } from "@mui/material";
import { useDebounce } from "minimal-shared/hooks";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createOrUpdateBankAccount, useGetCallVietQrData } from "src/actions/bankAccount";
import { Field, Form } from "src/components/hook-form";
import { Image } from "src/components/image";
import { BankQrItem, IBankAccountDto, IBankAccountItem } from "src/types/bankAccount";
import { mutate } from "swr";
import { z as zod } from 'zod';

type Props = {
    currentBankingAccount?: IBankAccountItem;
    open: boolean;
    onClose: () => void;
    selectedId?: number;
};

export const NewBankingSchema = zod.object({
    name: zod.string().min(1, "Tên tài khoản là trường bắt buộc").max(200, "Tên tài khoản vượt quá giới hạn cho phép"),
    bankNo: zod.string()
        .min(6, "Số tài khoản không hợp lệ")
        .max(15, "Số tài khoản vượt quá giới hạn cho phép (Giới hạn 15 ký tự)")
        .regex(/^[0-9]+$/, "Số tài khoản chỉ được chứa số"),
    bank: zod.string().min(1, "Tên ngân hàng là trường bắt buộc"),
    balance: zod.number({ coerce: true })
        .nonnegative({ message: "Số dư không được âm" })
        .default(0)
        .optional(),
});

export type NewBankingSchemaType = zod.infer<typeof NewBankingSchema>;

export function BankingNewEditForm({ currentBankingAccount, open, onClose, selectedId }: Props) {
    const [qrBankKeyword, setQrBankKeyword] = useState('');
    const debouncedqrBankKw = useDebounce(qrBankKeyword, 300);

    const { vietQrItem, vietQrItemLoading, vietQrItemEmpty } = useGetCallVietQrData({
        pageNumber: 1,
        pageSize: 20,
        key: debouncedqrBankKw,
        enabled: open || !!currentBankingAccount
    });

    const [selectedQrBank, setSelectedQrBank] = useState<BankQrItem | null>(null);

    const defaultValues: NewBankingSchemaType = {
        name: "",
        bankNo: "0",
        bank: "",
        balance: 0,
    };

    const methods = useForm<NewBankingSchemaType>({
        resolver: zodResolver(NewBankingSchema),
        defaultValues: currentBankingAccount
            ? {
                ...defaultValues,
                name: currentBankingAccount.name,
                bankNo: currentBankingAccount.bankNo,
                bank: currentBankingAccount.bankName,
                balance: currentBankingAccount.balance,
            }
            : defaultValues,
    });

    useEffect(() => {
        if (currentBankingAccount) {
            methods.setValue("name", currentBankingAccount.name ?? '');
            methods.setValue("bankNo", currentBankingAccount.bankNo ?? '');
            methods.setValue("bank", currentBankingAccount.bankName ?? '');
            methods.setValue("balance", currentBankingAccount.balance ?? 0);
        } else {
            methods.reset(defaultValues);
        }
    }, [currentBankingAccount, methods.reset]);

    const bankFromVietQr = methods.watch('bank');

    useEffect(() => {
        if (!vietQrItem.length) return;

        const found = vietQrItem.find((b) => b.shortName === bankFromVietQr);
        setSelectedQrBank(found ?? null);
    }, [bankFromVietQr, vietQrItem.length]);

    const onBankClose = () => {
        onClose();
        setSelectedQrBank(null);
        setQrBankKeyword('');
    }

    const {
        reset,
        watch,
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            const payloadData: IBankAccountDto = {
                name: data.name,
                Bank: data.bank ?? "",
                bankNo: data.bankNo,
                balance: data.balance ?? 0,
            };

            await createOrUpdateBankAccount(selectedId ?? 0, payloadData);
            // mutate(endpoints.bankAccount.list(`?pageNumber=${page + 1}&pageSize=${rowsPerPage}&Status=1`));
            mutate(
                (k) => typeof k === "string" && k.startsWith("/api/v1/bank-accounts/bank-accounts"),
                undefined,
                { revalidate: true }
            );

            toast.success(currentBankingAccount ? 'Dữ liệu tài khoản ngân hàng đã được thay đổi!' : 'Tạo mới dữ liệu tài khoản ngân hàng thành công!');
            onClose();
            reset();
        } catch (error: any) {
            console.error(error);
            if (error.message) {
                toast.error(error.message);
            } else {
                toast.error("Đã có lỗi xảy ra!");
            }
        }
    });

    const renderDetails = () => (
        <Stack spacing={3} pt={1}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Field.Text
                    name="name"
                    label="Tên tài khoản ngân hàng"
                    helperText="Nhập tên tài khoản"
                    sx={{ flex: 1 }}
                    required
                />
                <Field.Text
                    name="bankNo"
                    label="Số tài khoản ngân hàng"
                    helperText="Nhập số tài khoản"
                    sx={{ flex: 1 }}
                    required
                />
            </Stack>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Field.Autocomplete
                    name="bank"
                    label={`Chọn ngân hàng`}
                    options={vietQrItem}
                    loading={vietQrItemLoading}
                    getOptionLabel={(opt) => opt?.shortName || ''}
                    isOptionEqualToValue={(opt, val) => opt?.shortName === val?.shortName}
                    onInputChange={(_, value) => setQrBankKeyword(value)}
                    value={selectedQrBank}
                    fullWidth
                    onChange={(_, newValue) => {
                        methods.setValue('bank', newValue?.shortName ?? '', { shouldValidate: true });
                        setQrBankKeyword(newValue?.shortName ?? '');
                    }}
                    noOptionsText="Không có dữ liệu"
                    renderOption={(props, option) => (
                        <MenuItem {...props} key={option.shortName} sx={{ display: 'flex', flex: '1 1' }}>
                            <Box width={100} mr={5}>
                                <Image
                                    src={option.logo} alt={option.name}
                                    sx={{ objectFit: 'cover' }}
                                />
                            </Box>
                            <Typography variant="body2" fontWeight={600}>
                                {option.shortName ? option.shortName : ""}
                            </Typography>
                        </MenuItem>
                    )}
                />
                <Field.VNCurrencyInput
                    name="balance"
                    label="Số dư tài khoản"
                />
            </Stack>
        </Stack>
    );

    const renderActions = () => (
        <Box sx={{ width: '100%' }}>
            <Stack direction="row" spacing={2} width="100%">
                <Button
                    variant="outlined"
                    color="inherit"
                    onClick={onBankClose}
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
                    {!currentBankingAccount ? 'Tạo mới' : 'Lưu thay đổi'}
                </Button>
            </Stack>
        </Box>
    );
    return (
        <Dialog open={open} onClose={onBankClose} fullWidth scroll={'paper'} maxWidth={"md"}>
            <DialogTitle>
                {currentBankingAccount ? 'Chỉnh sửa tài khoản ngân hàng' : 'Tạo tài khoản ngân hàng'}
            </DialogTitle>
            <DialogContent dividers={true}>
                <Form methods={methods} onSubmit={onSubmit}>
                    <CardContent sx={{ pt: 0, px: 0 }}>
                        <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
                            {renderDetails()}
                        </Stack>
                    </CardContent>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }} />
                    <CardActions>
                        {renderActions()}
                    </CardActions>
                </Form>
            </DialogContent>
        </Dialog >
    )
}