import { useForm, Controller, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Stack,
    Typography,
    TextField,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    Box,
    MenuItem,
    Divider,
    Tooltip,
} from "@mui/material";
import { Iconify } from "src/components/iconify";
import { Field, Form } from "src/components/hook-form";
import { useGetCustomers } from "src/actions/customer";
import { useDebounce } from "minimal-shared/hooks";
import { useEffect, useState } from "react";
import { ICustomerItem } from "src/types/customer";
import { useGetProducts } from "src/actions/product";
import { ProductItem } from "src/types/product";
import parse from 'html-react-parser';
import { fCurrency } from "src/utils/format-number";
import { QuotationFormValues, quotationSchema } from "src/types/quotation";
import { QuotationItemsTable } from "./quotation-product-table";

// ======================
// Schema & Types
// ======================

export type QuotationFormProps = {
    openForm: boolean;
    onClose: () => void;
    onSubmit: (data: QuotationFormValues) => void;
};

// ======================
// Component
// ======================
export function QuotationForm({ openForm, onClose, onSubmit }: QuotationFormProps) {
    const [customerkeyword, setCustomerKeyword] = useState('');
    const debouncedCustomerKw = useDebounce(customerkeyword, 300);

    const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);

    const { customers, customersLoading } = useGetCustomers({
        pageNumber: 1,
        pageSize: 999,
        key: debouncedCustomerKw,
        enabled: true
    });

    const [selectedCustomer, setSelectedCustomer] = useState<ICustomerItem | null>(null);

    const methods = useForm<QuotationFormValues>({
        resolver: zodResolver(quotationSchema),
        defaultValues: {
            customer: "",
            date: "",
            validUntil: "",
            status: 1,
            items: [{ name: "", description: "", qty: 1, price: 0, vat: 0 }],
            notes: "",
            paymentTerms: "",
            deliveryTime: "",
        },
    });

    const { control, handleSubmit, watch } = methods;

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
    });

    const handleFormSubmit = (data: QuotationFormValues) => {
        onSubmit(data);
        onClose();
    };

    const renderLeftColumn = () => (
        <Stack flex={1} spacing={3}>
            {/* Section Thông tin chung */}
            <Box>
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="subtitle2">Thông tin khách hàng</Typography>
                    <Stack direction="row" justifyContent="space-between" gap={1}>
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
                            }}
                            noOptionsText="Không có dữ liệu"
                            sx={{ flex: 1, minWidth: 200 }}
                        />
                        <Button
                            variant={isCreatingCustomer ? "contained" : "outlined"}
                            startIcon={<Iconify icon={isCreatingCustomer ? "mdi:account-cancel" : "line-md:person-add"} />}
                            onClick={() => {
                                setIsCreatingCustomer((prev) => !prev);
                                if (!isCreatingCustomer) {
                                    setSelectedCustomer(null);
                                }
                            }}
                        >
                            {isCreatingCustomer ? "Hoàn tác" : "Tạo mới"}
                        </Button>
                    </Stack>
                </Stack>
                <Stack spacing={2} sx={{ mt: 2 }}>
                    <Stack direction="row" gap={2}>
                        {isCreatingCustomer ? (
                            <>
                                <Field.Text name="customerName" label="Tên khách hàng" />
                                <Field.Text name="companyName" label="Tên công ty" />
                            </>
                        ) : (
                            <>
                                <DetailItem label="Tên khách hàng" value={selectedCustomer?.name ?? ""} />
                                <DetailItem label="Tên công ty" value={selectedCustomer?.companyName ?? ""} />
                            </>
                        )}
                    </Stack>
                    <Stack direction="row" gap={2}>
                        {isCreatingCustomer ? (
                            <>
                                <Field.Text name="email" label="Email khách hàng" />
                                <Field.Text name="phone" label="Số điện thoại" />
                            </>
                        ) : (
                            <>
                                <DetailItem label="Email khách hàng" value={selectedCustomer?.email ?? ""} />
                                <DetailItem label="Số điện thoại" value={selectedCustomer?.phone ?? ""} />
                            </>
                        )}
                    </Stack>
                </Stack>
            </Box>

            {/* Section Phiếu */}
            <Box>
                <Typography variant="subtitle2" sx={{ mt: 2 }}>
                    Phiếu
                </Typography>
                <Stack direction={{ xs: "column", md: "row" }} sx={{ mt: 2 }} spacing={2}>
                    <Field.Select label="Trạng thái" name="status">
                        <MenuItem key={'0'} value={0}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: 1 }}>
                                <span>Bỏ qua</span>
                                <Iconify icon="fluent-color:dismiss-circle-16" />
                            </Box>
                        </MenuItem>
                        <MenuItem key={'1'} value={1}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: 1 }}>
                                <span>Chờ khách chốt</span>
                                <Iconify icon="fluent-color:clock-16" />
                            </Box>
                        </MenuItem>
                        <MenuItem key={'2'} value={2}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: 1 }}>
                                <span>Hết hiệu lực</span>
                                <Iconify icon="fluent-color:error-circle-16" />
                            </Box>
                        </MenuItem>
                        <MenuItem key={'3'} value={3}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: 1 }}>
                                <span>Đang thực hiện</span>
                                <Iconify icon="fluent-color:arrow-sync-16" />
                            </Box>
                        </MenuItem>
                        <MenuItem key={'4'} value={4}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: 1 }}>
                                <span>Đã hoàn thành</span>
                                <Iconify icon="fluent-color:checkmark-circle-16" />
                            </Box>
                        </MenuItem>
                    </Field.Select>
                    <Field.DatePicker name="date" label="Ngày báo giá" />
                    <Field.DatePicker name="validUntil" label="Hiệu lực đến" />
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
            {/* Cột trái */}
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
            {/* Cột phải */}
            <QuotationItemsTable
                methods={methods}
                fields={fields}
                append={append}
                remove={remove}
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
            >
                Lưu báo giá
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
                Tạo báo giá
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
            <Form methods={methods} onSubmit={handleSubmit(handleFormSubmit)}>
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
        </Dialog>
    );
}

function DetailItem({ label, value }: { label: string; value?: string | number }) {
    return (
        <Box sx={{ flex: 1 }}>
            {
                label
                &&
                <Typography variant="subtitle2" color="text.secondary">
                    {label}
                </Typography>
            }
            <Typography variant="body2">{value || "—"}</Typography>
        </Box>
    );
}