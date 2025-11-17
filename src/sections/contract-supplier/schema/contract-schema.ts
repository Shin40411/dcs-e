import { IDateValue } from "src/types/common";
import { z } from "zod";

export const contractItemSchema = z.object({
    id: z.number().optional(),
    product: z.string().min(1, "Vui lòng chọn sản phẩm"),
    unit: z.string().optional().or(z.literal("")),
    unitName: z.string().optional().or(z.literal("")),
    qty: z.number().min(1, "Số lượng > 0"),
    price: z.number().min(0, "Đơn giá >= 0"),
    vat: z.number().optional(),
});

const customItemsSchema = z
    .array(contractItemSchema.partial())
    .superRefine((items, ctx) => {
        if (items.length === 0) return;

        const lastIndex = items.length - 1;

        items.forEach((item, index) => {
            const isLast = index === lastIndex;
            const isEmpty = !item.product || item.product === "";

            if (isLast && isEmpty) return;

            const result = contractItemSchema.safeParse(item);
            if (!result.success) {
                for (const issue of result.error.issues) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: issue.message,
                        path: [index, ...issue.path],
                    });
                }
            }
        });
    });

export const contractSchema = z.object({
    contractNo: z.string().min(1, "Vui lòng nhập số phiếu"),
    supplierId: z.number().min(1, { message: "Vui lòng chọn nhà cung cấp" }),
    createDate: z.custom<IDateValue>().refine(
        (val) => val !== null && val !== undefined && val !== "",
        { message: "Vui lòng chọn ngày tạo" }
    ),
    signatureDate: z.custom<IDateValue>().refine(
        (val) => val !== null && val !== undefined && val !== "",
        { message: "Vui lòng chọn ngày ký" }
    ),
    deliveryAddress: z.string().optional(),
    deliveryTime: z.custom<IDateValue>().refine(
        (val) => val !== null && val !== undefined && val !== "",
        { message: "Vui lòng chọn thời gian giao" }
    ),
    downPayment: z.number().min(0),
    nextPayment: z.number().min(0),
    lastPayment: z.number().min(0),
    copiesNo: z.coerce
        .number()
        .int()
        .min(1, "Số bản phải lớn hơn 0")
        .refine((val) => !isNaN(val), { message: "Vui lòng nhập số bản hợp lệ" }),

    keptNo: z.coerce
        .number()
        .int()
        .min(1, "Số bản lưu phải lớn hơn 0")
        .refine((val) => !isNaN(val), { message: "Vui lòng nhập số bản lưu hợp lệ" }),
    status: z.number().min(0).max(5),
    note: z.string().optional(),
    discount: z.number().min(0),
    products: customItemsSchema,
}).refine((data) => data.copiesNo >= 2, {
    message: "Số bản sao phải ít nhất là 2",
    path: ["copiesNo"],
})
    .refine((data) => data.keptNo < data.copiesNo, {
        message: "Số bản lưu phải nhỏ hơn tổng số bản",
        path: ["keptNo"],
    });;

export type ContractFormValues = z.infer<typeof contractSchema>;