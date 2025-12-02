import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useGetProducts } from "src/actions/product";
import { Field } from "src/components/hook-form";

export function ProductAutocomplete({
    index,
    methods,
    append
}: {
    index: number;
    methods: UseFormReturn<any>;
    append: (v: any) => void;
}) {
    const [keyword, setKeyword] = useState("");
    const [debouncedKeyword, setDebouncedKeyword] = useState("");

    // useEffect(() => {
    //     const handler = setTimeout(() => setDebouncedKeyword(keyword), 500);
    //     return () => clearTimeout(handler);
    // }, [keyword]);

    const { products = [], productsLoading } = useGetProducts({
        pageNumber: 1,
        pageSize: 999,
        key: debouncedKeyword,
    });

    return (
        <Field.Autocomplete
            name={`products.${index}.product`}
            placeholder="Chọn sản phẩm"
            options={products}
            loading={productsLoading}
            getOptionLabel={(opt) => opt?.name ?? ""}
            isOptionEqualToValue={(opt, val) => opt?.id === val?.id}
            // onInputChange={(_, value) => setKeyword(value)}
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
                    const rowId = methods.getValues(`products.${index}.id`);

                    methods.setValue(`products.${index}.product`, String(newValue.id), {
                        shouldValidate: true,
                    });
                    methods.setValue(`products.${index}.id`, rowId);
                    methods.setValue(
                        `products.${index}.unit`,
                        newValue.unitID != null ? String(newValue.unitID) : ""
                    );
                    methods.setValue(
                        `products.${index}.unitName`,
                        newValue.unit != null ? newValue.unit : ""
                    );
                    methods.setValue(`products.${index}.price`, newValue.purchasePrice ?? 0);
                    methods.setValue(`products.${index}.vat`, newValue.vat ?? 0);

                    const productsArr = methods.getValues('products') || [];
                    const lastIndex = productsArr.length - 1;
                    if (index === lastIndex) {
                        append({
                            name: "",
                            unit: "",
                            qty: 1,
                            price: 0,
                            vat: 0,
                        });
                    }
                }
            }}
            noOptionsText="Không có dữ liệu"
            fullWidth
            sx={{ width: 450 }}
        />
    );
}