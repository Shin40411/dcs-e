import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Stack,
    Typography,
    IconButton,
    Box,
    MenuItem,
    Divider,
    Tooltip,
    InputAdornment,
    Slider,
} from "@mui/material";
import { Iconify } from "src/components/iconify";
import { Field, Form } from "src/components/hook-form";
import { useGetCustomers } from "src/actions/customer";
import { useDebounce } from "minimal-shared/hooks";
import { useEffect, useState } from "react";
import { ICustomerItem } from "src/types/customer";
import { IQuotationDao, IQuotationDetailDto, IQuotationDto, IQuotationItem, IQuotationProduct, NewCustomer } from "src/types/quotation";
import { QuotationItemsTable } from "./quotation-product-table";
import { QuotationFormValues, quotationSchema } from "./schema/quotation-schema";
import { addMoreProducts, createOrUpdateQuotation, useGetQuotation } from "src/actions/quotation";
import { toast } from "sonner";
import { generateQuotationNo } from "src/utils/random-func";
import { mutate } from "swr";
import { endpoints } from "src/lib/axios";
import { QuotationCustomerForm } from "./quotation-customer-form";
import { useAuthContext } from "src/auth/hooks";
import { IDateValue } from "src/types/common";
import { mapProductsToItems } from "./helper/mapProductsToItems";
import { DetailItem } from "./helper/DetailItem";

export type QuotationFormProps = {
    selectedQuotation: IQuotationItem | null;
    openForm: boolean;
    onClose: () => void;
    page: number;
    rowsPerPage: number;
    fromDate: IDateValue;
    toDate: IDateValue;
};

