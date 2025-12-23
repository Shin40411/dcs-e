import { useMemo } from "react";
import axiosInstance, { fetcher, endpoints } from 'src/lib/axios';
import { ICategoryDto, ICategoryItem, ResCategoryList } from "src/types/category";
import useSWR, { mutate, SWRConfiguration } from "swr";

type categoriesProps = {
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

export function useGetCategories({ pageNumber, pageSize, key, enabled = true }: categoriesProps) {
    let params = '';

    if (pageNumber || pageSize) params = `?pageNumber=${pageNumber}&pageSize=${pageSize}&Status=1`

    if (key) params += `&search=${key}`;

    const url = enabled ? endpoints.category.list(params) : null;

    const { data, isLoading, error, isValidating, mutate } = useSWR<ResCategoryList>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(() => {
        const items = data?.data?.items ?? [];

        return {
            categories: items,
            pagination: {
                pageNumber: data?.data?.pageNumber ?? 1,
                pageSize: data?.data?.pageSize ?? pageSize,
                totalPages: data?.data?.totalPages ?? 0,
                totalRecord: data?.data?.totalRecord ?? 0,
            },
            categoriesLoading: isLoading,
            categoriesError: error,
            categoriesValidating: isValidating,
            categoriesEmpty: !isLoading && !isValidating && items.length === 0,
            mutation: mutate
        };
    }, [data, error, isLoading, isValidating]);

    return memoizedValue;
}

export function useGetDeletedCategories({ pageNumber, pageSize, key, enabled = true }: categoriesProps) {
    let params = '';

    if (pageNumber || pageSize) params = `?pageNumber=${pageNumber}&pageSize=${pageSize}&Status=0`

    const url = enabled ? endpoints.category.list(params) : null;

    const { data, isLoading, error, isValidating, mutate } = useSWR<ResCategoryList>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(() => {
        const items = data?.data?.items ?? [];

        return {
            categories: items,
            pagination: {
                pageNumber: data?.data?.pageNumber ?? 1,
                pageSize: data?.data?.pageSize ?? pageSize,
                totalPages: data?.data?.totalPages ?? 0,
                totalRecord: data?.data?.totalRecord ?? 0,
            },
            categoriesLoading: isLoading,
            categoriesError: error,
            categoriesValidating: isValidating,
            categoriesEmpty: !isLoading && !isValidating && items.length === 0,
            mutation: mutate
        };
    }, [data, error, isLoading, isValidating]);

    return memoizedValue;
}

export async function createOrUpdateCategory(id: number, bodyPayload: ICategoryDto) {
    if (id) {
        const { data } = await axiosInstance.patch(endpoints.category.createOrUpdate(`/${id}`), bodyPayload);
        return data;
    } else {
        const { data } = await axiosInstance.post(endpoints.category.createOrUpdate(''), bodyPayload);
        return data;
    }
}