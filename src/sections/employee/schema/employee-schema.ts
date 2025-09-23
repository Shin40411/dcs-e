import { IDateValue } from 'src/types/common';
import { z as zod } from 'zod';

export const NewEmployeeSchema = zod.object({
    name: zod.string().min(1, "Họ và tên là bắt buộc"),
    phone: zod.string().min(1, "Số điện thoại không được để trống").min(10, "Số điện thoại không hợp lệ"),
    email: zod.string().min(1, "Email không được để trống").email("Email không hợp lệ"),
    gender: zod.enum(["Male", "Female", "Other"]),
    bankAccount: zod.string().optional(),
    bankName: zod.string().optional(),
    birthday: zod.custom<IDateValue>(),
    balance: zod.number({ coerce: true })
        .nonnegative({ message: "Số dư không được âm" })
        .default(0)
        .optional(),
    address: zod.string().optional(),
    image: zod.any().optional(),
    departmentId: zod.number().min(1, { message: 'Phòng ban là trường bắt buộc' }),
    employeeTypeId: zod.number().min(1, { message: 'Chức vụ là trường bắt buộc' }),
    Folder: zod.string().min(1, { message: 'Thư mục tải lên là trường bắt buộc' }),
});

export type NewEmployeeSchemaType = Zod.infer<typeof NewEmployeeSchema>;