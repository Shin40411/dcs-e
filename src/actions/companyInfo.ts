import { useMemo } from "react";
import axiosInstance, { endpoints, fetcher } from "src/lib/axios";
import { ICompanyInfoDTO, ICompanyInfoItem, ResponseCompanyInfo } from "src/types/companyInfo";
import useSWR, { SWRConfiguration } from "swr";
const swrOptions: SWRConfiguration = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};

export function useGetCompanyInfo() {
    const url = endpoints.companyInfo.root;
    const { data, isLoading, error, isValidating, mutate } = useSWR<ResponseCompanyInfo<ICompanyInfoItem>>(url, fetcher, swrOptions);
    const memoizedValue = useMemo(() => {
        const filteredItems = data?.data || null;
        return {
            companyInfoData: filteredItems,
            companyInfoDataLoading: isLoading,
            companyInfoDataError: error,
            companyInfoDataValidating: isValidating,
            companyInfoDataEmpty:
                !isLoading && !isValidating && !filteredItems,
            mutation: mutate
        };
    }, [data, error, isLoading, isValidating]);

    return memoizedValue;
}

export async function createOrUpdateCompanyInfo(
    payload: ICompanyInfoDTO,
    isEdit: boolean
) {
    try {
        if (isEdit) {
            const { data } = await axiosInstance.patch(endpoints.companyInfo.root, payload);
            return data;
        } else {
            const { data } = await axiosInstance.post(endpoints.companyInfo.root, payload);
            return data;
        }
    } catch (error) {
        throw error;
    }
}