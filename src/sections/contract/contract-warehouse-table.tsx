import { useWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import { fCurrency, fRenderTextNumber } from "src/utils/format-number";
import { Iconify } from "src/components/iconify";
import { capitalizeFirstLetter } from "src/utils/format-string";
import { useBoolean } from "minimal-shared/hooks";
import { ContractFormValues } from "./schema/contract-schema";
import { ContractWareHouseTableProps } from "./helper/ContractItemsTableProps";
import ContractItemsTableContent from "./components/contractItemTable";
import { ContractWareHouseSchemaType } from "./schema/contract-warehouse";

export function ContractWarehouseTable({
    idContract,
    contractProductDetail,
    methods,
    fields,
    remove,
    append,
    setPaid
}: ContractWareHouseTableProps) {
    const items = useWatch({
        control: methods.control,
        name: "products",
    }) as ContractWareHouseSchemaType["products"];

    const calcAmount = (item: { qty?: number; price?: number; vat?: number }) => {
        const qty = Number(item?.qty) || 0;
        const price = Number(item?.price) || 0;
        const vat = Number(item?.vat) || 0;
        return qty * price * (1 + vat / 100);
    };

    const total = (items || []).reduce((acc, i) => acc + calcAmount(i), 0);

    const roundedTotal = Math.round(total);

    const openDel = useBoolean();

    const [indexField, setIndexField] = useState(0);

    const [productIDSelected, setProductIDSelected] = useState('');

    // const deleteEachProduct = async () => {
    //     try {
    //         if (!idContract) return;
    //         if (fields.length <= 1) {
    //             toast.warning("Phiếu hợp đồng đã tạo phải có ít nhất 1 sản phẩm");
    //             toast.warning("Không thể xóa sản phẩm này");
    //             openDel.onFalse();
    //             return;
    //         }

    //         await deleteProductSelected({
    //             productID: productIDSelected,
    //             contractId: String(idContract)
    //         });
    //         remove(indexField);
    //         toast.success("Đã xóa sản phẩm ra khỏi danh sách");
    //         openDel.onFalse();

    //         mutate(
    //             (k) => typeof k === "string" && k.startsWith("/api/v1/contracts/contracts"),
    //             undefined,
    //             { revalidate: true }
    //         );

    //         mutate(endpoints.contract.detail(`?pageNumber=1&pageSize=999&ContractId=${idContract}`));
    //     } catch (error: any) {
    //         console.error(error);
    //         if (error.message) {
    //             toast.error(error.message);
    //         } else {
    //             toast.error("Đã có lỗi xảy ra!");
    //         }
    //     }
    // };

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
                    // onClick={deleteEachProduct}
                    >
                        Xóa
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    );

    useEffect(() => {
        setPaid(roundedTotal);
    }, [roundedTotal]);

    return (
        <Box mt={3}>
            <Typography variant="subtitle2">Sản phẩm</Typography>

            <Box sx={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
                <Box sx={{ overflowY: "auto" }}>
                    <ContractItemsTableContent
                        fields={fields}
                        append={append}
                        calcAmount={calcAmount}
                        items={items}
                        methods={methods}
                        openDel={openDel}
                        remove={remove}
                        setIndexField={setIndexField}
                        setProductIDSelected={setProductIDSelected}
                        contractProductDetail={contractProductDetail}
                        idContract={idContract}
                        disabledAddMore
                    />
                </Box>

                <Box
                    sx={{
                        position: "sticky",
                        bottom: -15,
                        borderTop: "1px solid",
                        borderColor: "divider",
                        p: 2,
                        bgcolor: "background.paper",
                        zIndex: 1,
                        display: 'flex',
                        flexDirection: "row",
                        gap: '50px',
                        justifyContent: 'space-between'
                    }}
                >
                    <Stack direction="column" justifyContent="flex-start" textAlign={'start'}>
                        <Typography fontWeight={600}>Tổng cộng</Typography>
                        <Typography fontWeight="bold" whiteSpace="nowrap">
                            {fCurrency(roundedTotal)}
                        </Typography>
                    </Stack>
                    <Stack direction="column" justifyContent="flex-end" textAlign={'end'}>
                        <Typography fontWeight={600}>Bằng chữ</Typography>
                        <Typography fontSize={15}>
                            {capitalizeFirstLetter(fRenderTextNumber(roundedTotal))}
                        </Typography>
                    </Stack>
                </Box>
            </Box>
            {/* {confirmDeleteUpdateProduct()} */}
        </Box>
    );
}