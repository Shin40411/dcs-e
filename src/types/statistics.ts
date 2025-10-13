export type IchartResponse = {
    statusCode: number;
    message: string;
    data: IchartsData[];
}

export type IchartsData = {
    year: number;
    total: number;
    months: IchartMonth[]
}

export type IchartMonth = {
    total: number,
    month: number
}