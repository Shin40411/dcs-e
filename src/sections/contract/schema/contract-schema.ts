import { IDateValue } from "src/types/common";
import { z } from "zod";

export const contractItemSchema = z.object({
    product: z.string().min(1, "Vui lòng chọn sản phẩm"),
    unit: z.string().optional().or(z.literal("")),
    unitName: z.string().optional().or(z.literal("")),
    qty: z.number().min(1, "Số lượng > 0"),
    price: z.number().min(0, "Đơn giá >= 0"),
    vat: z.number().optional(),
});

export const contractSchema = z.object({
    contractNo: z.string().min(1, "Vui lòng nhập số phiếu"),
    customerId: z.number().min(1, { message: "Vui lòng chọn khách hàng" }),
    createDate: z.custom<IDateValue>().refine(
        (val) => val !== null && val !== undefined && val !== "",
        { message: "Vui lòng chọn ngày tạo" }
    ),
    signatureDate: z.custom<IDateValue>().refine(
        (val) => val !== null && val !== undefined && val !== "",
        { message: "Vui lòng chọn ngày ký" }
    ),
    deliveryAddress: z.string().min(1, { message: "Địa chỉ giao hàng là bắt buộc" }),
    deliveryTime: z.custom<IDateValue>().refine(
        (val) => val !== null && val !== undefined && val !== "",
        { message: "Vui lòng chọn thời gian giao" }
    ),
    downPayment: z.number().nonnegative(),
    nextPayment: z.number().nonnegative(),
    lastPayment: z.number().nonnegative(),
    copiesNo: z.number().int().min(1),
    keptNo: z.number().int().min(1),
    status: z.number().min(0).max(5),
    note: z.string().optional(),
    discount: z.number().min(0),
    products: z.array(contractItemSchema).min(1, "Thêm ít nhất 1 sản phẩm"),
});

export type ContractFormValues = z.infer<typeof contractSchema>;