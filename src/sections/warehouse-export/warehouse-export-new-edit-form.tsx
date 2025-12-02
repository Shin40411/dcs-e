import { Box, Button, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Skeleton, Stack, TextField, Typography } from "@mui/material";
import { Field, Form } from "src/components/hook-form";
import { Iconify } from "src/components/iconify";
import { IContractWarehouseExportDto, IContractWarehouseExportItem } from "src/types/warehouseExport";
import { CloseIcon } from "yet-another-react-lightbox";
import { IContractItem, IContractRemainingProduct } from "src/types/contract";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fDate } from "src/utils/format-time-vi";
import { paths } from "src/routes/paths";
import { useEffect, useState } from "react";
import { useAuthContext } from "src/auth/hooks";
import { createWarehouseExport, updateWarehouseExport, useGetContracts, useGetDetailWarehouseExportProduct, useGetUnExportProduct, useGetWarehouseExports } from "src/actions/contract";
import { toast } from "sonner";
import { mutate } from "swr";
import { WarehouseExportTable } from "./components/warehouse-export-table";
import { useDebounce } from "minimal-shared/hooks";
import { WareHouseSchema, WareHouseSchemaType } from "./schema/warehouse-export-schema";
import { generateWarehouseExport } from "src/utils/random-func";
import { ContractWarehouseTable } from "../contract/contract-warehouse-table";

interface FormDialogProps {
    selectedWarehouseExport: IContractWarehouseExportItem | null;
    open: boolean;
    onClose: () => void;
    refetchList: () => void;
}

