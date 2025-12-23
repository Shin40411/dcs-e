import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, MenuItem, Skeleton, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { Field, Form } from "src/components/hook-form";
import { Iconify } from "src/components/iconify";
import { IContractDao, IContractDetailDto, IContractDetails, IContractDto, IContractItem, IContractProduct, IProductFormEdit } from "src/types/contract";
import { ContractFormValues, contractSchema } from "./schema/contract-schema";
import { DetailItem } from "../quotation/helper/DetailItem";
import { useGetCustomers } from "src/actions/customer";
import { useDebounce } from "minimal-shared/hooks";
import { useEffect, useRef, useState } from "react";
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
import { renderSkeleton } from "src/components/skeleton/skeleton-quotation-contract";
import { createSupplierContract } from "src/actions/contractSupplier";
import { IContractSupplyDto, IContractSupplyProductDto } from "src/types/contractSupplier";
import { useGetSuppliers } from "src/actions/suppliers";
import { ISuppliersItem } from "src/types/suppliers";
import { useNavigate } from "react-router";
import { paths } from "src/routes/paths";
import { fetchProductById } from "src/actions/product";
import { ProductItem } from "src/types/product";

type ContractFormProps = {
    open: boolean;
    onClose: () => void;
    selectedContract: IContractItem | null;
    detailsFromQuotation: any[];
    customerIdFromQuotation?: number | null;
    creatingSupplierContract: boolean;
    CopiedContract: IContractItem | null;
};

