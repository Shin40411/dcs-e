import { Box, Button, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Skeleton, Stack, TextField, Typography } from "@mui/material";
import { Field, Form } from "src/components/hook-form";
import { Iconify } from "src/components/iconify";
import { IContractWarehouseExportDto, IContractWarehouseExportItem } from "src/types/warehouseExport";
import { CloseIcon } from "yet-another-react-lightbox";
import { IContractItem } from "src/types/contract";
import { ContractWareHouseSchema, ContractWareHouseSchemaType } from "../contract/schema/contract-warehouse";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fDate } from "src/utils/format-time-vi";
import { paths } from "src/routes/paths";
import { useEffect, useState } from "react";
import { useAuthContext } from "src/auth/hooks";
import { updateWarehouseExport, useGetContract, useGetDetailWarehouseExportProduct } from "src/actions/contract";
import { toast } from "sonner";
import { mutate } from "swr";
import { WarehouseExportTable } from "./components/warehouse-export-table";

interface FormDialogProps {
    selectedWarehouseExport: IContractWarehouseExportItem | null;
    open: boolean;
    onClose: () => void;
}

export function WarehouseExportNewEditForm({ selectedWarehouseExport, open, onClose }: FormDialogProps) {
    const { user } = useAuthContext();
    const today = new Date();
    const {
        detailsProduct,
        detailsProductEmpty,
        detailsProductLoading
    } = useGetDetailWarehouseExportProduct(
        selectedWarehouseExport?.id || 0,
        open
    );

    const defaultValues: ContractWareHouseSchemaType = {
        wareHouseNo: "",
        exportDate: today.toISOString(),
        receiverAddress: "",
        receiverName: "",
        note: "",
    };

    const [watchTicket, setWatchTicket] = useState(true);

    const methods = useForm<ContractWareHouseSchemaType>({
        resolver: zodResolver(ContractWareHouseSchema),
        defaultValues
    });

    useEffect(() => {
        if (!selectedWarehouseExport) return;
        methods.setValue('wareHouseNo', selectedWarehouseExport.warehouseExportNo);
        methods.setValue('exportDate', selectedWarehouseExport.createdDate);
        methods.setValue('receiverAddress', selectedWarehouseExport.reciverAddress);
        methods.setValue('receiverName', selectedWarehouseExport.reciverName);
        methods.setValue('note', selectedWarehouseExport.note || "");
    }, [selectedWarehouseExport, methods.reset]);

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
            isCreating: 'false',
            exportId: String(selectedWarehouseExport?.id),
            contractId: String(selectedWarehouseExport?.contractID || 0),
            exportDate: String(fDate(exportDate)),
            contractNo: selectedWarehouseExport?.contractNo,
            warehouseExportNo: warehouseExportNo,
            receiverName: receiverName,
            position: "",
            note: note,
            receiverAddress: receiverAddress,
            seller: selectedWarehouseExport?.employerName
        } as Record<string, string>);
        const queryString = params.toString();
        window.open(`${paths.warehouseExport}?${queryString}`, '_blank');
    }

    const onSubmit = handleSubmit(async (data) => {
        try {
            const payload: IContractWarehouseExportDto = {
                customerID: selectedWarehouseExport?.customerID || 0,
                contractID: selectedWarehouseExport?.contractID || 0,
                employeeID: selectedWarehouseExport?.employeeID || user?.accessToken,
                exportDate: data.exportDate,
                receiverName: data.receiverName,
                receiverPhone: selectedWarehouseExport?.reciverPhone || "",
                receiverAddress: data.receiverAddress,
                note: data.note || "",
                discount: selectedWarehouseExport?.discount || 0,
                paid: selectedWarehouseExport?.paid || 0,
            };

            if (!selectedWarehouseExport) {
                toast.error("Không tìm thấy id phiếu xuất kho!");
                return;
            }

            await updateWarehouseExport(String(selectedWarehouseExport.id), payload);

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
                <TextField value={selectedWarehouseExport?.companyName} label="Đơn vị nhận hàng" disabled
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
                <TextField value={selectedWarehouseExport?.employerName} label="Tên nhân viên" disabled
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
                            {detailsProductLoading ? (
                                <>
                                    <Stack spacing={2}>
                                        {[1, 2, 3, 4].map((i) => (
                                            <Stack key={i} direction="row" spacing={3}>
                                                <Skeleton variant="rectangular" height={56} sx={{ flex: 1.5 }} />
                                                <Skeleton variant="rectangular" height={56} sx={{ flex: 1 }} />
                                            </Stack>
                                        ))}
                                    </Stack>

                                    <Box mt={2}>
                                        <Skeleton variant="rectangular" height={40} width="40%" sx={{ mb: 1 }} />
                                        {[...Array(4)].map((_, index) => (
                                            <Skeleton
                                                key={index}
                                                variant="rectangular"
                                                height={48}
                                                sx={{ mb: 1, borderRadius: 1 }}
                                            />
                                        ))}
                                    </Box>
                                </>
                            ) : (
                                <>
                                    {renderDetails()}
                                    <WarehouseExportTable
                                        remainingProduct={detailsProduct}
                                        remainingProductEmpty={detailsProductEmpty}
                                    />
                                </>
                            )}
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