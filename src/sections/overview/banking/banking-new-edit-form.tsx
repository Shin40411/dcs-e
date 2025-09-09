import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, CardActions, CardContent, Dialog, DialogContent, DialogTitle, Stack } from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createOrUpdateBankAccount } from "src/actions/bankAccount";
import { Field, Form } from "src/components/hook-form";
import { endpoints } from "src/lib/axios";
import { IBankAccountDto, IBankAccountItem } from "src/types/bankAccount";
import { mutate } from "swr";
import { z as zod } from 'zod';

type Props = {
    currentBankingAccount?: IBankAccountItem;
    open: boolean;
    onClose: () => void;
    selectedId?: number;
    page: number;
    rowsPerPage: number;
};

export const NewBankingSchema = zod.object({
    name: zod.string().min(1, "Tên tài khoản là bắt buộc"),
    bankNo: zod.string().min(5, "Số tài khoản không hợp lệ"),
    bank: zod.string().min(1, "Tên ngân hàng là bắt buộc"),
    balance: zod.number().nonnegative().default(0),
});

export type NewBankingSchemaType = zod.infer<typeof NewBankingSchema>;

export function BankingNewEditForm({ currentBankingAccount, open, onClose, selectedId, page, rowsPerPage }: Props) {
    const defaultValues: NewBankingSchemaType = {
        name: "",
        bankNo: "",
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
            methods.reset({
                ...defaultValues,
                name: currentBankingAccount.name ?? '',
                bankNo: currentBankingAccount.bankNo ?? '',
                bank: currentBankingAccount.bankName ?? '',
                balance: currentBankingAccount.balance ?? 0,
            });
        } else {
            methods.reset(defaultValues);
        }
    }, [currentBankingAccount, methods.reset]);

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
            mutate(endpoints.bankAccount.list(`?pageNumber=${page + 1}&pageSize=${rowsPerPage}&Status=1`));
            toast.success(currentBankingAccount ? 'Dữ liệu tài khoản ngân hàng đã được thay đổi!' : 'Tạo mới dữ liệu tài khoản ngân hàng thành công!');
            onClose();
            reset();
        } catch (error: any) {
            console.error(error);
            toast.error('Đã có lỗi xảy ra!');
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
                />
                <Field.Text
                    name="bankNo"
                    label="Số tài khoản ngân hàng"
                    helperText="Nhập số tài khoản"
                    sx={{ flex: 1 }}
                />
            </Stack>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Field.Text
                    name="bank"
                    label="Tên ngân hàng"
                    helperText="Nhập tên ngân hàng"
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
                    onClick={onClose}
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
        <Dialog open={open} onClose={onClose} fullWidth scroll={'paper'}>
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