import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, MenuItem, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { Field, Form } from "src/components/hook-form";
import { Iconify } from "src/components/iconify";
import { IContractDao, IContractDetailDto, IContractDetails, IContractDto, IContractItem, IProductFormEdit } from "src/types/contract";
import { ContractFormValues, contractSchema } from "./schema/contract-schema";
import { DetailItem } from "../quotation/helper/DetailItem";
import { useGetCustomers } from "src/actions/customer";
import { useDebounce } from "minimal-shared/hooks";
import { useEffect, useState } from "react";
import { ICustomerItem } from "src/types/customer";
import { ContractItemsTable } from "./contract-product-table";
import { ContractCustomerForm } from "./contract-customer-form";
import { generateContractNo } from "src/utils/random-func";
import { addMoreProducts, createOrUpdateContract, editProductForm, useGetContract } from "src/actions/contract";
import { mapProductsToItems } from "./helper/mapProductToItems";
import { endpoints } from "src/lib/axios";
import { mutate } from "swr";
import { toast } from "sonner";
import { editAllContractDetails } from "./helper/mapContractProducts";

type ContractFormProps = {
    open: boolean;
    onClose: () => void;
    selectedContract: IContractItem | null;
    detailsFromQuotation: any[];
    customerIdFromQuotation?: number | null;
};

