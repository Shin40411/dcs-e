import type { ZodTypeAny } from 'zod';

import dayjs from 'dayjs';
import { z as zod } from 'zod';

// ----------------------------------------------------------------------

type MessageMapProps = {
  required?: string;
  invalid_type?: string;
};

export const schemaHelper = {
  /**
   * Phone number
   * Apply for phone number input.
   */
  phoneNumber: (props?: { message?: MessageMapProps; isValid?: (text: string) => boolean }) =>
    zod
      .string({
        required_error: props?.message?.required ?? 'Phone number is required!',
        invalid_type_error: props?.message?.invalid_type ?? 'Invalid phone number!',
      })
      .min(1, { message: props?.message?.required ?? 'Phone number is required!' })
      .refine((data) => props?.isValid?.(data), {
        message: props?.message?.invalid_type ?? 'Invalid phone number!',
      }),
  /**
   * Date
   * Apply for date pickers.
   */
  date: (props?: { message?: MessageMapProps }) =>
    zod.coerce
      .date()
      .nullable()
      .transform((dateString, ctx) => {
        const date = dayjs(dateString).format();

        const stringToDate = zod.string().pipe(zod.coerce.date());

        if (!dateString) {
          ctx.addIssue({
            code: zod.ZodIssueCode.custom,
            message: props?.message?.required ?? 'Date is required!',
          });
          return null;
        }

        if (!stringToDate.safeParse(date).success) {
          ctx.addIssue({
            code: zod.ZodIssueCode.invalid_date,
            message: props?.message?.invalid_type ?? 'Invalid Date!!',
          });
        }

        return date;
      })
      .pipe(zod.union([zod.number(), zod.string(), zod.date(), zod.null()])),
  /**
   * Editor
   * defaultValue === '' | <p></p>
   * Apply for editor
   */
  editor: (props?: { message: string }) =>
    zod.string().min(8, { message: props?.message ?? 'Content is required!' }),
  /**
   * Nullable Input
   * Apply for input, select... with null value.
   */
  nullableInput: <T extends ZodTypeAny>(schema: T, options?: { message?: string }) =>
    schema.nullable().transform((val, ctx) => {
      if (val === null || val === undefined) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: options?.message ?? 'Field can not be null!',
        });
        return val;
      }
      return val;
    }),
  /**
   * Boolean
   * Apply for checkbox, switch...
   */
  boolean: (props?: { message: string }) =>
    zod.boolean({ coerce: true }).refine((val) => val === true, {
      message: props?.message ?? 'Field is required!',
    }),
  /**
   * Slider
   * Apply for slider with range [min, max].
   */
  sliderRange: (props: { message?: string; min: number; max: number }) =>
    zod
      .number()
      .array()
      .refine((data) => data[0] >= props?.min && data[1] <= props?.max, {
        message: props.message ?? `Range must be between ${props?.min} and ${props?.max}`,
      }),
  /**
   * File
   * Apply for upload single file.
   */
  file: (props?: { message: string; allowedTypes?: string[]; maxSize?: number; invalid_file_type?: string; }) =>
    zod.custom<File | string | null>().transform((data, ctx) => {
      if (typeof data === 'string' && data.length > 0) {
        return data;
      }

      if (!(data instanceof File)) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: props?.message ?? 'File is required!',
        });
        return null;
      }

      const allowedTypes = props?.allowedTypes ?? [
        'image/png',
        'image/jpg',
        'image/jpeg'
      ];

      if (!allowedTypes.includes(data.type)) {
        const allowedExtensions = allowedTypes
          .map(type => type.split('/')[1].toUpperCase())
          .join(', ');

        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: props?.invalid_file_type ?? `Chỉ chấp nhận file ${allowedExtensions}!`,
        });
        return null;
      }

      if (props?.maxSize && data.size > props.maxSize) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: `File không được vượt quá ${props.maxSize / 1024 / 1024}MB!`,
        });
        return null;
      }

      return data;
    }),
  /**
   * Files
   * Apply for upload multiple files.
   */
  files: (props?: { message: string; minFiles?: number }) =>
    zod.array(zod.custom<File | string>()).transform((data, ctx) => {
      const minFiles = props?.minFiles ?? 2;

      if (!data.length) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: props?.message ?? 'Files is required!',
        });
      } else if (data.length < minFiles) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: `Must have at least ${minFiles} items!`,
        });
      }

      return data;
    }),
};
