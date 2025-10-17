import { Box, Button, CardActions, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, TextField, Typography } from "@mui/material";
import { useFieldArray, useForm } from "react-hook-form";
import { Iconify } from "src/components/iconify";
import { IContractDetails, IContractItem } from "src/types/contract";
import { generateReceipt } from "src/utils/random-func";
import { CloseIcon } from "yet-another-react-lightbox";
import { ContractWareHouseSchema, ContractWareHouseSchemaType } from "./schema/contract-warehouse";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, Form } from "src/components/hook-form";
import { ContractWarehouseTable } from "./contract-warehouse-table";
import { useState } from "react";

interface FileDialogProps {
    selectedContract: IContractItem;
    open: boolean;
    onClose: () => void;
}

export function ContractWareHouse({ selectedContract, open, onClose }: FileDialogProps) {
    const today = new Date();
    const defaultValues: ContractWareHouseSchemaType = {
        exportDate: today.toISOString(),
        receiverAddress: "",
        receiverName: "",
        note: "",
        products: [{
            id: undefined,
            product: "",
            unit: "",
            unitName: "",
            qty: 1,
            price: 0,
            vat: 0
        }],
    };

    const [totalPaid, setTotalPaid] = useState(0);

    const methods = useForm<ContractWareHouseSchemaType>({
        resolver: zodResolver(ContractWareHouseSchema),
        defaultValues
    });

    const [contractProductDetail, setContractProductDetail] = useState<IContractDetails>();

    const {
        reset,
        watch,
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const { fields, append, remove } = useFieldArray({
        control,
        name: "products",
    });

    const onSubmit = handleSubmit(async (data) => {
        try {
        } catch (error: any) {
        }
    });

    const renderDetails = () => (
        <>
            <Stack direction="row" spacing={3} pt={3}>
                <Field.Text
                    name="customerName"
                    label="Người nhận hàng"
                    helperText="Nhập tên người nhận hàng"
                    required
                    sx={{
                        flex: 1.5,
                    }}
                />
                <Field.DatePicker
                    name="date"
                    label="Ngày lập phiếu"
                    sx={{ flex: 1 }}
                />
            </Stack>
            <Stack direction="row" spacing={3}>
                <TextField defaultValue={selectedContract.seller} label="Tên nhân viên" disabled
                    sx={{
                        flex: 1.5,
                        '& .MuiInputBase-root.Mui-disabled': {
                            backgroundColor: '#ddd',
                        },
                    }} />
                <Field.Text
                    name="contractNo"
                    label="Số phiếu chi"
                    helperText="Nhập số phiếu chi"
                    required
                    sx={{ flex: 1 }}
                />
            </Stack>
            <Field.Text
                name="reason"
                label="Lý do xuất kho"
                helperText="Nhập lý do xuất kho"
            />
            <Field.Text
                name="address"
                label="Địa điểm"
                helperText="Nhập địa điểm xuất kho"
                required
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
                    loading={isSubmitting}
                    fullWidth
                >
                    {'Xem phiếu'}
                </Button>
                <Button
                    type="button"
                    variant="contained"
                    sx={{ ml: 1 }}
                    loading={isSubmitting}
                    fullWidth
                >
                    {'In phiếu'}
                </Button>
                <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => { onClose(); reset(); }}
                    fullWidth
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
            maxWidth="lg"
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
                    <Typography fontWeight={700} textTransform="uppercase">Phiếu xuất kho</Typography>
                </Box>
                <TextField
                    disabled
                    id="contractNo-disabled"
                    defaultValue={generateReceipt('PX', selectedContract.contractNo)}
                    sx={{ width: 400 }}
                />
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <Form methods={methods} onSubmit={onSubmit}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    overflow: 'hidden',
                }}
            >
                <DialogContent sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
                    <CardContent sx={{ pt: 0, px: 0 }}>
                        <Stack spacing={{ xs: 3, md: 2 }} direction="column">
                            {renderDetails()}
                            <ContractWarehouseTable
                                idContract={selectedContract?.id}
                                contractProductDetail={contractProductDetail}
                                methods={methods}
                                fields={fields}
                                append={append}
                                remove={remove}
                                setPaid={setTotalPaid}
                            />
                        </Stack>
                    </CardContent>
                </DialogContent>
                <DialogActions sx={{ flexShrink: 0, borderTop: '1px solid #e0e0e0', p: 4 }}>
                    {renderActions()}
                </DialogActions>
            </Form>
        </Dialog >
    );
}