export type IContract = {
    id: string;
    customer: string;
    signedDate: string;
    expireDate: string;
    status: string;
    total: string;
}

export type IContractItem = {
    id: string;
    name: string;
    unit?: string;
    qty: number;
    price: number;
    discount?: number;
    amount: number;
};