import { FormControl, FormControlLabel, Radio, RadioGroup, Stack } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

type propductFilterProps = {
    filterProps: {
        pageNumber: number;
        pageSize: number;
        totalPages: number;
        totalRecord: number;
        allProduct: number;
        alMostOutOfStock: number;
        outOfStock: number;
        longTermInventory: number;
    };
    onChangeState: Dispatch<SetStateAction<string>>;
}

export function ProductFilterAddition({ filterProps, onChangeState }: propductFilterProps) {
    return (
        <>
            <Stack direction="row" spacing={3} border="1px solid #ddd" borderRadius={1} pl={1}>
                <FormControl>
                    <RadioGroup
                        row
                        name="product-filter-group"
                        defaultValue="all"
                        onChange={(e) => onChangeState(e.target.value)}
                    >
                        <FormControlLabel value="all" control={<Radio />} label={`Tất cả sản phẩm (${filterProps.allProduct})`} />
                        <FormControlLabel value="longTermInventory" control={<Radio />} label={`Tồn kho lâu (${filterProps.longTermInventory})`} />
                        <FormControlLabel value="alMostOutOfStock" control={<Radio />} label={`Sắp hết hàng (${filterProps.alMostOutOfStock})`} />
                        <FormControlLabel value="outOfStock" control={<Radio />} label={`Hết hàng (${filterProps.outOfStock})`} />
                    </RadioGroup>
                </FormControl>
            </Stack>
        </>
    );
}