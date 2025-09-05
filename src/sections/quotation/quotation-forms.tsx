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
} from "@mui/material";
import { Iconify } from "src/components/iconify";

// ======================
// Schema & Types
// ======================
const quotationItemSchema = z.object({
    name: z.string().min(1, "Nhập tên sản phẩm/dịch vụ"),
    qty: z.number().min(1, "Số lượng > 0"),
    price: z.number().min(0, "Đơn giá >= 0"),
});

const quotationSchema = z.object({
    customer: z.string().min(1, "Vui lòng nhập khách hàng"),
    contact: z.string().optional(),
    date: z.string().min(1, "Chọn ngày báo giá"),
    validUntil: z.string().min(1, "Chọn ngày hiệu lực"),
    items: z.array(quotationItemSchema).min(1, "Thêm ít nhất 1 sản phẩm"),
    paymentTerms: z.string().optional(),
    deliveryTime: z.string().optional(),
    notes: z.string().optional(),
});

type QuotationFormValues = z.infer<typeof quotationSchema>;

export type QuotationFormProps = {
    openForm: boolean;
    onClose: () => void;
    onSubmit: (data: QuotationFormValues) => void;
};

// ======================
// Component
// ======================
export function QuotationForm({ openForm, onClose, onSubmit }: QuotationFormProps) {
    const methods = useForm<QuotationFormValues>({
        resolver: zodResolver(quotationSchema),
        defaultValues: {
            customer: "",
            contact: "",
            date: "",
            validUntil: "",
            items: [{ name: "", qty: 1, price: 0 }],
            paymentTerms: "",
            deliveryTime: "",
            notes: "",
        },
    });

    const { control, handleSubmit, watch } = methods;

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
    });

    const items = watch("items");
    const total = items.reduce((acc, i) => acc + (i.qty || 0) * (i.price || 0), 0);

    const handleFormSubmit = (data: QuotationFormValues) => {
        onSubmit(data);
        onClose();
    };

    return (
        <Dialog open={openForm} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Tạo báo giá</DialogTitle>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <DialogContent
                    sx={{
                        maxHeight: "75vh",
                        overflowY: "auto",
                    }}
                >
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        {/* Section Thông tin chung */}
                        <Typography variant="subtitle2">Thông tin chung</Typography>
                        <Stack spacing={2}>
                            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                                <Controller
                                    name="customer"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="Khách hàng"
                                            error={!!fieldState.error}
                                            helperText={fieldState.error?.message}
                                        />
                                    )}
                                />
                                <Controller
                                    name="contact"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField {...field} fullWidth label="Người liên hệ" />
                                    )}
                                />
                            </Stack>

                            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                                <Controller
                                    name="date"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            type="date"
                                            label="Ngày báo giá"
                                            InputLabelProps={{ shrink: true }}
                                            error={!!fieldState.error}
                                            helperText={fieldState.error?.message}
                                        />
                                    )}
                                />
                                <Controller
                                    name="validUntil"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            type="date"
                                            label="Hiệu lực đến"
                                            InputLabelProps={{ shrink: true }}
                                            error={!!fieldState.error}
                                            helperText={fieldState.error?.message}
                                        />
                                    )}
                                />
                            </Stack>
                        </Stack>

                        {/* Section Sản phẩm */}
                        <Typography variant="subtitle2">Sản phẩm / Dịch vụ</Typography>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tên SP/DV</TableCell>
                                    <TableCell width="120">Số lượng</TableCell>
                                    <TableCell width="150">Đơn giá</TableCell>
                                    <TableCell width="150">Thành tiền</TableCell>
                                    <TableCell width="50"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {fields.map((field, index) => (
                                    <TableRow key={field.id}>
                                        <TableCell>
                                            <Controller
                                                name={`items.${index}.name`}
                                                control={control}
                                                render={({ field, fieldState }) => (
                                                    <TextField
                                                        {...field}
                                                        size="small"
                                                        placeholder="Tên sản phẩm"
                                                        fullWidth
                                                        error={!!fieldState.error}
                                                        helperText={fieldState.error?.message}
                                                    />
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Controller
                                                name={`items.${index}.qty`}
                                                control={control}
                                                render={({ field, fieldState }) => (
                                                    <TextField
                                                        {...field}
                                                        size="small"
                                                        type="number"
                                                        error={!!fieldState.error}
                                                        helperText={fieldState.error?.message}
                                                    />
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Controller
                                                name={`items.${index}.price`}
                                                control={control}
                                                render={({ field, fieldState }) => (
                                                    <TextField
                                                        {...field}
                                                        size="small"
                                                        type="number"
                                                        error={!!fieldState.error}
                                                        helperText={fieldState.error?.message}
                                                    />
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography>
                                                {(items[index]?.qty || 0) * (items[index]?.price || 0)} ₫
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => remove(index)}>
                                                <Iconify icon="material-symbols:scan-delete-outline-sharp" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell colSpan={5}>
                                        <Button
                                            startIcon={<Iconify icon="gridicons:add" />}
                                            onClick={() => append({ name: "", qty: 1, price: 0 })}
                                        >
                                            Thêm sản phẩm
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={3}>
                                        <b>Tổng cộng</b>
                                    </TableCell>
                                    <TableCell colSpan={2}>
                                        <Typography>{total.toLocaleString("vi-VN")} ₫</Typography>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                        {/* Section điều khoản */}
                        <Typography variant="subtitle2">Điều khoản</Typography>
                        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                            <Controller
                                name="paymentTerms"
                                control={control}
                                render={({ field }) => (
                                    <TextField {...field} fullWidth label="Điều kiện thanh toán" />
                                )}
                            />
                            <Controller
                                name="deliveryTime"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        type="time"
                                        label="Thời gian giao hàng"
                                        InputLabelProps={{ shrink: true }}
                                    />
                                )}
                            />
                        </Stack>
                        <Controller
                            name="notes"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} fullWidth label="Ghi chú" multiline rows={3} />
                            )}
                        />
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose}>Hủy</Button>
                    <Button type="submit" variant="contained">
                        Lưu báo giá
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
