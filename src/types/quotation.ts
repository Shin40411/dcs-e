import { IDateValue } from "./common";
import { z } from "zod";

export type IQuotationItem = {
    id: number;
    quotationNo: string;
    customerId: number;
    customerName: string;
    customerPhone: string;
    companyName: string;
    email: string;
    address: string;
    createdDate: IDateValue;
    createdBy: string;
    modifyDate: IDateValue;
    modifyBy: string;
    expiryDate: IDateValue;
    totalAmount: number;
    note: string;
    seller: string;
    status: number;
    discount: number;
    paid: number;
    remaining: number;
    isDeleted: boolean;
};

export type IQuotationListData = {
    pageNumber: number;
    pageSize: number;
    totalRecord: number;
    totalPages: number;
    items: IQuotationItem[];
};

export type ResQuotationList = {
    statusCode: number;
    message: string;
    data: IQuotationListData;
};

export type FilterValues = {
    fromDate: IDateValue;
    toDate: IDateValue;
};

export const quotationItemSchema = z.object({
    name: z.string().min(1, "Nhập tên sản phẩm/dịch vụ"),
    description: z.string().optional(),
    qty: z.number().min(1, "Số lượng > 0"),
    price: z.number().min(0, "Đơn giá >= 0"),
    vat: z.number().optional(),
});

export const quotationSchema = z.object({
    customer: z.string().min(1, "Vui lòng chọn khách hàng"),
    date: z.string().min(1, "Chọn ngày báo giá"),
    validUntil: z.string().min(1, "Chọn ngày hiệu lực"),
    status: z.number().min(0).max(4),
    items: z.array(quotationItemSchema).min(1, "Thêm ít nhất 1 sản phẩm"),
    notes: z.string().optional(),
    paymentTerms: z.string().optional(),
    deliveryTime: z.string().optional(),
});

export type QuotationFormValues = z.infer<typeof quotationSchema>;