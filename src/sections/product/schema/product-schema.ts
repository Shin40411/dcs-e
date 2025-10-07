import { z as zod } from 'zod';

export type NewProductSchemaType = zod.infer<typeof NewProductSchema>;

export const NewProductSchema = zod.object({
    name: zod.string().min(1, { message: 'Tên sản phẩm là trường bắt buộc' }),
    code: zod.string().min(1, { message: 'Mã sản phẩm là trường bắt buộc' }),
    description: zod
        .string()
        .optional(),
    purchasePrice: zod.preprocess(
        (val) => {
            if (val === "" || val === null || val === undefined) return undefined;
            const num = Number(val);
            return isNaN(num) ? undefined : num;
        },
        zod.number({ required_error: 'Giá nhập là trường bắt buộc' })
            .min(1, 'Giá nhập phải lớn hơn 0')
    ),
    price: zod.preprocess(
        (val) => {
            if (val === "" || val === null || val === undefined) return undefined;
            const num = Number(val);
            return isNaN(num) ? undefined : num;
        },
        zod.number({ required_error: 'Giá bán là trường bắt buộc' })
            .min(1, 'Giá bán phải lớn hơn 0')
    ),
    unitId: zod.number().min(1, { message: 'Đơn vị tính là trường bắt buộc' }),
    categoryId: zod.number().min(1, { message: 'Nhóm sản phẩm là trường bắt buộc' }),
    stock: zod
        .number({ coerce: true })
        .min(1, { message: 'Số lượng tồn kho là trường bắt buộc' }),
    warranty: zod
        .number({ coerce: true })
        .min(1, { message: 'Thời gian bảo hành là trường bắt buộc' })
        .max(24, { message: 'Thời gian bảo hành không được lớn hơn 24 tháng' }),
    manufacturer: zod
        .string()
        .min(1, { message: 'Nhà sản xuất là trường bắt buộc' }),
    vat: zod
        .number({ coerce: true })
        .min(0, { message: 'VAT không được nhỏ hơn 0%' })
        .max(100, { message: 'VAT không được lớn hơn 100%' }),
    image: zod
        .any()
        .refine((file) => file instanceof File || typeof file === 'string', {
            message: 'Ảnh sản phẩm không hợp lệ',
        }).nullable().optional(),
    Folder: zod.string().min(1, { message: 'Thư mục tải lên là trường bắt buộc' }),
}).refine((data) => data.price >= data.purchasePrice, {
    message: 'Giá bán phải lớn hơn giá nhập',
    path: ['price'],
});