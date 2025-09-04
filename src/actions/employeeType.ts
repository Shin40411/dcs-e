import { useMemo } from "react";
import axiosInstance, { endpoints, fetcher } from "src/lib/axios";
import { ResEmployeeTypeList } from "src/types/employeeType";
import useSWR, { SWRConfiguration } from "swr";

type unitsProps = {
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


export function useGetEmployeeTypes({ pageNumber, pageSize, key, enabled = true }: unitsProps) {
    let params = '';

    if (pageNumber || pageSize) params = `?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    if (key) params += `&search=${key}`;

    const url = enabled ? endpoints.employeeType.list(params) : null;

    const { data, isLoading, error, isValidating } = useSWR<ResEmployeeTypeList>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => ({
            employeeTypes: data?.data.items || [],
            pagination: {
                pageNumber: data?.data.pageNumber ?? 1,
                pageSize: data?.data.pageSize ?? pageSize,
                totalPages: data?.data.totalPages ?? 0,
                totalRecord: data?.data.totalRecord ?? 0,
            },
            employeeTypesLoading: isLoading,
            employeeTypesError: error,
            employeeTypesValidating: isValidating,
            employeeTypesEmpty: !isLoading && !isValidating && !data?.data.items.length,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export async function createOrUpdateEmployeeType(id: number, bodyPayload: { name: string }) {
    if (id) {
        const { data } = await axiosInstance.patch(endpoints.employeeType.update(`/${id}`), bodyPayload);
        return data;
    } else {
        const { data } = await axiosInstance.post(endpoints.employeeType.create, bodyPayload);
        return data;
    }
}