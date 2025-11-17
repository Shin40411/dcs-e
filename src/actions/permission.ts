import { useMemo } from "react";
import { PERMISSION_DEPART } from "src/auth/context/jwt";
import axiosInstance, { endpoints, fetcher } from "src/lib/axios";
import { IDepartmentPermission, IPermissionByUser, IPermissionItem, ResPermission, ResPermissionByUser } from "src/types/permission";
import useSWR, { SWRConfiguration } from "swr";

const swrOptions: SWRConfiguration = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};

type permissionProps = {
    pageNumber: number,
    pageSize: number,
}

export function useGetPermission({ pageNumber, pageSize }: permissionProps) {
    const params = `?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    const url = endpoints.permission.root(params);
    const { data, isLoading, error, isValidating, mutate } = useSWR<ResPermission<IPermissionItem>>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => ({
            permissions: data?.data?.items || [],
            pagination: {
                pageNumber: data?.data?.pageNumber ?? 1,
                pageSize: data?.data?.pageSize ?? pageSize,
                totalPages: data?.data?.totalPages ?? 0,
                totalRecord: data?.data?.totalRecord ?? 0,
            },
            permissionsLoading: isLoading,
            permissionsError: error,
            permissionsValidating: isValidating,
            permissionsEmpty: !isLoading && !isValidating && !data?.data?.items.length,
            mutation: mutate
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export function useGetDepartmentPermission({ pageNumber, pageSize }: permissionProps) {
    const params = `?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    const url = endpoints.permission.deparment(params);
    const { data, isLoading, error, isValidating, mutate } = useSWR<ResPermission<IDepartmentPermission>>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => ({
            departmentPermission: data?.data?.items || [],
            pagination: {
                pageNumber: data?.data?.pageNumber ?? 1,
                pageSize: data?.data?.pageSize ?? pageSize,
                totalPages: data?.data?.totalPages ?? 0,
                totalRecord: data?.data?.totalRecord ?? 0,
            },
            departmentPermissionLoading: isLoading,
            departmentPermissionError: error,
            departmentPermissionValidating: isValidating,
            departmentPermissionEmpty: !isLoading && !isValidating && !data?.data?.items.length,
            mutation: mutate
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export async function updateDepartmentPermission([{ departmentId, permissionId }]: { departmentId: number; permissionId: number }[]) {
    try {
        const arrPayload = [{ departmentId, permissionId }];
        if (!arrPayload) return;
        const { data } = await axiosInstance.post(endpoints.permission.update, arrPayload);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getPermissionByUser() {
    try {
        const { data } = await axiosInstance.get(endpoints.permission.byUser);
        const result: ResPermissionByUser = data;
        if (!result.data) {
            return;
        }
        sessionStorage.setItem(PERMISSION_DEPART, JSON.stringify(result.data));
    } catch (error) {
        console.error(error);
        throw error;
    }
}