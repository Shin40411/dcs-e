import type { TextFieldProps } from '@mui/material/TextField';

import { Controller, useFormContext } from 'react-hook-form';
import { transformValue, transformValueOnBlur, transformValueOnChange } from 'minimal-shared/utils';

import TextField from '@mui/material/TextField';
import { TaxCodeInput } from '../tax-code';

// ----------------------------------------------------------------------

export type RHFTextFieldProps = TextFieldProps & {
  name: string;
  required?: boolean;
};

export function RHFTextField({
  name,
  helperText,
  slotProps,
  type = 'text',
  ...other
}: RHFTextFieldProps) {
  const { control } = useFormContext();

  const isNumberType = type === 'number';

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          value={isNumberType ? transformValue(field.value) : field.value}
          disabled={other.disabled}
          onChange={(event) => {
            const transformedValue = isNumberType
              ? transformValueOnChange(event.target.value)
              : event.target.value;

            field.onChange(transformedValue);
          }}
          onBlur={(event) => {
            const transformedValue = isNumberType
              ? transformValueOnBlur(event.target.value)
              : event.target.value;

            field.onChange(transformedValue);
          }}
          type={isNumberType ? 'text' : type}
          error={!!error}
          helperText={error?.message ?? helperText}
          slotProps={{
            ...slotProps,
            htmlInput: {
              autoComplete: 'off',
              ...slotProps?.htmlInput,
              ...(isNumberType && { inputMode: 'decimal', pattern: '[0-9]*\\.?[0-9]*' }),
            },
          }}
          sx={{
            ...(other.disabled && {
              '& .MuiInputBase-input': {
                color: 'text.disabled',
                cursor: 'not-allowed'
              },
              '& .MuiInputLabel-root': {
                color: 'text.disabled',
              },
              '& .MuiOutlinedInput-root': {
                backgroundColor: (theme) => theme.palette.action.disabledBackground,
              },
            }),
            ...other.sx,
          }}
          {...other}
        />
      )}
    />
  );
}

export function RHFTaxCodeField({
  name,
  helperText,
  slotProps,
  required,
  ...other
}: RHFTextFieldProps) {
  const { control } = useFormContext();
  return (
    <Controller
      name="taxCode"
      control={control}
      render={({ field, fieldState }) => (
        <TaxCodeInput
          {...field}
          label="Mã số thuế"
          error={!!fieldState.error}
          helperText={fieldState.error?.message || "Nhập mã số thuế"}
          required={required}
        />
      )}
    />
  );
}