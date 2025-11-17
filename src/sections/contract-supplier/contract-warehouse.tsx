import { Box, Button, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { Iconify } from "src/components/iconify";
import { IContractItem } from "src/types/contract";
import { generateWarehouseExport } from "src/utils/random-func";
import { CloseIcon } from "yet-another-react-lightbox";
import { ContractWareHouseSchema, ContractWareHouseSchemaType } from "./schema/contract-warehouse";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, Form } from "src/components/hook-form";
import { ContractWarehouseTable } from "./contract-warehouse-table";
import { useEffect, useState } from "react";
import { createWarehouseExport, useGetUnExportProduct, useGetWarehouseExports } from "src/actions/contract";
import { IContractWarehouseExportDto } from "src/types/warehouseExport";
import { toast } from "sonner";
import { mutate } from "swr";
import { useAuthContext } from "src/auth/hooks";
import { paths } from "src/routes/paths";
import { fDate } from "src/utils/format-time-vi";

interface FileDialogProps {
    selectedContract: IContractItem;
    open: boolean;
    onClose: () => void;
}

export function ContractWareHouse({ selectedContract, open, onClose }: FileDialogProps) {
    const { user } = useAuthContext();
    const today = new Date();

    const { pagination: { totalRecord } } = useGetWarehouseExports({
        pageNumber: 1,
        pageSize: 999,
        enabled: open,
    });

    const { remainingProduct, remainingProductEmpty, remainingProductLoading } = useGetUnExportProduct(selectedContract.id, open);

    const [watchTicket, setWatchTicket] = useState(true);
    const [warehouseExportNumber, setWarehouseExportNumber] = useState<string>('');

    const defaultValues: ContractWareHouseSchemaType = {
        wareHouseNo: warehouseExportNumber,
        exportDate: today.toISOString(),
        receiverAddress: "",
        receiverName: "",
        note: "",
    };

    const methods = useForm<ContractWareHouseSchemaType>({
        resolver: zodResolver(ContractWareHouseSchema),
        defaultValues
    });

    useEffect(() => {
        methods.setValue('wareHouseNo', generateWarehouseExport('PX', selectedContract.contractNo, totalRecord));
        setWarehouseExportNumber(generateWarehouseExport('PX', selectedContract.contractNo, totalRecord));
    }, [totalRecord, setWarehouseExportNumber]);

    const {
        reset,
        watch,
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const warehouseExportNo = watch('wareHouseNo');
    const exportDate = watch('exportDate');
    const note = watch('note');
    const receiverAddress = watch('receiverAddress');
    const receiverName = watch('receiverName');

    const onPreviewWarehouseExport = () => {
        const params = new URLSearchParams({
            isCreating: 'true',
            contractId: String(selectedContract.id),
            exportDate: String(fDate(exportDate)),
            contractNo: selectedContract.contractNo,
            warehouseExportNo: warehouseExportNo,
            receiverName: receiverName,
            position: selectedContract.position,
            note: note,
            receiverAddress: receiverAddress,
            seller: selectedContract.seller
        } as Record<string, string>);
        const queryString = params.toString();
        window.open(`${paths.warehouseExport}?${queryString}`, '_blank');
    }

    const onSubmit = handleSubmit(async (data) => {
        try {
            const payload: IContractWarehouseExportDto = {
                warehouseExportNo: data.wareHouseNo,
                customerID: selectedContract.customerID,
                contractID: selectedContract.id,
                employeeID: user?.accessToken || null,
                exportDate: data.exportDate,
                receiverName: data.receiverName,
                receiverPhone: "",
                receiverAddress: data.receiverAddress,
                note: data.note || "",
                discount: selectedContract.discount,
                paid: selectedContract.total,
                products:
                    remainingProduct.map((p) => ({
                        productID: p.productID,
                        quantity: p.quantity,
                    })),
            };

            await createWarehouseExport(payload);

            toast.success("Tạo phiếu xuất kho thành công!");
            reset();
            mutate(
                (k) => typeof k === "string" && k.startsWith("/api/v1/warehouse-exports/get-exports"),
                undefined,
                { revalidate: true }
            );
            onClose();
        } catch (error: any) {
            console.error(error);
            toast.error("Tạo phiếu xuất kho thất bại!");
        }
    });

    useEffect(() => {
        if (warehouseExportNo && exportDate && receiverAddress && receiverName) {
            setWatchTicket(false);
        } else {
            setWatchTicket(true);
        }
    }, [warehouseExportNo, exportDate, receiverAddress, receiverName]);

    const renderDetails = () => (
        <>
            <Stack direction="row" spacing={3} pt={1}>
                <Field.Text
                    name="receiverName"
                    label="Người nhận hàng"
                    required
                    sx={{
                        flex: 1.5,
                    }}
                />
                <Field.DatePicker
                    name="exportDate"
                    label="Ngày lập phiếu"
                    sx={{ flex: 1 }}
                />
            </Stack>
            <Stack direction="row" spacing={3}>
                <TextField value={selectedContract.companyName} label="Đơn vị nhận hàng" disabled
                    sx={{
                        flex: 1.5,
                        '& .MuiInputBase-root.Mui-disabled': {
                            backgroundColor: '#ddd',
                        },
                    }} />
                <Field.Text
                    name="wareHouseNo"
                    label="Số phiếu xuất kho"
                    required
                    sx={{ flex: 1 }}
                />
            </Stack>
            <Stack direction="row" spacing={3}>
                <Field.Text
                    name="note"
                    label="Lý do xuất kho"
                    sx={{ flex: 1.5 }}
                />
                <TextField value={selectedContract.seller} label="Tên nhân viên" disabled
                    sx={{
                        flex: 1,
                        '& .MuiInputBase-root.Mui-disabled': {
                            backgroundColor: '#ddd',
                        },
                    }} />
            </Stack>
            <Field.Text
                name="receiverAddress"
                label="Địa điểm"
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
                    disabled={watchTicket}
                    fullWidth
                    onClick={onPreviewWarehouseExport}
                >
                    {'Xem phiếu'}
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
                    <Typography fontWeight={700} textTransform="uppercase">Phiếu xuất kho</Typography>
                </Box>
                <TextField
                    disabled
                    id="contractNo-disabled"
                    value={warehouseExportNo || ''}
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
                <DialogContent sx={{ flex: 1, height: '100%', p: 2 }}>
                    <CardContent sx={{ pt: 0, px: 0 }}>
                        <Stack spacing={{ xs: 3, md: 2 }} direction="column">
                            {renderDetails()}
                            <ContractWarehouseTable
                                remainingProduct={remainingProduct}
                                remainingProductEmpty={remainingProductEmpty}
                                remainingProductLoading={remainingProductLoading}
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