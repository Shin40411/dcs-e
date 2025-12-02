import { IDateValue } from 'src/types/common';
import { z as zod } from 'zod';

export const WareHouseSchema = zod.object({
    exportDate: zod.custom<IDateValue>().refine(
        (val) => val !== null && val !== undefined && val !== "",
        { message: "Vui lòng chọn ngày xuất kho" }
    ),
    contract: zod.string().min(1, "Vui lòng chọn hợp đồng khách hàng trước khi xuất"),
    wareHouseNo: zod.string({ required_error: 'Số phiếu xuất kho là trường bắt buộc' }),

    receiverName: zod.string().optional(),
    receiverAddress: zod.string().min(4, 'Vui lòng nhập địa điểm đầy đủ'),

    note: zod.string().optional(),
});

export type WareHouseSchemaType = zod.infer<typeof WareHouseSchema>;
