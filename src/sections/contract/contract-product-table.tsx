import { UseFieldArrayRemove, UseFormReturn, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Stack, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import { Field } from "src/components/hook-form";
import { fCurrency, fRenderTextNumber } from "src/utils/format-number";
import { Iconify } from "src/components/iconify";
import { useGetProducts } from "src/actions/product";
import { useGetUnits } from "src/actions/unit";
import { capitalizeFirstLetter } from "src/utils/format-string";
import { toast } from "sonner";
import { useBoolean } from "minimal-shared/hooks";
import { mutate } from "swr";
import { endpoints } from "src/lib/axios";
import { IDateValue } from "src/types/common";
import { ContractFormValues } from "./schema/contract-schema";
import { deleteProductSelected } from "src/actions/contract";
import { IContractDetails } from "src/types/contract";

type ContractItemsTableProps = {
    idContract: number | undefined;
    contractProductDetail: IContractDetails | undefined;
    methods: UseFormReturn<ContractFormValues>;
    fields: any[];
    remove: UseFieldArrayRemove;
    append: (value: any) => void;
    setPaid: (value: any) => void;
};

export function ContractItemsTable({
    idContract,
    contractProductDetail,
    methods,
    fields,
    remove,
    append,
    setPaid
}: ContractItemsTableProps) {
    const items = useWatch({
        control: methods.control,
        name: "products",
    }) as ContractFormValues["products"];

    const discount = useWatch({
        control: methods.control,
        name: "discount",
    }) as number | undefined;

    const calcAmount = (item: { qty?: number; price?: number; vat?: number }) => {
        const qty = Number(item?.qty) || 0;
        const price = Number(item?.price) || 0;
        const vat = Number(item?.vat) || 0;
        return qty * price * (1 + vat / 100);
    };

    const total = (items || []).reduce((acc, i) => acc + calcAmount(i), 0);

    const discountRate = discount ? discount / 100 : 0;

    const subtotal = total * (1 - discountRate);

    const roundedTotal = Math.round(subtotal);

    const openDel = useBoolean();

    const [indexField, setIndexField] = useState(0);

    const [productIDSelected, setProductIDSelected] = useState('');

    const deleteEachProduct = async () => {
        try {
            console.log(indexField);
            if (!idContract) return;
            if (indexField === 0) {
                toast.warning("Phiếu hợp đồng đã tạo phải có ít nhất 1 sản phẩm");
                toast.warning("Không thể xóa sản phẩm này");
                openDel.onFalse();
                return;
            }

            await deleteProductSelected({
                productID: productIDSelected,
                contractId: String(idContract)
            });
            remove(indexField);
            toast.success("Đã xóa sản phẩm ra khỏi danh sách");
            openDel.onFalse();

            mutate(
                (k) => typeof k === "string" && k.startsWith("/api/v1/contracts/contracts"),
                undefined,
                { revalidate: true }
            );

            mutate(endpoints.contract.detail(`?pageNumber=1&pageSize=999&ContractId=${idContract}`));
        } catch (error: any) {
            console.error(error);
            if (error.message) {
                toast.error(error.message);
            } else {
                toast.error("Đã có lỗi xảy ra!");
            }
        }
    };

    const confirmDeleteUpdateProduct = () => (
        <Dialog open={openDel.value} onClose={openDel.onFalse} maxWidth="sm" fullWidth>
            <DialogTitle>Xác nhận xóa sản phẩm ra khỏi hợp đồng này?</DialogTitle>
            <DialogContent>
                <Stack direction="row" spacing={1} alignItems={"center"}>
                    <Iconify icon="gridicons:notice" color="#4dd217" />
                    <Stack direction="column">
                        <Typography variant="body2" color="warning">- Sản phẩm sẽ được xóa ra khỏi dữ liệu của phiếu hợp đồng này</Typography>
                        <Typography variant="overline" color="error">- Hành động này không thể hoàn tác</Typography>
                    </Stack>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Stack direction="row" spacing={2} width="100%" minHeight={40}>
                    <Button
                        variant="outlined"
                        color="inherit"
                        onClick={() => openDel.onFalse()}
                        fullWidth
                    >
                        Hủy bỏ
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ ml: 1 }}
                        fullWidth
                        onClick={deleteEachProduct}
                    >
                        Xóa
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    );

    // const fixedTotal = Number(total.toFixed(2));

    useEffect(() => {
        setPaid(roundedTotal);
    }, [roundedTotal]);

    return (
        <>
            <Stack spacing={2} sx={{ height: "100%" }}>
                <Typography variant="subtitle2">Sản phẩm</Typography>

                <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
                    <Box sx={{ flex: 1, overflowY: "auto" }}>
                        <Table size="small" stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell width="50">STT</TableCell>
                                    <TableCell>Tên SP</TableCell>
                                    <TableCell width="150">Số lượng</TableCell>
                                    <TableCell width="150">Đơn giá</TableCell>
                                    <TableCell width="150">Đơn vị tính</TableCell>
                                    <TableCell width="100">VAT</TableCell>
                                    <TableCell width="150">Thành tiền</TableCell>
                                    <TableCell width="80"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {fields.map((field, index) => (
                                    <TableRow key={field.id}>
                                        <TableCell>
                                            {index + 1}
                                        </TableCell>
                                        <TableCell>
                                            <ProductAutocomplete index={index} methods={methods} />
                                        </TableCell>

                                        <TableCell>
                                            <Field.NumberInput name={`products.${index}.qty`} />
                                        </TableCell>

                                        <TableCell>
                                            <Field.VNCurrencyInput name={`products.${index}.price`} label="Đơn giá" />
                                        </TableCell>

                                        <TableCell>
                                            <UnitSelection index={index} methods={methods} />
                                        </TableCell>

                                        <TableCell>
                                            <Typography variant="body2">
                                                {items?.[index]?.vat != null
                                                    ? `${items[index].vat}%`
                                                    : ""}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Typography fontWeight="bold">
                                                {fCurrency(calcAmount(items[index]))}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Stack direction="row">
                                                <Tooltip title="Xóa sản phẩm" placement="top" arrow>
                                                    <IconButton onClick={() => {
                                                        if (idContract) {
                                                            const idPro = methods.getValues(`products.${index}.product`);
                                                            const exists = contractProductDetail?.products?.some(p => String(p.productID) === idPro);
                                                            if (exists) {
                                                                openDel.onTrue();
                                                                setProductIDSelected(idPro);
                                                                setIndexField(index);
                                                            } else {
                                                                remove(index);
                                                            }
                                                        } else {
                                                            remove(index);
                                                        }
                                                    }}>
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
                                                        unit: "",
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
                            <Typography fontWeight="bold">Bằng chữ</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography fontWeight="bold">
                                {fCurrency(roundedTotal)}
                            </Typography>
                            <Typography fontSize={15}>
                                {capitalizeFirstLetter(fRenderTextNumber(roundedTotal))}
                            </Typography>
                        </Stack>
                    </Box>
                </Box>
            </Stack>
            {confirmDeleteUpdateProduct()}
        </>
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
            name={`products.${index}.product`}
            label="Chọn sản phẩm"
            options={products}
            loading={productsLoading}
            getOptionLabel={(opt) => opt?.name ?? ""}
            isOptionEqualToValue={(opt, val) => opt?.id === val?.id}
            onInputChange={(_, value) => setKeyword(value)}
            renderOption={(props, option) => (
                <li {...props} key={option.id}>
                    {option.name}
                </li>
            )}
            value={
                products.find(
                    (p) => String(p.id) === String(methods.getValues(`products.${index}.product`))
                ) || null
            }
            onChange={(_, newValue) => {
                if (newValue) {
                    methods.setValue(`products.${index}.product`, String(newValue.id), {
                        shouldValidate: true,
                    });
                    methods.setValue(
                        `products.${index}.unit`,
                        newValue.unitID != null ? String(newValue.unitID) : ""
                    );
                    methods.setValue(
                        `products.${index}.unitName`,
                        newValue.unit != null ? newValue.unit : ""
                    );
                    methods.setValue(`products.${index}.price`, newValue.price ?? 0);
                    methods.setValue(`products.${index}.vat`, newValue.vat ?? 0);
                } else {
                    methods.setValue(`products.${index}.product`, "");
                }
            }}
            noOptionsText="Không có dữ liệu"
            fullWidth
        />
    );
}

function UnitSelection({
    index,
    methods,
}: {
    index: number;
    methods: UseFormReturn<any>;
}) {
    const { units = [], unitsLoading } = useGetUnits({
        pageNumber: 1,
        pageSize: 999
    });

    return (
        <Field.Select name={`products.${index}.unit`} label="Đơn vị tính" fullWidth>
            {unitsLoading ? (
                <MenuItem disabled>Đang tải...</MenuItem>
            ) : (
                units.map((u) => (
                    <MenuItem key={u.id} value={String(u.id)}>
                        {u.name}
                    </MenuItem>
                ))
            )}
        </Field.Select>
    );
}
