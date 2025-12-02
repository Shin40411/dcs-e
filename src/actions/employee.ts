import { useMemo } from "react";
import axiosInstance, { endpoints, fetcher } from "src/lib/axios";
import { IEmployeeDto, IUserDto, ResEmployeesList, ResUserType } from "src/types/employee";
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

    if (pageNumber || pageSize) params = `?pageNumber=${pageNumber}&pageSize=${pageSize}&Status=1`;

    if (key) params += `&search=${key}`;

    const url = enabled ? endpoints.employees.list(params) : null;

    const { data, isLoading, error, isValidating, mutate } = useSWR<ResEmployeesList>(url, fetcher, swrOptions);

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
            mutation: mutate
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export function useGetDeletedEmployees({ pageNumber, pageSize, key, enabled = true }: employeeProps) {
    let params = '';

    if (pageNumber || pageSize) params = `?pageNumber=${pageNumber}&pageSize=${pageSize}&Status=0`;

    const url = enabled ? endpoints.employees.list(params) : null;

    const { data, isLoading, error, isValidating, mutate } = useSWR<ResEmployeesList>(url, fetcher, swrOptions);

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
            mutation: mutate
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export function useGetUserTypes({ pageNumber, pageSize, enabled = true }: employeeProps) {
    let params = '';

    if (pageNumber || pageSize) params = `?pageNumber=${pageNumber}&pageSize=${pageSize}&Status=0`;

    const url = enabled ? endpoints.employees.getUserType(params) : null;

    const { data, isLoading, error, isValidating } = useSWR<ResUserType>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => ({
            userTypes: data?.data.items || [],
            pagination: {
                pageNumber: data?.data.pageNumber ?? 1,
                pageSize: data?.data.pageSize ?? pageSize,
                totalPages: data?.data.totalPages ?? 0,
                totalRecord: data?.data.totalRecord ?? 0,
            },
            userTypesLoading: isLoading,
            userTypesError: error,
            userTypesValidating: isValidating,
            userTypesEmpty: !isLoading && !isValidating && !data?.data.items.length,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}


export async function createOrUpdateEmployee(bodyPayload: IEmployeeDto, createPayload: IUserDto, id?: number) {
    if (id) {
        const { data } = await axiosInstance.patch(endpoints.employees.update(`/${id}`), bodyPayload);
        return data;
    } else {
        const { data } = await axiosInstance.post(endpoints.employees.createUser, createPayload);
        return data;
    }
}

type passProps = {
    id: string;
    newPassword: string;
}

export async function changePassword({ id, newPassword }: passProps) {
    try {
        const { data } = await axiosInstance.patch(endpoints.auth.changePassword, { employeeId: id, newPassword });
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
export async function lockOrunLockAccount(id: number) {
    try {
        const { data } = await axiosInstance.patch(endpoints.employees.lockUnlock(id));
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}