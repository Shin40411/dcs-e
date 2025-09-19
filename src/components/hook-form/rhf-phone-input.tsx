import { Controller, useFormContext } from 'react-hook-form';

import { PhoneInput } from '../phone-input';

import type { PhoneInputProps } from '../phone-input';
import { TextField } from '@mui/material';
import { ChangeEvent } from 'react';
import { PatternFormat } from 'react-number-format';

// ----------------------------------------------------------------------

export type RHFPhoneInputProps = Omit<PhoneInputProps, 'value' | 'onChange'> & {
  name: string;
};

export function RHFPhoneInput({ name, helperText, ...other }: RHFPhoneInputProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <PhoneInput
          {...field}
          fullWidth
          error={!!error}
          helperText={error?.message ?? helperText}
          {...other}
        />
      )}
    />
  );
}

export function RHFPhoneField({
  name,
  label,
  helperText,
  required,
  ...props
}: {
  name: string;
  label: string;
  helperText?: string;
  required?: boolean;
  [key: string]: any;
}) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: required ? "Số điện thoại là bắt buộc" : false,
        validate: (value) => {
          const digits = value.replace(/\D/g, "");
          if (!/^(\+84|0)\d{9}$/.test(digits)) {
            return "Số điện thoại không hợp lệ (VD: 090 123 4567)";
          }
          return true;
        },
      }}
      render={({ field, fieldState }) => (
        <PatternFormat
          {...field}
          {...props}
          customInput={TextField}
          format="### ### ####"
          mask="_"
          allowEmptyFormatting={false}
          label={label}
          required={required}
          helperText={fieldState.error?.message || helperText}
          error={!!fieldState.error}
          fullWidth
          onValueChange={(values) => {
            // Lưu raw value (không có khoảng trắng) vào form
            field.onChange(values.value);
          }}
        />
      )}
    />
  );
}