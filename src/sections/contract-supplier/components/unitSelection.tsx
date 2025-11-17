import { MenuItem } from "@mui/material";
import { UseFormReturn } from "react-hook-form";
import { useGetUnits } from "src/actions/unit";
import { Field } from "src/components/hook-form";

export function UnitSelection({
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
        <Field.Select
            name={`products.${index}.unit`}
            placeholder="Đơn vị tính"
            fullWidth
            sx={{ width: 120 }}
        >
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
