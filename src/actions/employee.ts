import { useMemo } from "react";
import { endpoints, fetcher } from "src/lib/axios";
import { ResEmployeesList } from "src/types/employee";
import useSWR, { SWRConfiguration } from "swr";

type employeeProps = {
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

export function useGetEmployees({ pageNumber, pageSize, key, enabled = true }: employeeProps) {
    let params = '';

    if (pageNumber || pageSize) params = `?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    if (key) params += `&search=${key}`;

    const url = enabled ? endpoints.employees.list(params) : null;

    const { data, isLoading, error, isValidating } = useSWR<ResEmployeesList>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => ({
            employees: data?.data.items || [],
            pagination: {
                pageNumber: data?.data.pageNumber ?? 1,
                pageSize: data?.data.pageSize ?? pageSize,
                totalPages: data?.data.totalPages ?? 0,
                totalRecord: data?.data.totalRecord ?? 0,
            },
            employeesLoading: isLoading,
            employeesError: error,
            employeesValidating: isValidating,
            employeesEmpty: !isLoading && !isValidating && !data?.data.items.length,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}