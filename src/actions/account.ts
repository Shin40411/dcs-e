import { useMemo } from "react";
import axiosInstance, { endpoints, fetcher } from "src/lib/axios";
import { ResPersonalAccount } from "src/types/employee";
import useSWR, { SWRConfiguration } from "swr";
const swrOptions: SWRConfiguration = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};

export type accountProps = {
    newPassword: string;
    oldPassword: string;
};
export const changeProfilePassword = async ({ newPassword, oldPassword }: accountProps): Promise<void> => {
    try {
        const params = { oldPassword, newPassword }
        const res = await axiosInstance.patch(endpoints.auth.changeProfilePassword, params);
        return res.data;
    } catch (error) {
        console.error('Đã có lỗi nghiêm trọng khi thay đổi mật khẩu:', error);
        throw error;
    }
};

export function useGetProfileInfo() {
    const url = endpoints.employees.me;
    const { data, isLoading, error, isValidating, mutate } = useSWR<ResPersonalAccount>(url, fetcher, swrOptions);
    const memoizedValue = useMemo(() => {
        const filteredItems = data?.data || null;
        return {
            profileInfoData: filteredItems,
            profileInfoDataLoading: isLoading,
            profileInfoDataError: error,
            profileInfoDataValidating: isValidating,
            profileInfoDataEmpty:
                !isLoading && !isValidating && !filteredItems,
            mutation: mutate
        };
    }, [data, error, isLoading, isValidating]);

    return memoizedValue;
}