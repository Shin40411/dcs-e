import { IDateValue } from 'src/types/common';
import { z as zod } from 'zod';

export const ContractWareHouseSchema = zod.object({
    exportDate: zod.custom<IDateValue>().refine(
        (val) => val !== null && val !== undefined && val !== "",
        { message: "Vui lòng chọn ngày xuất kho" }
    ),

    wareHouseNo: zod.string({ required_error: 'Số phiếu xuất kho là trường bắt buộc' }),

    receiverName: zod.string().min(1, 'Tên người nhận là trường bắt buộc'),
    receiverAddress: zod.string().min(4, 'Vui lòng nhập địa điểm đầy đủ'),

    note: zod.string().optional(),
});

export type ContractWareHouseSchemaType = zod.infer<typeof ContractWareHouseSchema>;
