import { IDateValue } from "./common";

export type FilterValues = {
    fromDate: IDateValue;
    toDate: IDateValue;
    status?: string;
    customer?: string;
    contract?: string;
    payer?: string;
    month?: number;
    receiverName?: string;
};
