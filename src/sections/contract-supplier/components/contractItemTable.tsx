import { Box, Button, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import { Field } from "src/components/hook-form";
import { Iconify } from "src/components/iconify";
import { fCurrency } from "src/utils/format-number";
import { ContractItemsTableContentProps, ContractItemsTableProps } from "../helper/ContractItemsTableProps";
import { ProductAutocomplete } from "./productAutoComplete";
import { UnitSelection } from "./unitSelection";

export default function ContractItemsTableContent({
    fields,
    methods,
    calcAmount,
    append,
    items,
    idContract,
    remove,
    contractProductDetail,
    openDel,
    setProductIDSelected,
    setIndexField,
}: ContractItemsTableContentProps) {
    const total = fields.reduce((sum, item, index) => {
        const qty = Number(methods.getValues(`products.${index}.qty`) || 0);
        const price = Number(methods.getValues(`products.${index}.price`) || 0);
        const vat = Number(methods.getValues(`products.${index}.vat`) || 0);
        return sum + calcAmount({ qty, price, vat });
    }, 0);

    return (
        <TableContainer component={Paper} sx={{
            maxWidth: "100%",
            maxHeight: 600,
            overflowX: "auto",
            flex: 1
        }}>
            <Table size="small" stickyHeader sx={{ minWidth: 600, overflowY: "auto" }}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ whiteSpace: "nowrap" }} width="50">STT</TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>Tên SP</TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }} width="150">Số lượng</TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }} width="150">Đơn giá</TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }} width="150">Đơn vị tính</TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }} width="100">VAT</TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }} width="150">Thành tiền</TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }} width="80"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {fields.map((field, index) => (
                        <TableRow key={field.id}>
                            <TableCell sx={{ whiteSpace: "nowrap" }}>
                                {index + 1}
                            </TableCell>
                            <TableCell sx={{ whiteSpace: "nowrap" }}>
                                <ProductAutocomplete index={index} methods={methods} append={append} />
                            </TableCell>

                            <TableCell sx={{ whiteSpace: "nowrap" }}>
                                <Field.NumberInput name={`products.${index}.qty`} sx={{ width: 100 }} />
                            </TableCell>

                            <TableCell sx={{ whiteSpace: "nowrap" }}>
                                <Field.VNCurrencyInput name={`products.${index}.price`} sx={{ width: 100 }} />
                            </TableCell>

                            <TableCell sx={{ whiteSpace: "nowrap" }}>
                                <UnitSelection index={index} methods={methods} />
                            </TableCell>

                            <TableCell sx={{ whiteSpace: "nowrap" }}>
                                <Typography variant="body2">
                                    {items?.[index]?.vat != null
                                        ? `${items[index].vat}%`
                                        : ""}
                                </Typography>
                            </TableCell>

                            <TableCell sx={{ whiteSpace: "nowrap" }}>
                                <Typography fontWeight="bold">
                                    {fCurrency(calcAmount(items[index]))}
                                </Typography>
                            </TableCell>

                            <TableCell sx={{ whiteSpace: "nowrap" }}>
                                <Stack direction="row">
                                    <Tooltip title="Xóa sản phẩm" placement="top" arrow>
                                        <IconButton onClick={() => {
                                            if (idContract) {
                                                const idPro = methods.getValues(`products.${index}.product`);
                                                const exists = contractProductDetail?.some(p => String(p.productID) === idPro);
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
                </TableBody>
            </Table>
        </TableContainer>
    );
}