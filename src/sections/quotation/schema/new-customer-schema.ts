import { z } from "zod";

export const customerSchema = z.object({
    name: z.string().min(1, "Tên khách hàng là trường bắt buộc"),
    companyName: z.string().min(1, "Tên công ty là trường bắt buộc"),
    email: z.string().email("Email không hợp lệ"),
    phone: z.string().min(10, "Số điện thoại tối thiểu 10 số"),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;