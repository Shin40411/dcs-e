import { Controller, useFormContext } from 'react-hook-form';

import { NumberInput } from '../number-input';

import type { NumberInputProps } from '../number-input';
import { VnCurrencyInput } from '../numeric-format';

// ----------------------------------------------------------------------

export type RHFNumberInputProps = NumberInputProps & {
  name: string;
  label?: string;
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

export function RHFNumericInput({ name, label, helperText, ...other }: RHFNumberInputProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <VnCurrencyInput label={label || ''} value={field.value} onChange={field.onChange} />
      )}
    />
  );
}