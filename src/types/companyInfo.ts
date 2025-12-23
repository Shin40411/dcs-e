export type ResponseCompanyInfo<T = any> = {
    statusCode: number;
    message: string;
    data: T;
}

export type ICompanyInfoItem = {
    id: number;
    logo: string;
    name: string;
    taxCode: string;
    email: string;
    address: string;
    link: string;
    logoBase64: string;
}

export type ICompanyInfoDTO = {
    logo: string;
    name: string;
    taxCode: string;
    email: string;
    address: string;
    link: string;
}