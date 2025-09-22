import { Box, TextField } from "@mui/material";
import { ChangeEvent } from "react";

type TaxCodeInputProps = {
    value: string | undefined;
    onChange: (value: string | undefined) => void;
    label?: string;
    error?: boolean;
    helperText?: string;
    required?: boolean;
};


export function TaxCodeInput({ value, onChange, label, error, helperText, required }: TaxCodeInputProps) {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, "");

        if (val.length > 13) {
            val = val.slice(0, 13);
        }

        if (val.length === 13) {
            val = val.slice(0, 10) + "-" + val.slice(10);
        }

        onChange?.(val);
    };

    return (
        <TextField
            fullWidth
            value={value || ""}
            onChange={handleChange}
            label={
                required ? (
                    <>
                        {label} <Box component="span">*</Box>
                    </>
                ) : (
                    label
                )
            }
            error={error}
            helperText={helperText}
        />
    );
}
