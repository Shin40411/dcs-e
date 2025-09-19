import { IDateValue } from "src/types/common";
import { z } from "zod";
import { customerSchema } from "./new-customer-schema";

export const quotationItemSchema = z.object({
    product: z
        .object({
            id: z.string().optional(),
            name: z.string().optional(),
        })
        .refine((val) => val?.id && val.id.length > 0, {
            message: "Vui lòng chọn sản phẩm",
            path: [],
        }),
    unit: z.string().optional().or(z.literal("")),
    qty: z.number().min(1, "Số lượng > 0"),
    price: z.number().min(0, "Đơn giá >= 0"),
    vat: z.number().optional(),
});

export const quotationSchema = z.object({
    customer: z.number().min(1, { message: "Vui lòng chọn khách hàng" }),
    quotationNo: z
        .string()
        .min(1, "Mã báo giá là trường bắt buộc")
        .max(15, "Mã báo giá tối đa 15 ký tự"),
    date: z.custom<IDateValue>(),
    validUntil: z.custom<IDateValue>(),
    status: z.number().min(0).max(4),
    items: z.array(quotationItemSchema).min(1, "Thêm ít nhất 1 sản phẩm"),
    discount: z.preprocess(
        (val) => {
            if (val === "" || val === null || val === undefined) {
                return undefined;
            }
            return Number(val);
        },
        z.number().min(0).max(30, "Khuyến mãi nhập tối đa là 30%").optional()
    ),
    notes: z.string().optional(),
    customerDetails: customerSchema.optional(),
});

export type QuotationFormValues = z.infer<typeof quotationSchema>;