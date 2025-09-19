import { useMemo } from "react";
import axiosInstance, { endpoints, fetcher } from "src/lib/axios";
import { IDateValue } from "src/types/common";
import { IQuotationDao, IQuotationDetailDto, IQuotationDto, IQuotationProductToDelete, ResQuotationItem, ResQuotationList } from "src/types/quotation";
import useSWR, { SWRConfiguration } from "swr";

type quotationProps = {
    pageNumber: number,
    pageSize: number,
    key?: string,
    enabled?: boolean,
    fromDate: IDateValue,
    toDate: IDateValue,
}

const swrOptions: SWRConfiguration = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};

export function useGetQuotations({ pageNumber, pageSize, key, enabled = true, fromDate, toDate }: quotationProps) {
    let params = '';

    if (pageNumber || pageSize) params = `?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    if (fromDate || toDate) params += `&fromDate=${fromDate}&toDate=${toDate}`;

    if (key) params += `&search=${key}`;

    params += `&Status=1`;

    const url = enabled ? endpoints.quotation.list(params) : null;

    const { data, isLoading, error, isValidating } = useSWR<ResQuotationList>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => ({
            quotations: data?.data.items || [],
            pagination: {
                pageNumber: data?.data.pageNumber ?? 1,
                pageSize: data?.data.pageSize ?? pageSize,
                totalPages: data?.data.totalPages ?? 0,
                totalRecord: data?.data.totalRecord ?? 0,
            },
            quotationsLoading: isLoading,
            quotationsError: error,
            quotationsValidating: isValidating,
            quotationsEmpty: !isLoading && !isValidating && !data?.data.items.length,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

type quotationProp = {
    quotationId: number,
    pageNumber: number,
    pageSize: number,
    options?: { enabled?: boolean }
}

export function useGetQuotation({ quotationId, pageNumber, pageSize, options }: quotationProp) {
    let params = '';

    if (pageNumber || pageSize) params = `?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    const enabled = options?.enabled ?? true;

    const url = enabled && quotationId ? endpoints.quotation.detail(quotationId, params) : null;

    const { data, isLoading, error, isValidating } = useSWR<ResQuotationItem>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => ({
            quotation: data?.data,
            quotationLoading: isLoading,
            quotationError: error,
            quotationValidating: isValidating,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export async function createOrUpdateQuotation(id: number | null, bodyPayload: IQuotationDto, updatePayload: IQuotationDao) {
    if (id) {
        const { data } = await axiosInstance.patch(endpoints.quotation.update.root(id), updatePayload);
        return data;
    } else {
        const { data } = await axiosInstance.post(endpoints.quotation.create, bodyPayload);
        return data;
    }
}

export async function addMoreProducts(id: number, bodyPayload: IQuotationDetailDto[]) {
    try {
        const { data } = await axiosInstance.post(
            endpoints.quotation.update.addProducts(id),
            bodyPayload
        );
        return data;
    } catch (error) {
        console.error("Lỗi api thêm sản phẩm:", error);
        throw error;
    }
}

export async function deleteProductSelected(bodyPayload: IQuotationProductToDelete) {
    try {
        const { data } = await axiosInstance.delete(endpoints.quotation.deleteProduct, {
            data: bodyPayload,
        });
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}