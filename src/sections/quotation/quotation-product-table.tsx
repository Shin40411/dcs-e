import { UseFieldArrayRemove, UseFormReturn, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import { Box, Button, IconButton, MenuItem, Stack, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import { Field } from "src/components/hook-form";
import parse from 'html-react-parser';
import { fCurrency } from "src/utils/format-number";
import { Iconify } from "src/components/iconify";
import { QuotationFormValues } from "src/types/quotation";
import { useGetProducts } from "src/actions/product";

type QuotationItemsTableProps = {
    methods: UseFormReturn<QuotationFormValues>;
    fields: any[];
    remove: UseFieldArrayRemove;
    append: (value: any) => void;
};

export function QuotationItemsTable({
    methods,
    fields,
    remove,
    append,
}: QuotationItemsTableProps) {
    const [isEditingMap, setIsEditingMap] = useState<Record<number, boolean>>({});

    const toggleEdit = (index: number) => {
        setIsEditingMap((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const items = useWatch({
        control: methods.control,
        name: "items",
    }) as QuotationFormValues["items"];

    const total = (items || []).reduce(
        (acc, i) => acc + (i?.qty || 0) * (i?.price || 0),
        0
    );

    return (
        <Stack flex={1.5} spacing={2} sx={{ height: "100%" }}>
            <Typography variant="subtitle2">Sản phẩm</Typography>

            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
                <Box sx={{ flex: 1, overflowY: "auto" }}>
                    <Table size="small" stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>Tên SP</TableCell>
                                <TableCell width="150">Số lượng</TableCell>
                                <TableCell>Mô tả</TableCell>
                                <TableCell width="150">Đơn giá</TableCell>
                                <TableCell width="100">VAT</TableCell>
                                <TableCell width="150">Thành tiền</TableCell>
                                <TableCell width="80"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {fields.map((field, index) => (
                                <TableRow key={field.id}>
                                    <TableCell>
                                        <ProductAutocomplete index={index} methods={methods} />
                                    </TableCell>

                                    <TableCell>
                                        {isEditingMap[index] ? (
                                            <Field.NumberInput name={`items.${index}.qty`} />
                                        ) : (
                                            <Typography variant="body2">
                                                {String(items?.[index]?.qty ?? "")}
                                            </Typography>
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        {isEditingMap[index] ? (
                                            <Field.Text
                                                name={`items.${index}.description`}
                                                label="Mô tả"
                                                multiline
                                            />
                                        ) : (
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    display: "-webkit-box",
                                                    WebkitBoxOrient: "vertical",
                                                    WebkitLineClamp: 3,
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "normal",
                                                }}
                                            >
                                                {parse(items?.[index]?.description || "—")}
                                            </Typography>
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        {isEditingMap[index] ? (
                                            <Field.VNCurrencyInput name={`items.${index}.price`} />
                                        ) : (
                                            <Typography variant="body2">
                                                {fCurrency(items?.[index]?.price) ?? ""}
                                            </Typography>
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        {isEditingMap[index] ? (
                                            <Field.Select name={`items.${index}.vat`}>
                                                <MenuItem value={0}>0%</MenuItem>
                                                <MenuItem value={5}>5%</MenuItem>
                                                <MenuItem value={8}>8%</MenuItem>
                                                <MenuItem value={10}>10%</MenuItem>
                                            </Field.Select>
                                        ) : (
                                            <Typography variant="body2">
                                                {items?.[index]?.vat != null
                                                    ? `${items[index].vat}%`
                                                    : ""}
                                            </Typography>
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        <Typography fontWeight="bold">
                                            {fCurrency(
                                                (Number(items?.[index]?.qty) || 0) *
                                                (Number(items?.[index]?.price) || 0)
                                            )}
                                        </Typography>
                                    </TableCell>

                                    <TableCell>
                                        <Stack direction="row">
                                            <Tooltip
                                                title={isEditingMap[index] ? "Lưu lại" : "Chỉnh sửa"}
                                                placement="top"
                                                arrow
                                            >
                                                <IconButton onClick={() => toggleEdit(index)}>
                                                    <Iconify
                                                        icon={
                                                            isEditingMap[index]
                                                                ? "material-symbols-light:save"
                                                                : "clarity:edit-line"
                                                        }
                                                    />
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip title="Xóa sản phẩm" placement="top" arrow>
                                                <IconButton onClick={() => remove(index)}>
                                                    <Iconify icon="material-symbols:scan-delete-outline-sharp" />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}

                            <TableRow>
                                <TableCell colSpan={7}>
                                    <Stack
                                        direction="row"
                                        gap={2}
                                        my={1}
                                        justifyContent="space-between"
                                    >
                                        <Button
                                            variant="outlined"
                                            startIcon={<Iconify icon="gridicons:add" />}
                                            onClick={() =>
                                                append({
                                                    name: "",
                                                    description: "",
                                                    qty: 1,
                                                    price: 0,
                                                    vat: 0,
                                                })
                                            }
                                        >
                                            Thêm sản phẩm
                                        </Button>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Box>

                <Box
                    sx={{
                        position: "sticky",
                        bottom: -50,
                        borderTop: "1px solid",
                        borderColor: "divider",
                        p: 2,
                        bgcolor: "background.paper",
                        zIndex: 1,
                    }}
                >
                    <Stack direction="row" justifyContent="space-between">
                        <Typography fontWeight="bold">Tổng cộng</Typography>
                        <Typography fontWeight="bold">{fCurrency(total)}</Typography>
                    </Stack>
                </Box>
            </Box>
        </Stack>
    );
}

function ProductAutocomplete({
    index,
    methods,
}: {
    index: number;
    methods: UseFormReturn<any>;
}) {
    const [keyword, setKeyword] = useState("");
    const [debouncedKeyword, setDebouncedKeyword] = useState("");

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedKeyword(keyword), 500);
        return () => clearTimeout(handler);
    }, [keyword]);

    const { products = [], productsLoading } = useGetProducts({
        pageNumber: 1,
        pageSize: 999,
        key: debouncedKeyword,
    });

    return (
        <Field.Autocomplete
            name={`items.${index}.product`}
            label="Chọn sản phẩm"
            options={products}
            loading={productsLoading}
            getOptionLabel={(opt) => opt?.name ?? ""}
            isOptionEqualToValue={(opt, val) => opt?.id === val?.id}
            onInputChange={(_, value) => setKeyword(value)}
            onChange={(_, newValue) => {
                methods.setValue(`items.${index}.name`, newValue?.name ?? "");
                methods.setValue(
                    `items.${index}.description`,
                    newValue?.description ?? ""
                );
                methods.setValue(`items.${index}.price`, newValue?.purchasePrice ?? 0);
                methods.setValue(`items.${index}.vat`, newValue?.vat ?? 0);
            }}
            noOptionsText="Không có dữ liệu"
            fullWidth
        />
    );
}