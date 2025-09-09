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

    const { data, isLoading, error, isValidating } = useSWR<ResCategoryList>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => ({
            categories: data?.data.items || [],
            pagination: {
                pageNumber: data?.data.pageNumber ?? 1,
                pageSize: data?.data.pageSize ?? pageSize,
                totalPages: data?.data.totalPages ?? 0,
                totalRecord: data?.data.totalRecord ?? 0,
            },
            categoriesLoading: isLoading,
            categoriesError: error,
            categoriesValidating: isValidating,
            categoriesEmpty: !isLoading && !isValidating && !data?.data.items.length,
        }),
        [data, error, isLoading, isValidating]
    );

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