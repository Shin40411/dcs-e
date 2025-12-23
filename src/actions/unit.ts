import { useMemo } from "react";
import axiosInstance, { endpoints, fetcher } from "src/lib/axios";
import { ResUnitList } from "src/types/unit";
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

export function useGetUnits({ pageNumber, pageSize, key, enabled = true }: unitsProps) {
    let params = '';

    if (pageNumber || pageSize) params = `?pageNumber=${pageNumber}&pageSize=${pageSize}&Status=1`;

    if (key) params += `&search=${key}`;

    const url = enabled ? endpoints.unit.list(params) : null;

    const { data, isLoading, error, isValidating, mutate } = useSWR<ResUnitList>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => ({
            units: data?.data?.items ?? [],
            pagination: {
                pageNumber: data?.data?.pageNumber ?? 1,
                pageSize: data?.data?.pageSize ?? pageSize,
                totalPages: data?.data?.totalPages ?? 0,
                totalRecord: data?.data?.totalRecord ?? 0,
            },
            unitsLoading: isLoading,
            unitsError: error,
            unitsValidating: isValidating,
            unitsEmpty:
                !isLoading &&
                !isValidating &&
                !(data?.data?.items?.length ?? 0),
            mutation: mutate
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export function useGetDeletedUnits({ pageNumber, pageSize, key, enabled = true }: unitsProps) {
    let params = '';

    if (pageNumber || pageSize) params = `?pageNumber=${pageNumber}&pageSize=${pageSize}&Status=0`;

    const url = enabled ? endpoints.unit.list(params) : null;

    const { data, isLoading, error, isValidating, mutate } = useSWR<ResUnitList>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => ({
            units: data?.data?.items ?? [],
            pagination: {
                pageNumber: data?.data?.pageNumber ?? 1,
                pageSize: data?.data?.pageSize ?? pageSize,
                totalPages: data?.data?.totalPages ?? 0,
                totalRecord: data?.data?.totalRecord ?? 0,
            },
            unitsLoading: isLoading,
            unitsError: error,
            unitsValidating: isValidating,
            unitsEmpty:
                !isLoading &&
                !isValidating &&
                !(data?.data?.items?.length ?? 0),
            mutation: mutate
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export async function createOrUpdateUnit(id: number, bodyPayload: { name: string }) {
    if (id) {
        const { data } = await axiosInstance.patch(endpoints.unit.update(`/${id}`), bodyPayload);
        return data;
    } else {
        const { data } = await axiosInstance.post(endpoints.unit.create, bodyPayload);
        return data;
    }
}