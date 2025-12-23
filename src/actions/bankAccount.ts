import { useMemo } from "react";
import axiosInstance, { endpoints, fetcher } from "src/lib/axios";
import { IBankAccountDto, ResBankAccountList, ResBankQrList } from "src/types/bankAccount";
import { IEmployeeDto } from "src/types/employee";
import useSWR, { SWRConfiguration } from "swr";

type bankAccountProps = {
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

export function useGetBankAccounts({ pageNumber, pageSize, key, enabled = true }: bankAccountProps) {
    let params = '';

    if (pageNumber || pageSize) params = `?pageNumber=${pageNumber}&pageSize=${pageSize}&Status=1`;

    if (key) params += `&search=${key}`;

    const url = enabled ? endpoints.bankAccount.list(params) : null;

    const { data, isLoading, error, isValidating, mutate } = useSWR<ResBankAccountList>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(() => {
        const items = data?.data?.items ?? [];

        return {
            bankAccounts: items,
            pagination: {
                pageNumber: data?.data?.pageNumber ?? 1,
                pageSize: data?.data?.pageSize ?? pageSize,
                totalPages: data?.data?.totalPages ?? 0,
                totalRecord: data?.data?.totalRecord ?? 0,
            },
            bankAccountsLoading: isLoading,
            bankAccountsError: error,
            bankAccountsValidating: isValidating,
            bankAccountsEmpty: !isLoading && !isValidating && items.length === 0,
            mutation: mutate
        };
    }, [data, error, isLoading, isValidating]);

    return memoizedValue;
}

export function useGetDeletedBankAccounts({ pageNumber, pageSize, key, enabled = true }: bankAccountProps) {
    let params = '';

    if (pageNumber || pageSize) params = `?pageNumber=${pageNumber}&pageSize=${pageSize}&Status=0`;

    const url = enabled ? endpoints.bankAccount.list(params) : null;

    const { data, isLoading, error, isValidating, mutate } = useSWR<ResBankAccountList>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(() => {
        const items = data?.data?.items ?? [];

        return {
            bankAccounts: items,
            pagination: {
                pageNumber: data?.data?.pageNumber ?? 1,
                pageSize: data?.data?.pageSize ?? pageSize,
                totalPages: data?.data?.totalPages ?? 0,
                totalRecord: data?.data?.totalRecord ?? 0,
            },
            bankAccountsLoading: isLoading,
            bankAccountsError: error,
            bankAccountsValidating: isValidating,
            bankAccountsEmpty: !isLoading && !isValidating && items.length === 0,
            mutation: mutate
        };
    }, [data, error, isLoading, isValidating]);

    return memoizedValue;
}

export async function createOrUpdateBankAccount(id: number, bodyPayload: IBankAccountDto) {
    if (id) {
        const { data } = await axiosInstance.patch(endpoints.bankAccount.update(`/${id}`), bodyPayload);
        return data;
    } else {
        const { data } = await axiosInstance.post(endpoints.bankAccount.create, bodyPayload);
        return data;
    }
}

export function useGetCallVietQrData({ pageNumber, pageSize, key, enabled }: bankAccountProps) {
    let params = '';

    if (pageNumber || pageSize) params = `?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    if (key) params += `&search=${key}`;

    const url = enabled ? endpoints.bankAccount.callQr(params) : null;

    const { data, isLoading, error, isValidating } = useSWR<ResBankQrList>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(() => {
        const items = data?.data?.items ?? [];

        return {
            vietQrItem: items,
            pagination: {
                pageNumber: data?.data?.pageNumber ?? 1,
                pageSize: data?.data?.pageSize ?? pageSize,
                totalPages: data?.data?.totalPages ?? 0,
                totalRecord: data?.data?.totalRecord ?? 0,
            },
            vietQrItemLoading: isLoading,
            vietQrItemError: error,
            vietQrItemValidating: isValidating,
            vietQrItemEmpty: !isLoading && !isValidating && items.length === 0,
        };
    }, [data, error, isLoading, isValidating]);

    return memoizedValue;
}

export async function updateProfileInfo(
    payload: IEmployeeDto
) {
    try {
        const { data } = await axiosInstance.patch(endpoints.employees.updateMe, payload);
        return data;
    } catch (error) {
        throw error;
    }
}