import { createWarehouseImport, updateWarehouseImport, useGetDetailWarehouseImportProduct, useGetSupplierContracts, useGetUnImportProduct, useGetWarehouseImports } from "src/actions/contractSupplier";
import { useAuthContext } from "src/auth/hooks";
import { IContractWarehouseImportDto, IContractWarehouseImportItem } from "src/types/warehouse-import";
import { ContractWareHouseSchema, ContractWareHouseSchemaType } from "../contract-supplier/schema/contract-warehouse";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { fDate } from "src/utils/format-time-vi";
import { paths } from "src/routes/paths";
import { toast } from "sonner";
import { Box, Button, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Skeleton, Stack, TextField, Typography } from "@mui/material";
import { Field, Form } from "src/components/hook-form";
import { Iconify } from "src/components/iconify";
import { CloseIcon } from "yet-another-react-lightbox";
import { WarehouseImportTable } from "./components/warehouse-import-table";
import dayjs from "dayjs";
import { IContractSupplyItem, IImportRemainingProduct } from "src/types/contractSupplier";
import { useDebounce } from "minimal-shared/hooks";
import { WareHouseImportSchema, WareHouseImportSchemaType } from "./schema/warehouse-import-schema";
import { generateWarehouseExport } from "src/utils/random-func";
import { ContractWarehouseTable } from "../contract-supplier/contract-warehouse-table";

interface FormDialogProps {
    selectedWarehouseImport: IContractWarehouseImportItem | null;
    open: boolean;
    onClose: () => void;
    mutation: () => void;
}

