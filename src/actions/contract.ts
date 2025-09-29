import { useMemo } from "react";
import { endpoints, fetcher } from "src/lib/axios";
import { IDateValue } from "src/types/common";
import { ResContractList } from "src/types/contract";
import useSWR, { SWRConfiguration } from "swr";

type quotationProps = {
    pageNumber: number,
    pageSize: number,
    key?: string,
    enabled?: boolean,
    fromDate: IDateValue,
    toDate: IDateValue,
}

const swrOptions: SWRConfiguration = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};

export function useGetContracts({ pageNumber, pageSize, key, enabled = true, fromDate, toDate }: quotationProps) {
    let params = '';

    if (pageNumber || pageSize) params = `?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    if (fromDate || toDate) params += `&fromDate=${fromDate}&toDate=${toDate}`;

    if (key) params += `&search=${key}`;

    params += `&Status=1`;

    const url = enabled ? endpoints.contract.list(params) : null;

    const { data, isLoading, error, isValidating } = useSWR<ResContractList>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => ({
            contracts: data?.data.items || [],
            pagination: {
                pageNumber: data?.data.pageNumber ?? 1,
                pageSize: data?.data.pageSize ?? pageSize,
                totalPages: data?.data.totalPages ?? 0,
                totalRecord: data?.data.totalRecord ?? 0,
            },
            contractsLoading: isLoading,
            contractsError: error,
            contractsValidating: isValidating,
            contractsEmpty: !isLoading && !isValidating && !data?.data.items.length,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}