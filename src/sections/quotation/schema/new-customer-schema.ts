import { z } from "zod";

export const customerSchema = z.object({
    customerType: z.string().min(1, "Vui lòng chọn loại khách hàng"),
    name: z.string().min(1, "Tên khách hàng là trường bắt buộc"),
    phone: z.string().min(10, "Số điện thoại tối thiểu 10 số"),
    taxCode: z.string().trim()
        .refine(
            (val) => val === "" || /^\d{10}(-\d{3})?$/.test(val),
            "Mã số thuế phải gồm 10 chữ số hoặc 10 chữ số + '-' + 3 chữ số"
        ).optional(),
    companyName: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.customerType === "KHDN") {
        if (!data.taxCode || data.taxCode.trim() === "") {
            ctx.addIssue({
                code: "custom",
                path: ["taxCode"],
                message: "Mã số thuế là bắt buộc với khách hàng doanh nghiệp",
            });
        }
        if (!data.companyName || data.companyName.trim() === "") {
            ctx.addIssue({
                code: "custom",
                path: ["companyName"],
                message: "Tên công ty là bắt buộc với khách hàng doanh nghiệp",
            });
        }
    }
});


export type CustomerFormValues = z.infer<typeof customerSchema>;