export function WarehouseImportNewEditForm({ selectedWarehouseImport, open, onClose, mutation }: FormDialogProps) {
    const { user } = useAuthContext();
    const today = new Date();
    const isEdit = Boolean(selectedWarehouseImport);

    const [contractkeyword, setContractKeyword] = useState('');
    const debouncedContractKw = useDebounce(contractkeyword, 300);
    const [selectedContract, setSelectedContract] = useState<IContractSupplyItem | null>(null);
    const [products, setProducts] = useState<IImportRemainingProduct[]>([]);

    const { contracts, contractsLoading } = useGetSupplierContracts({
        pageNumber: 1,
        pageSize: 20,
        key: debouncedContractKw,
        enabled: open
    });

    const { pagination: { totalRecord } } = useGetWarehouseImports({
        pageNumber: 1,
        pageSize: 999,
        enabled: open,
    });

    const {
        remainingProduct: initialProducts,
        remainingProductEmpty, remainingProductLoading
    } = useGetUnImportProduct(
        selectedContract?.id ?? 0,
        open && Boolean(selectedContract)
    );

    const {
        detailsProduct,
        detailsProductEmpty,
        detailsProductLoading
    } = useGetDetailWarehouseImportProduct(
        selectedWarehouseImport?.id || 0,
        open
    );

    const defaultValues: WareHouseImportSchemaType = {
        wareHouseNo: "",
        contract: "",
        exportDate: today.toISOString(),
        receiverAddress: "",
        receiverName: "",
        note: "",
    };

    const [watchTicket, setWatchTicket] = useState(true);

    const methods = useForm<WareHouseImportSchemaType>({
        resolver: zodResolver(WareHouseImportSchema),
        defaultValues
    });

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

    const onPreviewWarehouseImport = () => {
        const params = new URLSearchParams({
            isCreating: 'false',
            exportId: String(selectedWarehouseImport?.id),
            contractId: String(selectedWarehouseImport?.contractSupID),
            exportDate: String(fDate(exportDate)),
            contractNo: selectedWarehouseImport?.conntractSupNo,
            warehouseExportNo: warehouseExportNo,
            receiverName: receiverName,
            note: note,
            receiverAddress: receiverAddress,
            seller: selectedWarehouseImport?.employeeName || '',
        } as Record<string, string>);
        const queryString = params.toString();
        window.open(`${paths.warehouseImport}?${queryString}`, '_blank');
    }

    const onSubmit = handleSubmit(async (data) => {
        try {
            const initialPayload: IContractWarehouseImportDto = {
                supplierID: isEdit
                    ? selectedWarehouseImport?.supplierID || 0
                    : selectedContract?.supplierId || 0,
                contractID: isEdit
                    ? selectedWarehouseImport?.contractSupID || 0
                    : selectedContract?.id || 0,
                employeeID: selectedWarehouseImport?.employerID || user?.employeeId,
                importDate: data.exportDate ? dayjs(data.exportDate).format("YYYY-MM-DD") : null,
                reciverName: data.receiverName,
                reciverPhone: selectedWarehouseImport?.receiverPhone || "",
                receiverAddress: data.receiverAddress,
                note: data.note || "",
                discount: selectedWarehouseImport?.discount || 0,
                paid: selectedWarehouseImport?.paid || 0,
            };

            if (!selectedWarehouseImport) {
                const createPayload: IContractWarehouseImportDto = {
                    ...initialPayload,
                    products: products.map((item) => ({
                        productID: item.productID,
                        price: item.price,
                        quantity: item.quantity,
                        vat: item.vat,
                        openingStock: 0,
                    })),
                }

                await createWarehouseImport(createPayload);
                toast.success("Tạo phiếu nhập kho thành công!");
            } else {
                await updateWarehouseImport(String(selectedWarehouseImport.id), initialPayload);
                toast.success("Cập nhật phiếu nhập kho thành công!");
            }

            mutation();
            onClose();
            reset();
        } catch (error: any) {
            console.error(error);
            const message = error.message;
            toast.error(message || "Cập nhật phiếu nhập kho thất bại!");
        }
    });

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

    useEffect(() => {
        if (initialProducts && initialProducts.length > 0) {
            setProducts([...initialProducts]);
        }
    }, [initialProducts]);

    useEffect(() => {
        if (!selectedWarehouseImport) {
            setSelectedContract(null);
            setContractKeyword('');
            methods.reset({
                ...defaultValues,
                wareHouseNo: '',
            });
        } else {
            methods.setValue('contract', selectedWarehouseImport.conntractSupNo || "");
            methods.setValue('wareHouseNo', selectedWarehouseImport.warehouseImportNo);
            methods.setValue('exportDate', selectedWarehouseImport.createdDate);
            methods.setValue('receiverAddress', selectedWarehouseImport.reciverAddress || "");
            methods.setValue('receiverName', selectedWarehouseImport.receiverName);
            methods.setValue('note', selectedWarehouseImport.note || "");
        }

    }, [open, selectedWarehouseImport]);

    useEffect(() => {
        if (selectedWarehouseImport) {
            setContractKeyword('');
        }

    }, [selectedWarehouseImport?.id]);

    useEffect(() => {
        if (!selectedWarehouseImport) return;
        if (!contracts || contracts.length === 0) return;

        const found = contracts.find(
            (c) => c.contractNo === selectedWarehouseImport.conntractSupNo
        );

        setSelectedContract(found ?? null);
        methods.setValue("receiverName", found?.supplierName ?? "");
    }, [selectedWarehouseImport?.id, contracts]);

    useEffect(() => {
        if (!selectedContract) {
            methods.setValue('wareHouseNo', '');
            setProducts([]);
            return;
        }
        if (totalRecord === undefined) return;

        const newWareHouseNo = generateWarehouseExport(
            'PN',
            selectedContract.contractNo,
            totalRecord
        );

        methods.setValue('wareHouseNo', newWareHouseNo);
    }, [selectedContract, totalRecord]);

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
                <Field.Autocomplete
                    name="contract"
                    label={`Số hợp đồng`}
                    options={contracts}
                    loading={contractsLoading}
                    getOptionLabel={(opt) => opt?.contractNo ?
                        opt.contractNo : ''}
                    isOptionEqualToValue={(opt, val) =>
                        opt?.contractNo === val?.contractNo
                    }
                    onInputChange={(_, value) => setContractKeyword(value)}
                    value={selectedContract}
                    fullWidth
                    onChange={(_, newValue) => {
                        setSelectedContract(newValue);
                        methods.setValue('contract', newValue?.contractNo ?? "", { shouldValidate: true });
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
                            {option.contractNo ? option.contractNo : ''}
                        </li>
                    )}
                    required
                    disabled={isEdit}
                />
            </Stack>
            <Stack direction="row" spacing={3}>
                <TextField
                    value={isEdit ? selectedWarehouseImport?.compnayName : selectedContract?.companyName || ""}
                    label="Đơn vị nhận hàng"
                    placeholder="Đơn vị nhận hàng từ hợp đồng"
                    disabled
                    sx={{
                        flex: 1.5,
                        '& .MuiInputBase-root.Mui-disabled': {
                            backgroundColor: '#ddd',
                        },
                    }}
                />
                <Field.Text
                    name="wareHouseNo"
                    label="Số phiếu nhập kho"
                    required
                    sx={{ flex: 1 }}
                />
            </Stack>
            <Stack direction="row" spacing={3}>
                <TextField
                    value={isEdit ? selectedWarehouseImport?.employeeName : selectedContract?.seller || ""}
                    label="Tên nhân viên"
                    disabled
                    sx={{
                        flex: 1.5,
                        '& .MuiInputBase-root.Mui-disabled': {
                            backgroundColor: '#ddd',
                        },
                    }}
                />
                <Field.DatePicker
                    name="exportDate"
                    label="Ngày lập phiếu"
                    sx={{ flex: 1 }}
                />
            </Stack>
            <Field.Text
                name="note"
                label="Lý do nhập kho"
            />
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
                    {isEdit ? 'Lưu' : 'Tạo mới'}
                </Button>
                {isEdit &&
                    <Button
                        type="button"
                        variant="contained"
                        sx={{ ml: 1 }}
                        disabled={watchTicket}
                        fullWidth
                        onClick={onPreviewWarehouseImport}
                    >
                        {'Xem phiếu'}
                    </Button>
                }
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
                    <Typography fontWeight={700} textTransform="uppercase">
                        {isEdit ? 'Chỉnh sửa phiếu nhập kho' : 'Tạo phiếu nhập kho mới'}
                    </Typography>
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
                                    {isEdit ?
                                        <WarehouseImportTable
                                            remainingProduct={detailsProduct}
                                            remainingProductEmpty={detailsProductEmpty}
                                        />
                                        :
                                        <ContractWarehouseTable
                                            remainingProduct={products}
                                            remainingProductEmpty={products.length === 0}
                                            remainingProductLoading={remainingProductLoading}
                                            onQuantityChange={handleQuantityChange}
                                            onRemoveProduct={handleRemoveProduct}
                                        />
                                    }
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