import { NumericFormat } from 'react-number-format';
import { TextField, InputAdornment, Box } from '@mui/material';

type Props = {
    label: string;
    value: number | undefined;
    onChange: (...event: any[]) => void;
    error: boolean;
    helperText?: string;
    required?: boolean;
};

export function VnCurrencyInput({ value, label, onChange, error, helperText, required }: Props) {
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
                sx={{ width: '100%' }}
                error={error}
                helperText={helperText}
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