export function ContractForm({
    open,
    onClose,
    selectedContract,
    detailsFromQuotation,
    customerIdFromQuotation,
    creatingSupplierContract,
    CopiedContract
}: ContractFormProps) {
    const contractId = selectedContract?.id ?? CopiedContract?.id ?? 0;
    const navigate = useNavigate();
    const today = new Date();
    const [customerkeyword, setCustomerKeyword] = useState('');
    const debouncedCustomerKw = useDebounce(customerkeyword, 300);
    const [totalPaid, setTotalPaid] = useState(0);
    const [originalItems, setOriginalItems] = useState<IContractDetailDto[]>([]);

    const { contract: CurrentContract, contractLoading } = useGetContract({
        contractId: contractId,
        pageNumber: 1,
        pageSize: 999,
        options: { enabled: !!selectedContract?.id }
    });

    const { suppliers, suppliersLoading, pagination: SupplierRecords } = useGetSuppliers({
        pageNumber: 1,
        pageSize: 999,
        key: debouncedCustomerKw,
        enabled: creatingSupplierContract
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

    const [selectedSupplier, setSelectedSupplier] = useState<ISuppliersItem | null>(null);

    const defaultValues: ContractFormValues = {
        contractNo: generateContractNo(creatingSupplierContract ? 'NCC' : 'KH'),
        customerId: 0,
        supplierId: 0,
        createDate: today.toISOString(),
        signatureDate: today.toISOString(),
        deliveryAddress: "",
        deliveryTime: today.toISOString(),
        downPayment: 0,
        nextPayment: 0,
        lastPayment: 0,
        copiesNo: 2,
        keptNo: 1,
        status: 1,
        note: "",
        discount: 0,
        products: [{
            id: 0,
            product: "",
            unit: "",
            unitName: "",
            qty: 1,
            price: 0,
            vat: 0,
        }],
    };

    const methods = useForm<ContractFormValues>({
        mode: 'onSubmit',
        resolver: zodResolver(contractSchema),
        defaultValues,
    });

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

    const currentLoadRef = useRef<Promise<IContractProduct[]> | null>(null);

    const customerId = methods.watch('customerId');

    const supplierId = methods.watch('supplierId');

    const { fields, append, remove } = useFieldArray({
        control,
        name: "products",
    });

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

    const total = Math.round((products || []).reduce((acc, i) => acc + calcAmount(i), 0));

    useEffect(() => {
        if (CopiedContract) {
            if (!CurrentContract) return;
            const currentDetails = CurrentContract.items.find(
                (c) => c.contractID === CopiedContract.id
            );

            setContractProductDetail(currentDetails);

            const mappedItems = mapProductsToItems(currentDetails?.products || []);

            methods.reset({
                customerId: CopiedContract.customerID,
                contractNo: generateContractNo('KH'),
                createDate: CopiedContract.createDate,
                signatureDate: CopiedContract.signatureDate,
                deliveryAddress: CopiedContract.deliveryAddress,
                deliveryTime: CopiedContract.deliveryTime,
                downPayment: CopiedContract.downPayment,
                nextPayment: CopiedContract.nextPayment,
                lastPayment: CopiedContract.lastPayment,
                copiesNo: CopiedContract.copiesNo,
                keptNo: CopiedContract.keptNo,
                status: CopiedContract.status,
                note: CopiedContract.note,
                discount: CopiedContract.discount,
                products: mappedItems
            });
        }

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

        if (creatingSupplierContract) {
            methods.setValue("supplierId", defaultValues.supplierId);
            methods.setValue("customerId", defaultValues.customerId);
            methods.setValue("contractNo", defaultValues.contractNo);
            methods.setValue("deliveryAddress", defaultValues.deliveryAddress);
            methods.setValue("copiesNo", defaultValues.copiesNo);
            methods.setValue("keptNo", defaultValues.keptNo);
            methods.setValue("status", defaultValues.status);
            methods.setValue("note", defaultValues.note);
            methods.setValue("discount", defaultValues.discount);
            methods.setValue("downPayment", defaultValues.downPayment);
            methods.setValue("nextPayment", defaultValues.nextPayment);
            methods.setValue("lastPayment", defaultValues.lastPayment);

            const loadPromise = loadProductDetails(currentDetails?.products || []);
            currentLoadRef.current = loadPromise;

            loadPromise.then((dataToMap) => {
                if (currentLoadRef.current !== loadPromise || !creatingSupplierContract) return;

                const mItems = mapProductsToItems(dataToMap);
                methods.setValue("products", mItems);
            });

        } else {
            currentLoadRef.current = null;

            const dataToMap = currentDetails?.products || [];
            const mItems = mapProductsToItems(dataToMap);
            methods.setValue("supplierId", defaultValues.supplierId);
            methods.setValue("customerId", selectedContract.customerID ?? 0);
            methods.setValue("contractNo", selectedContract.contractNo);
            methods.setValue("products", mItems);
            methods.setValue("signatureDate", selectedContract.signatureDate ?? null);
            methods.setValue("createDate", selectedContract.createDate ?? null);
            methods.setValue("deliveryAddress", selectedContract.deliveryAddress ?? '');
            methods.setValue("deliveryTime", selectedContract.deliveryTime ?? null);
            methods.setValue("copiesNo", selectedContract.copiesNo);
            methods.setValue("keptNo", selectedContract.keptNo);
            methods.setValue("status", selectedContract.status ?? 1);
            methods.setValue("note", selectedContract.note ?? "");
            methods.setValue("discount", selectedContract.discount);
            methods.setValue("downPayment", selectedContract.downPayment);
            methods.setValue("nextPayment", selectedContract.nextPayment);
            methods.setValue("lastPayment", selectedContract.lastPayment);
        }

        const mappedProducts = mapProductsToItems(currentDetails?.products || []);
        setOriginalItems(
            mappedProducts.map((item) => ({
                productID: item.product ?? "",
                quantity: item.qty ?? 0,
                unit: item.unitName || "",
                price: item.price || 0,
            }))
        );
    }, [
        detailsFromQuotation,
        CopiedContract,
        selectedContract,
        CurrentContract,
        creatingSupplierContract,
        methods.reset
    ]);

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

    useEffect(() => {
        if (!supplierId) {
            setSelectedSupplier(null);
            return;
        }

        const found = suppliers.find((cus) => Number(cus.id) === Number(supplierId));
        if (found) {
            setSelectedSupplier(found);
        }
    }, [supplierId]);

    useEffect(() => {
        if (total > 0) {
            const down = Number(downPayment) || 0;
            const next = Number(nextPayment) || 0;

            if (!down && !next) {
                const downDefault = Math.floor(total / 2);
                const nextDefault = total - downDefault; // Đảm bảo tổng chính xác
                const lastDefault = Math.max(total - downDefault - nextDefault, 0);

                setValue("downPayment", downDefault, { shouldValidate: true });
                setValue("nextPayment", nextDefault, { shouldValidate: true });
                setValue("lastPayment", lastDefault, { shouldValidate: true });
                clearErrors(["downPayment", "nextPayment"]);
                return;
            }

            const currentTotal = down + next;
            const isEvenSplit = Math.abs(down - next) <= 1 && currentTotal > 0;

            if (isEvenSplit && currentTotal !== total) {
                const downDefault = Math.floor(total / 2);
                const nextDefault = total - downDefault;

                const isStillEven = Math.abs(downDefault - nextDefault) <= 1;

                if (isStillEven) {
                    const lastDefault = Math.max(total - downDefault - nextDefault, 0);

                    setValue("downPayment", downDefault, { shouldValidate: true });
                    setValue("nextPayment", nextDefault, { shouldValidate: true });
                    setValue("lastPayment", lastDefault, { shouldValidate: true });
                } else {
                    // Chia không đều -> dùng tỷ lệ 30/40/30
                    const downDefault30 = Math.round(total * 0.3);
                    const nextDefault40 = Math.round(total * 0.4);
                    const lastDefault30 = Math.max(total - downDefault30 - nextDefault40, 0);

                    setValue("downPayment", downDefault30, { shouldValidate: true });
                    setValue("nextPayment", nextDefault40, { shouldValidate: true });
                    setValue("lastPayment", lastDefault30, { shouldValidate: true });
                }

                clearErrors(["downPayment", "nextPayment"]);
                return;
            }

            if (down + next > total) {
                setError("downPayment", {
                    type: "manual",
                    message: "Tổng tiền trả trước và trả sau không được vượt quá tổng tiền hợp đồng",
                });
                setError("nextPayment", {
                    type: "manual",
                    message: "Tổng tiền trả trước và trả sau không được vượt quá tổng tiền hợp đồng",
                });
                setValue("lastPayment", 0, { shouldValidate: true });
            } else {
                clearErrors(["downPayment", "nextPayment"]);

                const lastDefault = Math.max(total - down - next, 0);
                setValue("lastPayment", lastDefault, { shouldValidate: true });
            }
        }
    }, [total, downPayment, nextPayment, setError, clearErrors, setValue]);

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

            const supplierCreatePayload: IContractSupplyDto = {
                ContractNo: bodyPayload.ContractNo,
                copiesNo: bodyPayload.copiesNo,
                customerContractNo: selectedContract?.contractNo || "",
                deliveryAddress: bodyPayload.deliveryAddress,
                deliveryTime: bodyPayload.deliveryTime,
                discount: bodyPayload.discount,
                keptNo: bodyPayload.keptNo,
                note: bodyPayload.note,
                parentContractId: selectedContract?.id || 0,
                products: bodyPayload.products.map((item): IContractSupplyProductDto => ({
                    productID: typeof item.productID === 'string' ? parseInt(item.productID, 10) : item.productID,
                    quantity: item.quantity,
                    imported: item.quantity,
                    price: item.price,
                    unit: item.unit
                })),
                signatureDate: bodyPayload.signatureDate,
                status: bodyPayload.status,
                supplierId: data.supplierId
            }

            if (creatingSupplierContract) {
                await createSupplierContract(supplierCreatePayload);
            } else {
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
            }

            toast.success(
                creatingSupplierContract ? "Lập hợp đồng nhà cung cấp thành công!"
                    :
                    selectedContract
                        ? "Dữ liệu hợp đồng đã được thay đổi!"
                        : "Tạo hợp đồng thành công!"
            );

            if (creatingSupplierContract) {
                navigate(paths.dashboard.supplierServices.contractSupplier);
            }

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
        <Box display="flex" flexDirection="row" gap={2}>
            <Button
                variant="outlined"
                color="inherit"
                size="medium"
                sx={{ flex: 1 }}
                onClick={() => {
                    onClose();
                    reset(defaultValues);
                }}
                disabled={isSubmitting}
            >
                Hủy
            </Button>
            <Button
                type="submit"
                variant="contained"
                size="medium"
                sx={{ flex: 1, whiteSpace: 'nowrap', px: 3 }}
                disabled={isCreatingCustomer}
                loading={isSubmitting}
            >
                {creatingSupplierContract ? 'Lập hợp đồng' : selectedContract ? `Lưu hợp đồng` : 'Tạo hợp đồng'}
            </Button>
        </Box>
    );

    const renderDetails = () => (
        <Stack direction={{ xs: "column", sm: "column", md: "column", lg: "row", xl: "row" }} height="100%" spacing={3} sx={{ mt: 1 }}>
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
            {/* Section Bảng sản phẩm */}
            <ContractItemsTable
                idContract={selectedContract?.id}
                contractProductDetail={contractProductDetail}
                methods={methods}
                fields={fields}
                append={append}
                remove={remove}
                setPaid={setTotalPaid}
                isCreateSupplierContract={creatingSupplierContract}
            />
        </Stack>
    );

    const renderLeftColumn = () => (
        <Stack width={{ xs: "100%", sm: "100%", md: "100%", lg: "30%" }} spacing={3}>
            {/* Section Thông tin khách hàng & nhà cung cấp */}
            <Box>
                <Stack direction={{ xs: "column", md: "column", lg: "column", xl: "row" }} gap={2} justifyContent="space-between">
                    <Typography variant="subtitle2">Thông tin {creatingSupplierContract ? 'nhà cung cấp' : 'khách hàng'}</Typography>
                    <Stack direction="row" justifyContent="space-between" gap={1} alignItems="center">
                        {creatingSupplierContract ?
                            <Field.Autocomplete
                                name="supplierId"
                                label={`Chọn nhà cung cấp`}
                                options={suppliers}
                                loading={suppliersLoading}
                                getOptionLabel={(opt) =>
                                    opt?.companyName ?
                                        opt.companyName : ''}
                                isOptionEqualToValue={(opt, val) => opt?.id === val?.id}
                                onInputChange={(_, value) => setCustomerKeyword(value)}
                                value={selectedSupplier}
                                fullWidth
                                onChange={(_, newValue) => {
                                    methods.setValue('supplierId', newValue?.id ?? 0, { shouldValidate: true });
                                    setCustomerKeyword(newValue?.companyName ?? '');
                                }}
                                noOptionsText="Không có dữ liệu"
                                sx={{ flex: 1, minWidth: 200 }}
                                renderOption={(props, option) => (
                                    <li {...props} key={option.id}>
                                        {option.companyName ? option.companyName : ""}
                                    </li>
                                )}
                            />
                            :
                            <Field.Autocomplete
                                name="customerId"
                                label={`Chọn khách hàng có sẵn`}
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
                        }
                        {!creatingSupplierContract &&
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
                        }
                    </Stack>
                </Stack>
                <Stack spacing={2} sx={{ mt: 2 }}>
                    <Stack direction="row" gap={2}>
                        <DetailItem
                            label={`Tên ${creatingSupplierContract ? 'nhà cung cấp' : 'khách hàng'}`}
                            value={
                                creatingSupplierContract ?
                                    selectedSupplier?.name :
                                    selectedCustomer?.name ?
                                        selectedCustomer?.name :
                                        ""}
                        />
                        <DetailItem
                            label="Tên công ty"
                            value={
                                creatingSupplierContract ?
                                    selectedSupplier?.companyName :
                                    selectedCustomer?.companyName ?
                                        selectedCustomer?.companyName :
                                        ""
                            }
                        />
                    </Stack>
                    <Stack direction="row" gap={2}>
                        <DetailItem
                            label={`Email ${creatingSupplierContract ? 'nhà cung cấp' : 'khách hàng'}`}
                            value={
                                creatingSupplierContract ?
                                    selectedSupplier?.email :
                                    selectedCustomer?.email ?
                                        selectedCustomer?.email :
                                        ""
                            }
                        />
                        <DetailItem
                            label="Số điện thoại"
                            value={
                                creatingSupplierContract ?
                                    selectedSupplier?.phone :
                                    selectedCustomer?.phone ?
                                        selectedCustomer?.phone :
                                        ""
                            }
                        />
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
                <Box mt={2}>
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
                            sx={{
                                maxWidth: 150,
                                display: 'none'
                            }}
                            disabled
                        />
                    </Stack>
                </Box>
                <Field.Text
                    name="note"
                    label="Ghi chú"
                    multiline
                    fullWidth
                    minRows={5}
                    sx={{ pb: 2 }}
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
            <Form methods={methods} onSubmit={onSubmit} style={{ height: '100%' }}>
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
                    {creatingSupplierContract ?
                        'Lập hợp đồng nhà cung cấp'
                        : selectedContract
                            ? `Chỉnh sửa - ${selectedContract.contractNo}`
                            : 'Tạo hợp đồng'
                    }
                    {renderActions()}
                </DialogTitle>
                <DialogContent
                    sx={{
                        pb: 0,
                        pt: '10px !important',
                        overflowY: { xs: "auto", sm: "auto", md: "auto", lg: "auto", xl: "hidden" },
                    }}
                >
                    {contractLoading ? renderSkeleton() : renderDetails()}
                </DialogContent>
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

async function loadProductDetails(currentProducts: IContractProduct[]): Promise<IContractProduct[]> {
    if (!currentProducts) return [];

    const result = await Promise.all(
        currentProducts.map(async (p) => {
            const item = await fetchProductById(String(p.productID));
            return {
                ...p,
                price: item.purchasePrice
            };
        })
    );

    return result;
}
