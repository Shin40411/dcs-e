import { useMemo } from "react";
import { endpoints, fetcher } from "src/lib/axios";
import { IDateValue } from "src/types/common";
import { ResQuotationItem, ResQuotationList } from "src/types/quotation";
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

    if (pageNumber || pageSize) params = `?pageNumber=${pageNumber}&pageSize=${pageSize}&Status=1`;

    if (fromDate || toDate) params += `&fromDate=${fromDate}&toDate=${toDate}`;

    if (key) params += `&search=${key}`;

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
