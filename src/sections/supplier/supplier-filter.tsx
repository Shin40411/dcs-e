import { FormControl, FormControlLabel, Radio, RadioGroup, Stack } from "@mui/material";
import { ChangeEvent } from "react";

type supplierFilterProps = {
    allRecord: number;
    businessRecord: number;
    unBusinessRecord: number;
    filterState: boolean | null;
    onChangeState: (value: boolean | null) => void;
}

export function SupplierFilter({
    allRecord,
    businessRecord,
    filterState,
    onChangeState,
    unBusinessRecord }: supplierFilterProps) {
    const currentValue = filterState === true ? 'business' : (filterState === false ? 'personal' : 'all');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (val === 'business') {
            onChangeState(true);
        } else if (val === 'personal') {
            onChangeState(false);
        } else {
            onChangeState(null);
        }
    };

    return (
        <Stack direction="row" spacing={3} border="1px solid #ddd" borderRadius={1} pl={1}>
            <FormControl>
                <RadioGroup
                    row
                    name="supplier-filter-group"
                    value={currentValue}
                    onChange={handleChange}
                >
                    <FormControlLabel value="all" control={<Radio />} label={`Tất cả nhà cung cấp (${allRecord})`} />
                    <FormControlLabel value="business" control={<Radio />} label={`Doanh nghiệp (${businessRecord ?? 0})`} />
                    <FormControlLabel value="personal" control={<Radio />} label={`Cá nhân (${unBusinessRecord ?? 0})`} />
                </RadioGroup>
            </FormControl>
        </Stack>
    );
}