import { useMemo } from "react";
import axiosInstance, { endpoints, fetcher } from "src/lib/axios";
import { ICustomerDto, ResCustomerList } from "src/types/customer";
import useSWR, { SWRConfiguration } from "swr";

type customerProps = {
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

export function useGetCustomers({ pageNumber, pageSize, key, enabled = true }: customerProps) {
    let params = '';

    if (pageNumber || pageSize) params = `?pageNumber=${pageNumber}&pageSize=${pageSize}&Status=1`;

    if (key) params += `&search=${key}`;

    const url = enabled ? endpoints.customer.list(params) : null;

    const { data, isLoading, error, isValidating } = useSWR<ResCustomerList>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => ({
            customers: data?.data.items || [],
            pagination: {
                pageNumber: data?.data.pageNumber ?? 1,
                pageSize: data?.data.pageSize ?? pageSize,
                totalPages: data?.data.totalPages ?? 0,
                totalRecord: data?.data.totalRecord ?? 0,
            },
            customersLoading: isLoading,
            customersError: error,
            customersValidating: isValidating,
            customersEmpty: !isLoading && !isValidating && !data?.data.items.length,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export async function createOrUpdateCustomer(id: number, bodyPayload: ICustomerDto) {
    if (id) {
        const { data } = await axiosInstance.patch(endpoints.customer.update(`/${id}`), bodyPayload);
        return data;
    } else {
        const { data } = await axiosInstance.post(endpoints.customer.create, bodyPayload);
        return data;
    }
}