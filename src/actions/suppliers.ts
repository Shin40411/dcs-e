import { useMemo } from "react";
import { endpoints, fetcher } from "src/lib/axios";
import { ResSuppliersList } from "src/types/suppliers";
import useSWR, { SWRConfiguration } from "swr";

type suppliersProps = {
    pageNumber: number,
    pageSize: number,
    key?: string,
    enabled?: boolean
}

const swrOptions: SWRConfiguration = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};


export function useGetSuppliers({ pageNumber, pageSize, key, enabled = true }: suppliersProps) {
    let params = '';

    if (pageNumber || pageSize) params = `?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    if (key) params += `&search=${key}`;

    const url = enabled ? endpoints.suppliers.list(params) : null;

    const { data, isLoading, error, isValidating } = useSWR<ResSuppliersList>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => ({
            suppliers: data?.data.items || [],
            pagination: {
                pageNumber: data?.data.pageNumber ?? 1,
                pageSize: data?.data.pageSize ?? pageSize,
                totalPages: data?.data.totalPages ?? 0,
                totalRecord: data?.data.totalRecord ?? 0,
            },
            suppliersLoading: isLoading,
            suppliersError: error,
            suppliersValidating: isValidating,
            suppliersEmpty: !isLoading && !isValidating && !data?.data.items.length,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}