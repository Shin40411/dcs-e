import { NumericFormat } from 'react-number-format';
import { TextField, InputAdornment, Box } from '@mui/material';

type Props = {
    label: string;
    value: number | undefined;
    onChange: (value: number | undefined) => void;
};

export function VnCurrencyInput({ value, label, onChange }: Props) {
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
                label={label}
                sx={{ width: '100%' }}
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
