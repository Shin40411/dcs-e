import { IDateValue } from 'src/types/common';
import { z as zod } from 'zod';
import { contractItemSchema } from './contract-schema';

export const ContractWareHouseSchema = zod.object({
    // customerID: zod
    //     .number({ required_error: 'Vui lòng chọn khách hàng' })
    //     .int()
    //     .positive('ID khách hàng không hợp lệ'),

    exportDate: zod.custom<IDateValue>().refine(
        (val) => val !== null && val !== undefined && val !== "",
        { message: "Vui lòng chọn ngày xuất kho" }
    ),

    receiverName: zod
        .string({ required_error: 'Tên người nhận là trường bắt buộc' })
        .min(2, 'Tên người nhận phải có ít nhất 2 ký tự'),

    // receiverPhone: zod
    //     .string({ required_error: 'Số điện thoại là trường bắt buộc' })
    //     .regex(/^(0|\+84)\d{9}$/, 'Số điện thoại không hợp lệ'),

    receiverAddress: zod
        .string({ required_error: 'Địa điểm người nhận là trường bắt buộc' })
        .min(5, 'Địa điểm phải có ít nhất 5 ký tự'),

    note: zod.string().optional(),

    products: zod.array(contractItemSchema).min(1, "Thêm ít nhất 1 sản phẩm"),
});

export type ContractWareHouseSchemaType = zod.infer<typeof ContractWareHouseSchema>;
