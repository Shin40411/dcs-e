import { NumericFormat } from 'react-number-format';
import { TextField, InputAdornment, Box, SxProps, Theme } from '@mui/material';

type Props = {
    label: string;
    value: number | undefined;
    onChange: (...event: any[]) => void;
    error: boolean;
    helperText?: string;
    required?: boolean;
    sx: SxProps<Theme> | undefined;
    disabled?: boolean;
};

export function VnCurrencyInput({ value, label, onChange, error, helperText, required, sx, disabled }: Props) {
    return (
        <>
            <NumericFormat
                customInput={TextField}
                value={value}
                onValueChange={(values) => {
                    onChange(values.floatValue);
                }}
                thousandSeparator="."
                decimalSeparator=","
                allowNegative={false}
                label={
                    required ? (
                        <>
                            {label} <Box component="span">*</Box>
                        </>
                    ) : (
                        label
                    )
                }
                sx={[
                    { width: '100%' },
                    ...(Array.isArray(sx) ? sx : [sx]),
                ]}
                error={error}
                helperText={helperText}
                disabled={disabled}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <Box component="span" sx={{ color: 'text.disabled' }}>
                                đ
                            </Box>
                        </InputAdornment>
                    ),
                }}
            />
        </>
    );
}
