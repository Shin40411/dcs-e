import { IDateValue } from "./common";

export type IQuotation = {
    id: string;
    customer: string;
    date: IDateValue;
    status: boolean;
    total: number;
    staff: string;
    item: IQuotationItem[];
}

export type IQuotationItem = {
    name: string,
    qty: number,
    price: number
}