export function ContractForm({ open, onClose, selectedContract, detailsFromQuotation, customerIdFromQuotation }: ContractFormProps) {
    const today = new Date();
    const [customerkeyword, setCustomerKeyword] = useState('');
    const debouncedCustomerKw = useDebounce(customerkeyword, 300);
    const [totalPaid, setTotalPaid] = useState(0);
    const [originalItems, setOriginalItems] = useState<IContractDetailDto[]>([]);

    const { contract: CurrentContract } = useGetContract({
        contractId: selectedContract?.id ?? 0,
        pageNumber: 1,
        pageSize: 999,
        options: { enabled: !!selectedContract?.id }
    });

    const { customers, customersLoading, pagination: CustomerRecords } = useGetCustomers({
        pageNumber: 1,
        pageSize: 999,
        key: debouncedCustomerKw,
        enabled: true
    });

    const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);

    const [contractProductDetail, setContractProductDetail] = useState<IContractDetails>();

    const [selectedCustomer, setSelectedCustomer] = useState<ICustomerItem | null>(null);

    const defaultValues: ContractFormValues = {
        contractNo: generateContractNo('KH'),
        customerId: 0,
        createDate: today.toISOString(),
        signatureDate: today.toISOString(),
        deliveryAddress: "",
        deliveryTime: today.toISOString(),
        downPayment: 0,
        nextPayment: 0,
        lastPayment: 0,
        copiesNo: 1,
        keptNo: 1,
        status: 1,
        note: "",
        discount: 0,
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

    const methods = useForm<ContractFormValues>({
        mode: 'onSubmit',
        resolver: zodResolver(contractSchema),
        defaultValues,
    });

    useEffect(() => {
        if (detailsFromQuotation?.length > 0 && customerIdFromQuotation) {
            const mapped = mapProductsToItems(detailsFromQuotation);
            methods.setValue("products", mapped);
            methods.setValue("customerId", customerIdFromQuotation);
            return;
        }

        if (!selectedContract) {
            methods.reset(defaultValues);
            setOriginalItems(
                defaultValues.products.map((item, i) => ({
                    productID: item.product ?? "",
                    quantity: item.qty ?? 0,
                    unit: item.unitName || "",
                    price: item.price || 0
                }))
            );
            return;
        }

        if (!CurrentContract) return;

        const currentDetails = CurrentContract.items.find(
            (q) => q.contractID === selectedContract.id
        );

        if (currentDetails) {
            setContractProductDetail(currentDetails);
        }

        const mappedItems = mapProductsToItems(currentDetails?.products || []);
        methods.setValue("customerId", selectedContract.customerID ?? 0);
        methods.setValue("contractNo", selectedContract.contractNo);
        methods.setValue("signatureDate", selectedContract.signatureDate ?? null);
        methods.setValue("createDate", selectedContract.createDate ?? null);
        methods.setValue("deliveryAddress", selectedContract.deliveryAddress ?? '');
        methods.setValue("deliveryTime", selectedContract.deliveryTime ?? null);
        methods.setValue("downPayment", selectedContract.downPayment);
        methods.setValue("nextPayment", selectedContract.nextPayment);
        methods.setValue("lastPayment", selectedContract.lastPayment);
        methods.setValue("copiesNo", selectedContract.copiesNo);
        methods.setValue("keptNo", selectedContract.keptNo);
        methods.setValue("status", selectedContract.status ?? 1);
        methods.setValue("products", mappedItems);
        methods.setValue("note", selectedContract.note ?? "");
        methods.setValue("discount", selectedContract.discount);

        setOriginalItems(
            mappedItems.map((item, i) => ({
                productID: item.product ?? "",
                quantity: item.qty ?? 0,
                unit: item.unitName || "",
                price: item.price || 0
            }))
        );

    }, [detailsFromQuotation, selectedContract, CurrentContract, methods.reset]);

    const customerId = methods.watch('customerId');

    useEffect(() => {
        if (!customerId) {
            setSelectedCustomer(null);
            return;
        }

        const found = customers.find((cus) => Number(cus.id) === Number(customerId));
        if (found) {
            setSelectedCustomer(found);
        }
    }, [customerId]);

    const {
        reset,
        watch,
        setValue,
        setError,
        clearErrors,
        handleSubmit,
        control,
        formState: { isSubmitting },
    } = methods;

    const { fields, append, remove } = useFieldArray({
        control,
        name: "products",
    });

    const onSubmit = handleSubmit(async (data: ContractFormValues) => {
        try {
            const basePayload = {
                ContractNo: data.contractNo,
                customerId: data.customerId,
                signatureDate: data.signatureDate,
                deliveryAddress: data.deliveryAddress || "",
                deliveryTime: data.deliveryTime,
                downPayment: data.downPayment,
                nextPayment: data.nextPayment,
                lastPayment: data.lastPayment,
                copiesNo: data.copiesNo,
                keptNo: data.keptNo,
                status: data.status,
                note: data.note ?? '',
                discount: data.discount
            };

            const bodyPayload: IContractDto = {
                ...basePayload,
                products: data.products
                    .filter((item) => item.product && item.product !== "")
                    .map((item, i): IContractDetailDto => ({
                        productID: item.product ?? "",
                        quantity: item.qty ?? 0,
                        unit: item.unitName || "",
                        price: item.price || 0
                    })),
            };

            const updatePayload: IContractDao = {
                ...basePayload,
            };

            const productPayload: IProductFormEdit[] = data.products
                .map((item, idx) => ({
                    rowId: item.id,
                    productID: Number(item.product),
                    price: item.price || 0,
                    quantity: item.qty || 0,
                    vat: item.vat || 0,
                    unit: item.unitName ?? "",
                }));

            // console.log(bodyPayload);

            await createOrUpdateContract(
                selectedContract?.id ?? null,
                bodyPayload,
                updatePayload
            );

            if (selectedContract) {
                if (!productPayload) return;

                for (const item of productPayload) {
                    await editProductForm(item.rowId, item);
                }

                const newItems = bodyPayload.products.filter(
                    (item) => !originalItems.some((o) => o.productID === item.productID)
                );

                if (newItems.length > 0) {
                    await addMoreProducts(selectedContract.id, newItems);
                }
                else {
                    await editAllContractDetails(bodyPayload, selectedContract.id);
                }
            }

            toast.success(
                selectedContract
                    ? "Dữ liệu hợp đồng đã được thay đổi!"
                    : "Tạo hợp đồng thành công!"
            );

            mutate(
                (k) => typeof k === "string" && k.startsWith("/api/v1/contracts/contracts"),
                undefined,
                { revalidate: true }
            );

            if (selectedContract?.id) {
                mutate(endpoints.contract.detail(`?pageNumber=1&pageSize=999&ContractId=${selectedContract?.id}`));
            }

            onClose();
            reset(defaultValues);
        } catch (error: any) {
            console.error(error);
            if (error.message) {
                toast.error(error.message);
            } else {
                toast.error("Đã có lỗi xảy ra!");
            }
        }
    });

    const renderActions = () => (
        <DialogActions
            sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                bgcolor: "background.paper",
                borderTop: "1px solid",
                borderColor: "divider",
                p: 2,
                gap: 2,
                zIndex: 9
            }}
        >
            <Button
                variant="outlined"
                color="inherit"
                size="large"
                sx={{ flex: 1, py: 1.5 }}
                onClick={() => {
                    onClose();
                    reset(defaultValues);
                }}
                loading={isSubmitting}
            >
                Hủy
            </Button>
            <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{ flex: 1, py: 1.5 }}
                disabled={isCreatingCustomer}
                loading={isSubmitting}
            >
                {selectedContract ? `Lưu hợp đồng` : 'Tạo hợp đồng'}
            </Button>
        </DialogActions>
    );

    const products = useWatch({
        control,
        name: "products",
    }) || [];

    const downPayment = useWatch({
        control,
        name: "downPayment"
    });

    const nextPayment = useWatch({
        control,
        name: "nextPayment"
    });

    const calcAmount = (item: { qty?: number; price?: number; vat?: number }) => {
        const qty = Number(item?.qty) || 0;
        const price = Number(item?.price) || 0;
        const vat = Number(item?.vat) || 0;
        return qty * price * (1 + vat / 100);
    };

    const total = (products || []).reduce((acc, i) => acc + calcAmount(i), 0);

    useEffect(() => {
        if (total > 0) {
            const down = Number(downPayment) || 0;
            const next = Number(nextPayment) || 0;

            // Nếu cả 2 ô đều đang rỗng -> tính mặc định theo % 30/40/30
            if (!down && !next) {
                const downDefault = Math.round(total * 0.3);
                const nextDefault = Math.round(total * 0.4);
                const lastDefault = Math.max(total - downDefault - nextDefault, 0);

                setValue("downPayment", downDefault, { shouldValidate: true });
                setValue("nextPayment", nextDefault, { shouldValidate: true });
                setValue("lastPayment", lastDefault, { shouldValidate: true });
                clearErrors(["downPayment", "nextPayment"]);
                return;
            }

            // Nếu người dùng đã nhập (khác mặc định) thì không auto tính lại nữa
            if (down + next > total) {
                setError("downPayment", {
                    type: "manual",
                    message: "Tổng tiền trả trước và trả sau không được vượt quá tổng tiền hợp đồng",
                });
                setError("nextPayment", {
                    type: "manual",
                    message: "Tổng tiền trả trước và trả sau không được vượt quá tổng tiền hợp đồng",
                });
            } else {
                clearErrors(["downPayment", "nextPayment"]);
                const last = Math.max(total - down - next, 0);
                if (last < total) {
                    setValue("lastPayment", last, { shouldValidate: true });
                }
            }
        }
    }, [total, downPayment, nextPayment, setError, clearErrors, setValue]);

    const renderDetails = () => (
        <Stack direction={{ xs: "column", sm: "column", md: "row", lg: "row", xl: "row" }} spacing={3} sx={{ mt: 1 }}>
            {renderLeftColumn()}
            <Divider
                flexItem
                orientation="vertical"
                sx={{
                    display: { xs: "none", md: "block" },
                }}
            />
            <Divider
                flexItem
                orientation="horizontal"
                sx={{
                    display: { xs: "block", md: "none" },
                }}
            />
            {/* Section thông tin thanh toán */}
            <Stack width={{ xs: "100%", sm: "100%", md: "70%" }} spacing={2} sx={{ height: "100%" }}>
                <Box>
                    <Typography variant="subtitle2">
                        Thông tin thanh toán
                    </Typography>
                    <Stack direction="row" spacing={2} my={2}>
                        <Field.VNCurrencyInput
                            label="Lần 1"
                            name="downPayment"
                            sx={{ maxWidth: 150 }}
                        />
                        <Field.VNCurrencyInput
                            label="Lần 2"
                            name="nextPayment"
                            sx={{ maxWidth: 150 }}
                        />
                        <Field.VNCurrencyInput
                            label="Còn lại"
                            name="lastPayment"
                            sx={{ maxWidth: 150 }}
                            disabled
                        />
                    </Stack>
                </Box>
                {/* Section Bảng sản phẩm */}
                <ContractItemsTable
                    idContract={selectedContract?.id}
                    contractProductDetail={contractProductDetail}
                    methods={methods}
                    fields={fields}
                    append={append}
                    remove={remove}
                    setPaid={setTotalPaid}
                />
            </Stack>
        </Stack>
    );

    const renderLeftColumn = () => (
        <Stack width={{ xs: "100%", sm: "100%", md: "30%" }} spacing={3}>
            {/* Section Thông tin khách hàng */}
            <Box>
                <Stack direction={{ xs: "column", md: "row" }} gap={2} justifyContent="space-between">
                    <Typography variant="subtitle2">Thông tin khách hàng</Typography>
                    <Stack direction="row" justifyContent="space-between" gap={1} alignItems="center">
                        <Field.Autocomplete
                            name="customerId"
                            label="Chọn khách hàng có sẵn"
                            options={customers}
                            loading={customersLoading}
                            getOptionLabel={(opt) => opt?.name ?
                                opt.name :
                                opt?.companyName ?
                                    opt.companyName : ''}
                            isOptionEqualToValue={(opt, val) => opt?.id === val?.id}
                            onInputChange={(_, value) => setCustomerKeyword(value)}
                            value={selectedCustomer}
                            fullWidth
                            onChange={(_, newValue) => {
                                methods.setValue('customerId', newValue?.id ?? 0, { shouldValidate: true });
                                setCustomerKeyword(newValue?.name ?? '');
                            }}
                            noOptionsText="Không có dữ liệu"
                            sx={{ flex: 1, minWidth: 200 }}
                            renderOption={(props, option) => (
                                <li {...props} key={option.id}>
                                    {option.name ? option.name : option.companyName}
                                </li>
                            )}
                        />
                        <Stack direction="row">
                            <Tooltip title="Tạo khách hàng mới">
                                <IconButton
                                    color="inherit"
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: 'transparent'
                                        },
                                    }}
                                    onClick={() => setIsCreatingCustomer(true)}
                                >
                                    <Iconify
                                        icon="line-md:person-add"
                                    />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    </Stack>
                </Stack>
                <Stack spacing={2} sx={{ mt: 2 }}>
                    <Stack direction="row" gap={2}>
                        <DetailItem label="Tên khách hàng" value={selectedCustomer?.name ?? ""} />
                        <DetailItem label="Tên công ty" value={selectedCustomer?.companyName ?? ""} />
                    </Stack>
                    <Stack direction="row" gap={2}>
                        <DetailItem label="Email khách hàng" value={selectedCustomer?.email ?? ""} />
                        <DetailItem label="Số điện thoại" value={selectedCustomer?.phone ?? ""} />
                    </Stack>
                </Stack>
            </Box>

            {/* Section Thông tin hợp đồng */}
            <Box>
                <Typography variant="subtitle2">
                    Thông tin hợp đồng
                </Typography>
                <Stack direction={{ xs: "column", md: "row" }} sx={{ mt: 2 }} spacing={2}>
                    <Field.Text
                        label="Số hợp đồng"
                        name="contractNo"
                        disabled={!!selectedContract}
                    />
                    <Field.Select label="Trạng thái" name="status">
                        <MenuItem key={0} value={0}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: 1 }}>
                                <span>Hủy bỏ</span>
                                <Iconify icon="fluent-color:dismiss-circle-16" />
                            </Box>
                        </MenuItem>
                        <MenuItem key={1} value={1}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: 1 }}>
                                <span>Nháp</span>
                                <Iconify icon="material-symbols:draft" />
                            </Box>
                        </MenuItem>
                        <MenuItem key={2} value={2}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: 1 }}>
                                <span>Chờ duyệt</span>
                                <Iconify icon="streamline-pixel:interface-essential-waiting-hourglass-loading" />
                            </Box>
                        </MenuItem>
                        <MenuItem key={3} value={3}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: 1 }}>
                                <span>Đang thực hiện</span>
                                <Iconify icon="line-md:uploading-loop" />
                            </Box>
                        </MenuItem>
                        <MenuItem key={4} value={4}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: 1 }}>
                                <span>Đã hoàn thành</span>
                                <Iconify icon="fluent-color:checkmark-circle-16" />
                            </Box>
                        </MenuItem>
                    </Field.Select>
                </Stack>
                <Stack direction={{ xs: "column", md: "row" }} sx={{ mt: 2 }} spacing={2}>
                    <Field.DatePicker name="createDate" label="Ngày tạo" />
                    <Field.DatePicker name="signatureDate" label="Ngày ký" />
                </Stack>
                <Stack direction={{ xs: "column", md: "row" }} sx={{ mt: 2 }} spacing={2}>
                    <Field.Text
                        size="small"
                        label="Số bản sao"
                        name="copiesNo"
                        type="number"
                        slotProps={{ inputLabel: { shrink: true } }}
                    />
                    <Field.Text
                        size="small"
                        label="Số bản lưu lại"
                        name="keptNo"
                        type="number"
                        slotProps={{ inputLabel: { shrink: true } }}
                    />
                </Stack>
                <Stack direction={{ xs: "column", md: "row" }} sx={{ mt: 2 }} spacing={2}>
                    <Field.DatePicker name="deliveryTime" label="Ngày giao hàng" />
                    <Field.Text name="deliveryAddress" label="Địa chỉ giao hàng" />
                </Stack>
                <Field.Text
                    name="note"
                    label="Ghi chú"
                    multiline
                    rows={8}
                    fullWidth
                    sx={{ mt: 2 }}
                />
            </Box>
        </Stack>
    );

    return (
        <Dialog
            open={open}
            onClose={
                () => {
                    onClose();
                    reset(defaultValues);
                }
            }
            fullScreen>
            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    py: 2,
                    px: 3,
                }}
            >
                {selectedContract ? `Chỉnh sửa - ${selectedContract.contractNo}` : 'Tạo hợp đồng'}
                <IconButton
                    edge="end"
                    color="inherit"
                    onClick={onClose}
                    sx={{
                        ml: 2,
                    }}
                >
                    <Iconify icon="eva:close-fill" />
                </IconButton>
            </DialogTitle>
            <Form methods={methods} onSubmit={onSubmit}>
                <DialogContent
                    sx={{
                        pb: 10,
                        pt: 3,
                        maxHeight: "calc(100vh - 120px)",
                        overflowY: "auto",
                    }}
                >
                    {renderDetails()}
                </DialogContent>
                {renderActions()}
            </Form>
            <ContractCustomerForm
                openChild={isCreatingCustomer}
                setOpenChild={setIsCreatingCustomer}
                methodsContract={methods}
                setCustomerKeyword={setCustomerKeyword}
                setSelectedCustomer={setSelectedCustomer}
            />
        </Dialog>
    );
}