import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Card, CardActions, CardContent, Dialog, DialogContent, DialogTitle, IconButton, Stack, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { Iconify } from "src/components/iconify";
import { TransferCreateDto, TransferData } from "src/types/internal";
import { CloseIcon } from "yet-another-react-lightbox";
import { InternalTransferSchema, InternalTransferSchemaType } from "./schema/transfer-schema";
import { Field, Form } from "src/components/hook-form";
import { toast } from "sonner";
import { useGetBankAccounts } from "src/actions/bankAccount";
import { useDebounce } from "minimal-shared/hooks";
import { useEffect, useState } from "react";
import { IBankAccountItem } from "src/types/bankAccount";
import { internalTransfer } from "src/actions/internal";

interface FormDialogProps {
    selectedTransfer: TransferData | null;
    open: boolean;
    onClose: () => void;
    mutation: () => void;
    totalRecord: number;
}

export function TransferNewEditForm({ selectedTransfer, open, onClose, mutation, totalRecord }: FormDialogProps) {
    const [bankKeywordSend, setBankKeywordSend] = useState('');
    const debouncedKwSend = useDebounce(bankKeywordSend, 300);

    const [bankKeywordReceive, setBankKeywordReceive] = useState('');
    const debouncedKwReceive = useDebounce(bankKeywordReceive, 300);


    const [bankSendName, setBankSendName] = useState<string>('');

    const { bankAccounts: bankAccountsSend, bankAccountsLoading: loadingSend } = useGetBankAccounts({
        pageNumber: 1,
        pageSize: 10,
        enabled: open,
        key: debouncedKwSend,
    });

    const { bankAccounts: bankAccountsReceive, bankAccountsLoading: loadingReceive } = useGetBankAccounts({
        pageNumber: 1,
        pageSize: 10,
        enabled: open,
        key: debouncedKwReceive,
    });

    const methods = useForm<InternalTransferSchemaType>({
        resolver: zodResolver(InternalTransferSchema),
        defaultValues: {
            bankSendId: 0,
            bankSendNo: '',
            bankSendBalance: 0,
            bankReceiveId: 0,
            bankReceiveNo: '',
            bankReceiveBalance: 0,
            sendAmount: 0,
            note: ''
        }
    });

    const {
        reset,
        watch,
        setValue,
        handleSubmit,
        formState: { isSubmitting }
    } = methods;

    const [selectedBankSend, setSelectedBankSend] = useState<IBankAccountItem | null>(null);
    const [selectedBankReceive, setSelectedBankReceive] = useState<IBankAccountItem | null>(null);

    const bankSendId = watch('bankSendId');
    const bankReceiveId = watch('bankReceiveId');

    useEffect(() => {
        if (open && selectedTransfer) {
            reset({
                bankSendId: selectedTransfer.bankAccountIDSend,
                bankSendNo: selectedTransfer.sendedBankNo,
                bankSendBalance: 0,

                bankReceiveId: selectedTransfer.bankAccountIDReceived,
                bankReceiveNo: selectedTransfer.receivedBankNo,
                bankReceiveBalance: 0,

                sendAmount: selectedTransfer.cost || 0,
                note: selectedTransfer.note || ''
            });

            const send = bankAccountsSend.find(
                b => Number(b.id) === selectedTransfer.bankAccountIDSend
            ) || null;

            const receive = bankAccountsReceive.find(
                b => Number(b.id) === selectedTransfer.bankAccountIDReceived
            ) || null;

            setSelectedBankSend(send);
            setSelectedBankReceive(receive);
        }
    }, [open, selectedTransfer, bankAccountsSend, bankAccountsReceive, reset]);


    useEffect(() => {
        if (!bankSendId || bankSendId === 0) {
            setSelectedBankSend(null);
            setValue("bankSendNo", "");
            setValue("bankSendBalance", 0);
            return;
        }

        const found = bankAccountsSend.find(b => Number(b.id) === bankSendId);

        if (found) {
            setSelectedBankSend(found);
            setValue("bankSendNo", found.bankNo);
            setValue("bankSendBalance", found.balance);
            setBankSendName(found.name);
        }
    }, [bankSendId, bankAccountsSend, setValue]);

    useEffect(() => {
        if (!bankReceiveId) {
            setSelectedBankReceive(null);
            setValue("bankReceiveNo", "");
            setValue("bankReceiveBalance", 0);
            return;
        }

        const found = bankAccountsReceive.find(b => Number(b.id) === bankReceiveId);

        if (found) {
            setSelectedBankReceive(found);
            setValue("bankReceiveNo", found.bankNo);
            setValue("bankReceiveBalance", found.balance);
        }
    }, [bankReceiveId, bankAccountsReceive, setValue]);

    const handleClose = () => {
        reset();
        setSelectedBankSend(null);
        setSelectedBankReceive(null);
        setBankKeywordSend('');
        setBankKeywordReceive('');
        onClose();
    };

    const onSubmit = handleSubmit(async (data) => {
        try {
            const createBody: TransferCreateDto = {
                bankSendId: data.bankSendId,
                bankReceiveId: data.bankReceiveId,
                sendAmount: data.sendAmount,
                note: data.note?.trim() || `${bankSendName} chuyển tiền`,
            };

            await internalTransfer(createBody);
            toast.success("Chuyển khoản nội bộ thành công!");
            mutation();
            handleClose();
        } catch (error: any) {
            console.error(error);
            toast.error("Đã có lỗi xảy ra!");
        }
    });

    const renderAutocomplete = (
        label: string,
        name: "bankSendId" | "bankReceiveId",
        selectedValue: IBankAccountItem | null,
        setSelected: (val: IBankAccountItem | null) => void,
        options: IBankAccountItem[],
        loading: boolean,
        onKeywordChange: (kw: string) => void,
    ) => (
        <Field.Autocomplete
            name={name}
            label={label}
            options={options}
            loading={loading}
            getOptionLabel={(opt) =>
                typeof opt === "object" ? opt.name : ""
            }
            isOptionEqualToValue={(opt, val) => opt.id === val.id}
            value={selectedValue}
            onInputChange={(_, val) => onKeywordChange(val)}
            onChange={(_, newVal) => {
                setValue(name, newVal?.id ?? 0, { shouldValidate: true });
                setSelected(newVal ?? null);
            }}
            sx={{ mt: 1 }}
            fullWidth
            required
            renderOption={(props, option) => (
                <li {...props} key={option.id}>
                    {option.name}
                </li>
            )}
            noOptionsText="Không có dữ liệu"
        />
    );

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogTitle sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #e0e0e0'
            }}>
                <Box display="flex" alignItems="center" gap={1}>
                    <Iconify icon="ph:file-x-bold" width={24} />
                    <Typography fontWeight={700} textTransform="uppercase"> Chuyển khoản nội bộ </Typography>
                </Box> <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <Form methods={methods} onSubmit={onSubmit}>
                    <Stack direction="row" spacing={3} pt={4} px={4}>
                        <Box flex={1} position="relative">
                            <Box position="absolute" top={-10} left={10} zIndex={1000} bgcolor="common.white">
                                <Typography variant="subtitle2" color="textSecondary">Từ tài khoản</Typography>
                            </Box>

                            <Card sx={{ p: 2, gap: 2, display: 'flex', flexDirection: 'column' }}>
                                {renderAutocomplete(
                                    "Tài khoản chuyển",
                                    "bankSendId",
                                    selectedBankSend,
                                    setSelectedBankSend,
                                    bankAccountsSend,
                                    loadingSend,
                                    setBankKeywordSend
                                )}
                                <Field.Text name="bankSendNo" label="Số tài khoản" disabled />
                                <Field.VNCurrencyInput name="bankSendBalance" label="Số dư" disabled />
                            </Card>
                        </Box>

                        <Box flex={1} position="relative">
                            <Box position="absolute" top={-10} left={10} zIndex={1000} bgcolor="common.white">
                                <Typography variant="subtitle2" color="textSecondary">
                                    Đến tài khoản
                                </Typography>
                            </Box>

                            <Card sx={{ p: 2, gap: 2, display: 'flex', flexDirection: 'column' }}>
                                {renderAutocomplete(
                                    "Tài khoản nhận",
                                    "bankReceiveId",
                                    selectedBankReceive,
                                    setSelectedBankReceive,
                                    bankAccountsReceive,
                                    loadingReceive,
                                    setBankKeywordReceive
                                )}
                                <Field.Text name="bankReceiveNo" label="Số tài khoản" disabled />
                                <Field.VNCurrencyInput name="bankReceiveBalance" label="Số dư" disabled />
                            </Card>
                        </Box>
                    </Stack>

                    <Stack spacing={3} px={4} py={3}>
                        <Field.VNCurrencyInput name="sendAmount" label="Số tiền chuyển" required />
                        <Field.Text name="note" label="Nội dung chuyển" />
                    </Stack>

                    <Box borderBottom="1px solid #ddd" mb={2} />

                    <CardActions sx={{ mb: 2 }}>
                        <Button type="submit" variant="contained" loading={isSubmitting} fullWidth>
                            Lưu
                        </Button>
                        <Button variant="outlined" color="inherit" onClick={handleClose} fullWidth disabled={isSubmitting}>
                            Hủy bỏ
                        </Button>
                    </CardActions>
                </Form>
            </DialogContent>
        </Dialog>
    );
}