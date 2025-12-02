import { Controller, useFormContext } from 'react-hook-form';

import { NumberInput } from '../number-input';

import type { NumberInputProps } from '../number-input';
import { ResizableCurrencyInput, VnCurrencyInput } from '../numeric-format';

// ----------------------------------------------------------------------

export type RHFNumberInputProps = NumberInputProps & {
  name: string;
  label?: string;
  required?: boolean;
};

export function RHFNumberInput({ name, helperText, ...other }: RHFNumberInputProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <NumberInput
          {...field}
          onChange={(event, value) => field.onChange(value)}
          {...other}
          error={!!error}
          helperText={error?.message ?? helperText}
        />
      )}
    />
  );
}

export function RHFNumericInput({ name, label, helperText, required, sx, ...other }: RHFNumberInputProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <VnCurrencyInput
          label={label || ''}
          value={field.value}
          onChange={field.onChange}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
          required={required}
          sx={sx}
          {...other}
        />
      )}
    />
  );
}

export function RHFNumericInputResizable({ name, label, helperText, required, sx, ...other }: RHFNumberInputProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <ResizableCurrencyInput
          label={label || ""}
          value={field.value}
          onChange={field.onChange}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
          required={required}
          sx={sx}
          disabled={other.disabled}
        />
      )}
    />
  );
}