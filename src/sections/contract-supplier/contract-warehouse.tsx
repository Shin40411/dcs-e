import { Box, Button, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { Iconify } from "src/components/iconify";
import { generateWarehouseExport } from "src/utils/random-func";
import { CloseIcon } from "yet-another-react-lightbox";
import { ContractWareHouseSchema, ContractWareHouseSchemaType } from "./schema/contract-warehouse";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, Form } from "src/components/hook-form";
import { ContractWarehouseTable } from "./contract-warehouse-table";
import { useEffect, useState } from "react";
import { createWarehouseExport } from "src/actions/contract";
import { IContractWarehouseExportDto } from "src/types/warehouseExport";
import { toast } from "sonner";
import { mutate } from "swr";
import { useAuthContext } from "src/auth/hooks";
import { paths } from "src/routes/paths";
import { fDate } from "src/utils/format-time-vi";
import { IContractSupplyItem, IImportRemainingProduct } from "src/types/contractSupplier";
import { createWarehouseImport, useGetUnImportProduct, useGetWarehouseImports } from "src/actions/contractSupplier";
import { IContractWarehouseImportDto } from "src/types/warehouse-import";
import dayjs from "dayjs";

interface FileDialogProps {
    selectedContract: IContractSupplyItem;
    open: boolean;
    onClose: () => void;
}

export function ContractWareHouse({ selectedContract, open, onClose }: FileDialogProps) {
    const { user } = useAuthContext();
    const today = new Date();

    const { pagination: { totalRecord }, mutation } = useGetWarehouseImports({
        pageNumber: 1,
        pageSize: 999,
        enabled: open,
    });
    const [products, setProducts] = useState<IImportRemainingProduct[]>([]);

    const {
        remainingProduct: initialProducts,
        remainingProductEmpty, remainingProductLoading
    } = useGetUnImportProduct(selectedContract.id, open);

    useEffect(() => {
        if (initialProducts && initialProducts.length > 0) {
            setProducts([...initialProducts]);
        }
    }, [initialProducts]);

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
        methods.setValue('wareHouseNo', generateWarehouseExport('PN', selectedContract.contractNo, totalRecord));
        setWarehouseExportNumber(generateWarehouseExport('PN', selectedContract.contractNo, totalRecord));
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

    const handleQuantityChange = (productID: number, newQuantity: number) => {
        setProducts(prev =>
            prev.map(p =>
                p.productID === productID
                    ? { ...p, quantity: newQuantity }
                    : p
            )
        );
    };

    const handleRemoveProduct = (productID: number) => {
        if (products.length <= 1) {
            toast.warning("Không thể xóa! Phải có ít nhất 1 sản phẩm trong phiếu xuất kho");
            return;
        }
        setProducts(prev => prev.filter(p => p.productID !== productID));
    };

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
        window.open(`${paths.warehouseImport}?${queryString}`, '_blank');
    }

    const onSubmit = handleSubmit(async (data) => {
        try {
            const payload: IContractWarehouseImportDto = {
                supplierID: selectedContract.supplierId,
                contractID: selectedContract.id,
                employeeID: user?.employeeId || 0,
                importDate: data.exportDate ? dayjs(data.exportDate).format("YYYY-MM-DD") : null,
                reciverName: data.receiverName,
                reciverPhone: selectedContract.supplierPhone || '',
                receiverAddress: data.receiverAddress,
                paid: selectedContract.total,
                note: data.note || "",
                discount: 0,
                products: products.map((item) => ({
                    productID: item.productID,
                    price: item.price,
                    quantity: item.quantity,
                    vat: item.vat,
                    openingStock: 0,
                })),
            };

            await createWarehouseImport(payload);

            toast.success("Tạo phiếu nhập kho thành công!");
            reset();
            mutation();
            onClose();
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Tạo phiếu nhập kho thất bại!");
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
                    label="Người giao hàng"
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
                <TextField value={selectedContract.companyName} label="Đơn vị giao hàng" disabled
                    sx={{
                        flex: 1.5,
                        '& .MuiInputBase-root.Mui-disabled': {
                            backgroundColor: '#ddd',
                        },
                    }} />
                <Field.Text
                    name="wareHouseNo"
                    label="Số phiếu nhập kho"
                    required
                    sx={{ flex: 1 }}
                />
            </Stack>
            <Stack direction="row" spacing={3}>
                <Field.Text
                    name="note"
                    label="Lý do nhập kho"
                    sx={{ flex: 1.5 }}
                    placeholder="Nhập lý do nhập kho"
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
                placeholder="Nhập địa điểm nhận hàng"
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
                    <Typography fontWeight={700} textTransform="uppercase">Phiếu nhập kho</Typography>
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
                                remainingProduct={products}
                                remainingProductEmpty={products.length === 0}
                                remainingProductLoading={remainingProductLoading}
                                onQuantityChange={handleQuantityChange}
                                onRemoveProduct={handleRemoveProduct}
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