export function QuotationForm({ openForm, selectedQuotation, onClose, page, rowsPerPage, fromDate, toDate }: QuotationFormProps) {
    const { user } = useAuthContext();
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(today.getMonth() + 1);
    const sampleNote = `- Giá trên đã bao gồm chi phí giao hàng tận nơi nội thành
- Báo cáo có giá trị trong vòng 30 ngày`;
    const sampleDiscount = [10, 20, 30];
    const [originalItems, setOriginalItems] = useState<IQuotationDetailDto[]>([]);

    const [totalPaid, setTotalPaid] = useState(0);

    const [customerkeyword, setCustomerKeyword] = useState('');
    const debouncedCustomerKw = useDebounce(customerkeyword, 300);

    const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);

    const { quotation: CurrentQuotation } = useGetQuotation({
        quotationId: selectedQuotation?.id ?? 0,
        pageNumber: 1,
        pageSize: 999,
        options: { enabled: !!selectedQuotation?.id }
    });

    const { customers, customersLoading, pagination: CustomerRecords } = useGetCustomers({
        pageNumber: 1,
        pageSize: 999,
        key: debouncedCustomerKw,
        enabled: true
    });

    const [selectedCustomer, setSelectedCustomer] = useState<ICustomerItem | null>(null);

    const defaultValues: QuotationFormValues = {
        customer: 0,
        quotationNo: generateQuotationNo(),
        date: today.toISOString(),
        validUntil: nextMonth.toISOString(),
        status: 1,
        discount: 0,
        items: [{
            product: {
                id: "",
                name: ""
            },
            unit: "",
            qty: 1,
            price: 0,
            vat: 0
        }],
        notes: sampleNote,
    };

    const methods = useForm<QuotationFormValues>({
        mode: 'onSubmit',
        resolver: zodResolver(quotationSchema),
        defaultValues,
    });

    useEffect(() => {
        if (!selectedQuotation) {
            methods.reset(defaultValues);
            setOriginalItems(
                defaultValues.items.map((item, i) => ({
                    productID: item.product.id ?? "",
                    quantity: item.qty,
                    row: i + 1,
                }))
            );
            return;
        }

        if (!CurrentQuotation) return;

        const currentDetails = CurrentQuotation.items.find(
            (q) => q.quotationID === selectedQuotation.id
        );

        console.log(currentDetails?.products);
        const mappedItems = mapProductsToItems(currentDetails?.products || []);
        methods.reset({
            ...defaultValues,
            customer: selectedQuotation.customerId ?? 0,
            quotationNo: selectedQuotation.quotationNo,
            date: selectedQuotation.createdDate ?? null,
            validUntil: selectedQuotation.expiryDate ?? null,
            status: selectedQuotation.status ?? 1,
            items: mappedItems,
            notes: selectedQuotation.note ?? "",
            discount: selectedQuotation.discount
        });

        setOriginalItems(
            mappedItems.map((item, i) => ({
                productID: item.product.id ?? "",
                quantity: item.qty,
                row: i + 1,
            }))
        );

    }, [selectedQuotation?.id, CurrentQuotation, methods.reset]);

    useEffect(() => {
        if (customers && CustomerRecords.totalRecord > 0) {
            const c = customers.find((cus) => Number(cus.id) === methods.getValues('customer')) || null;
            setSelectedCustomer(c);
        } else {
            setSelectedCustomer(null);
        }
    }, [customers, methods.watch('customer')]);

    const {
        reset,
        watch,
        setValue,
        handleSubmit,
        control,
        formState: { isSubmitting },
    } = methods;

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
    });

    const onSubmit = handleSubmit(async (data: QuotationFormValues) => {
        try {
            const basePayload = {
                quotationNo: data.quotationNo,
                customerID: data.customer,
                expiryDate: data.validUntil,
                discount: data.discount || 0,
                note: data.notes || '',
                paid: totalPaid,
                Status: data.status
            };

            const bodyPayload: IQuotationDto = {
                ...basePayload,
                quotationDetails: data.items.map((item, i): IQuotationDetailDto => ({
                    productID: item.product.id ?? "",
                    quantity: item.qty,
                    row: i + 1,
                })),
            };

            const updatePayload: IQuotationDao = {
                ...basePayload,
                seller: user?.accessToken || "",
            };

            await createOrUpdateQuotation(
                selectedQuotation?.id ?? null,
                bodyPayload,
                updatePayload
            );

            if (selectedQuotation) {
                const newItems = bodyPayload.quotationDetails.filter(
                    (item) => !originalItems.some((o) => o.productID === item.productID)
                );

                if (newItems.length > 0) {
                    await addMoreProducts(selectedQuotation.id, newItems);
                }
            }

            toast.success(
                selectedQuotation
                    ? "Dữ liệu báo giá đã được thay đổi!"
                    : "Tạo báo giá thành công!"
            );

            mutate(
                endpoints.quotation.list(
                    `?pageNumber=${page + 1}&pageSize=${rowsPerPage}&fromDate=${fromDate}&toDate=${toDate}&Status=1`
                ));

        } catch (error: any) {
            console.error(error);
            if (error.message) {
                toast.error(error.message);
            } else {
                toast.error("Đã có lỗi xảy ra!");
            }
        } finally {
            reset(defaultValues);
            onClose();
        }
    });

    const renderLeftColumn = () => (
        <Stack flex={1} spacing={3}>
            {/* Section Thông tin khách hàng */}
            <Box>
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="subtitle2">Thông tin khách hàng</Typography>
                    <Stack direction="row" justifyContent="space-between" gap={1} alignItems="center">
                        <Field.Autocomplete
                            name="customer"
                            label="Chọn khách hàng có sẵn"
                            options={customers}
                            loading={customersLoading}
                            getOptionLabel={(opt) => opt?.name ?? ''}
                            isOptionEqualToValue={(opt, val) => opt?.id === val?.id}
                            onInputChange={(_, value) => setCustomerKeyword(value)}
                            value={selectedCustomer}
                            fullWidth
                            onChange={(_, newValue) => {
                                setSelectedCustomer(newValue ?? null);
                                setValue('customer', newValue?.id ?? 0, { shouldValidate: true });
                            }}
                            noOptionsText="Không có dữ liệu"
                            sx={{ flex: 1, minWidth: 200 }}
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

            {/* Section Phiếu */}
            <Box>
                <Typography variant="subtitle2">
                    Phiếu
                </Typography>
                <Stack direction={{ xs: "column", md: "row" }} sx={{ mt: 2 }} spacing={2}>
                    <Field.Text
                        label="Mã báo giá"
                        name="quotationNo"
                    />
                    <Field.Select label="Trạng thái" name="status">
                        <MenuItem key={0} value={0}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: 1 }}>
                                <span>Bỏ qua</span>
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
                                <span>Đang thực hiện</span>
                                <Iconify icon="line-md:uploading-loop" />
                            </Box>
                        </MenuItem>
                        <MenuItem key={3} value={3}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: 1 }}>
                                <span>Đã hoàn thành</span>
                                <Iconify icon="fluent-color:checkmark-circle-16" />
                            </Box>
                        </MenuItem>
                    </Field.Select>
                </Stack>
                <Stack direction={{ xs: "column", md: "row" }} sx={{ mt: 2 }} spacing={2}>
                    <Field.DatePicker name="date" label="Ngày báo giá" />
                    <Field.DatePicker name="validUntil" label="Hiệu lực đến" />
                </Stack>
                <Stack direction={{ xs: "column", md: "row" }} sx={{ mt: 2 }} spacing={2}>
                    <Field.Text
                        name="discount"
                        label="Khuyến mãi (%)"
                        placeholder="0.00"
                        type="number"
                        sx={{ width: 150 }}
                        slotProps={{
                            inputLabel: { shrink: true },
                            input: {
                                endAdornment: (
                                    <InputAdornment position="start" sx={{ mr: 0.75 }}>
                                        <Box component="span" sx={{ color: 'text.disabled' }}>
                                            %
                                        </Box>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                    <Controller
                        name="discount"
                        control={control}
                        defaultValue={0}
                        render={({ field }) => (
                            <Slider
                                {...field}
                                step={null}
                                min={0}
                                max={30}
                                marks={sampleDiscount.map((val) => ({
                                    value: val,
                                    label: `${val}%`,
                                }))}
                                value={field.value ?? 0}
                                onChange={(_, val) => field.onChange(val)}
                                valueLabelDisplay="auto"
                                valueLabelFormat={(value) => `${value}%`}
                                sx={{ alignSelf: "center", width: "calc(100% - 24px)" }}
                            />
                        )}
                    />
                </Stack>
                <Field.Text
                    name="notes"
                    label="Ghi chú"
                    multiline
                    rows={8}
                    fullWidth
                    sx={{ mt: 2 }}
                />
            </Box>
        </Stack>
    );

    const renderDetails = () => (
        <Stack direction={{ xs: "column", md: "row" }} spacing={3} sx={{ mt: 1 }}>
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
            <QuotationItemsTable
                idQuotation={selectedQuotation?.id}
                methods={methods}
                fields={fields}
                append={append}
                remove={remove}
                setPaid={setTotalPaid}
            />
        </Stack>
    );

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
                onClick={onClose}
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
                {selectedQuotation ? `Lưu báo giá` : 'Tạo báo giá'}
            </Button>
        </DialogActions>
    );

    return (
        <Dialog open={openForm} onClose={onClose} fullScreen>
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
                {selectedQuotation ? `Chỉnh sửa - ${selectedQuotation.quotationNo}` : 'Tạo báo giá'}
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
            <QuotationCustomerForm
                openChild={isCreatingCustomer}
                setOpenChild={setIsCreatingCustomer}
                quotationMethods={methods}
            />
        </Dialog>
    );
}