export function WarehouseExportNewEditForm({ selectedWarehouseExport, refetchList, open, onClose }: FormDialogProps) {
    const { user } = useAuthContext();
    const today = new Date();
    const isEdit = Boolean(selectedWarehouseExport);

    const [contractkeyword, setContractKeyword] = useState('');
    const debouncedContractKw = useDebounce(contractkeyword, 300);
    const [selectedContract, setSelectedContract] = useState<IContractItem | null>(null);
    const [products, setProducts] = useState<IContractRemainingProduct[]>([]);
    const [watchTicket, setWatchTicket] = useState(true);

    const { contracts, contractsLoading } = useGetContracts({
        pageNumber: 1,
        pageSize: 20,
        enabled: open,
        key: debouncedContractKw
    });

    const { pagination: { totalRecord } } = useGetWarehouseExports({
        pageNumber: 1,
        pageSize: 999,
        ContractNo: selectedContract?.contractNo,
        enabled: open,
    });

    const {
        remainingProduct: initialProducts,
        remainingProductEmpty,
        remainingProductLoading
    } = useGetUnExportProduct(
        selectedContract?.id ?? 0,
        open && Boolean(selectedContract)
    );

    const {
        detailsProduct,
        detailsProductEmpty,
        detailsProductLoading
    } = useGetDetailWarehouseExportProduct(
        selectedWarehouseExport?.id || 0,
        open
    );

    const defaultValues: WareHouseSchemaType = {
        wareHouseNo: "",
        contract: "",
        exportDate: today.toISOString(),
        receiverAddress: "",
        receiverName: "",
        note: "",
    };

    const methods = useForm<WareHouseSchemaType>({
        resolver: zodResolver(WareHouseSchema),
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

    useEffect(() => {
        if (initialProducts && initialProducts.length > 0) {
            setProducts([...initialProducts]);
        }
    }, [initialProducts]);

    useEffect(() => {
        if (open) {
            if (!selectedWarehouseExport) {
                setSelectedContract(null);
                setContractKeyword('');
                methods.reset({
                    ...defaultValues,
                    wareHouseNo: '',
                });
            } else {
                methods.setValue('wareHouseNo', selectedWarehouseExport.warehouseExportNo);
                methods.setValue('exportDate', selectedWarehouseExport.createdDate);
                methods.setValue('receiverAddress', selectedWarehouseExport.reciverAddress);
                methods.setValue('receiverName', selectedWarehouseExport.reciverName);
                methods.setValue('note', selectedWarehouseExport.note || "");
            }
        }
    }, [open, selectedWarehouseExport]);

    useEffect(() => {
        if (selectedWarehouseExport) {
            setContractKeyword('');
            setSelectedContract(null);
        } else {
            setSelectedContract(null);
        }
    }, [selectedWarehouseExport?.id]);

    useEffect(() => {
        if (!selectedWarehouseExport) return;
        if (!contracts || contracts.length === 0) return;

        const found = contracts.find(
            (c) => c.contractNo === selectedWarehouseExport.contractNo
        );

        if (found) {
            setSelectedContract(found);
            methods.setValue("contract", found.contractNo);
            methods.setValue("receiverName", found.customerName);
        } else {
            setSelectedContract(null);
            methods.setValue("contract", "");
            methods.setValue("receiverName", "");
        }
    }, [contracts, selectedWarehouseExport]);

    useEffect(() => {
        if (!selectedContract) {
            methods.setValue('wareHouseNo', '');
            setProducts([]);
            return;
        }
        if (totalRecord === undefined) return;

        const newWareHouseNo = generateWarehouseExport(
            'PX',
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
            const formattedDate =
                data.exportDate != null
                    ? new Date(data.exportDate).toISOString().split('T')[0]
                    : null;

            const initialPayload: IContractWarehouseExportDto = {
                customerID: isEdit
                    ? selectedWarehouseExport?.customerID || 0
                    : selectedContract?.customerID || 0,
                contractID: isEdit
                    ? selectedWarehouseExport?.contractID || 0
                    : selectedContract?.id || 0,
                employeeID: selectedWarehouseExport?.employeeID || user?.accessToken,
                exportDate: formattedDate,
                receiverName: data.receiverName || "",
                receiverPhone: selectedWarehouseExport?.reciverPhone || "",
                receiverAddress: data.receiverAddress,
                note: data.note || "",
                discount: selectedWarehouseExport?.discount || 0,
                paid: selectedWarehouseExport?.paid || 0,
            };

            if (isEdit) {
                await updateWarehouseExport(String(selectedWarehouseExport!.id), initialPayload);
                toast.success("Cập nhật phiếu xuất kho thành công!");
            } else {
                const createPayload: IContractWarehouseExportDto = {
                    ...initialPayload,
                    warehouseExportNo: data.wareHouseNo,
                    products: products
                        .filter(p => p.quantity > 0)
                        .map((p) => ({
                            productID: p.productID,
                            quantity: p.quantity,
                        })),
                }
                await createWarehouseExport(createPayload);
                toast.success("Tạo phiếu xuất kho thành công!");
            }

            reset();
            refetchList();
            onClose();
        } catch (error: any) {
            console.error(error);
            const message = error.message;
            toast.error(message || "Cập nhật phiếu xuất kho thất bại!");
        }
    });

    const renderDetails = () => (
        <>
            <Stack direction="row" spacing={3} pt={1}>
                <Field.Text
                    name="receiverName"
                    label="Người nhận hàng"
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
                    value={isEdit ? selectedWarehouseExport?.companyName : selectedContract?.companyName || ""}
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
                    label="Số phiếu xuất kho"
                    required
                    disabled={isEdit}
                    sx={{
                        flex: 1,
                        '& .MuiInputBase-root.Mui-disabled': {
                            backgroundColor: '#ddd',
                        },
                    }}
                />
            </Stack>
            <Stack direction="row" spacing={3}>
                <TextField
                    value={isEdit ? selectedWarehouseExport?.employerName : selectedContract?.seller || ""}
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
                label="Lý do xuất kho"
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
                        onClick={onPreviewWarehouseExport}
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
                        {isEdit ? 'Chỉnh sửa phiếu xuất kho' : 'Tạo phiếu xuất kho mới'}
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
                                        <WarehouseExportTable
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