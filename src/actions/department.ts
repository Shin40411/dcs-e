import { useMemo } from "react";
import { endpoints, fetcher } from "src/lib/axios";
import { ResDepartmentList } from "src/types/department";
import useSWR, { SWRConfiguration } from "swr";

type departmentProps = {
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

export function useGetDepartments({ pageNumber, pageSize, key, enabled = true }: departmentProps) {
    let params = '';

    if (pageNumber || pageSize) params = `?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    if (key) params += `&search=${key}`;

    const url = enabled ? endpoints.department.list(params) : null;

    const { data, isLoading, error, isValidating } = useSWR<ResDepartmentList>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => ({
            departments: data?.data.items || [],
            pagination: {
                pageNumber: data?.data.pageNumber ?? 1,
                pageSize: data?.data.pageSize ?? pageSize,
                totalPages: data?.data.totalPages ?? 0,
                totalRecord: data?.data.totalRecord ?? 0,
            },
            departmentsLoading: isLoading,
            departmentsError: error,
            departmentsValidating: isValidating,
            departmentsEmpty: !isLoading && !isValidating && !data?.data.items.length,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}