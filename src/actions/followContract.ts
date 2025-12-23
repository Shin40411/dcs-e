import { useEffect, useMemo } from "react";
import axiosInstance, { endpoints, fetcher } from "src/lib/axios";
import { IReceiptContract } from "src/types/contract";
import { IBatchCollectItem, IFollowContractItem, IFollowNeedSpendItem, IHistoryCollect, IHistorySpend, INeedSpendBySupContract, ResponseFollowData, ResponseFollowList } from "src/types/followContract";
import useSWR, { SWRConfiguration } from "swr";

const swrOptions: SWRConfiguration = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};

export function useGetNeedCollect(contractNo: string, enabled: boolean) {
    let params = `?contractNo=${contractNo}`;

    const url = enabled && contractNo ? endpoints.followContract.needCollect(params) : null;

    const { data, isLoading, error, isValidating, mutate } = useSWR<ResponseFollowList<IFollowContractItem>>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => ({
            result: data?.data,
            resultLoading: isLoading,
            resultError: error,
            resultValidating: isValidating,
            mutation: mutate
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export function useGetBatchCollect(contractNo: string, enabled: boolean) {
    let params = `?contractNo=${contractNo}`;

    const url = enabled && contractNo ? endpoints.followContract.batchCollect(params) : null;

    const { data, isLoading, error, isValidating, mutate } = useSWR<ResponseFollowList<IBatchCollectItem[]>>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => ({
            result: data?.data,
            resultLoading: isLoading,
            resultError: error,
            resultValidating: isValidating,
            mutation: mutate
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export function useGetHistoryCollect(contractNo: string, enabled: boolean) {
    let params = `?contractNo=${contractNo}`;

    const url = enabled && contractNo ? endpoints.followContract.historyCollect(params) : null;

    const { data, isLoading, error, isValidating, mutate } = useSWR<ResponseFollowList<ResponseFollowData<IHistoryCollect>>>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => ({
            result: data?.data?.items,
            resultLoading: isLoading,
            resultError: error,
            resultValidating: isValidating,
            mutation: mutate
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export function useGetNeedSpend(contractNo: string, enabled: boolean) {
    let params = `?contractNo=${contractNo}`;

    const url = enabled && contractNo ? endpoints.followContract.needSpend(params) : null;

    const { data, isLoading, error, isValidating, mutate } = useSWR<ResponseFollowList<IFollowNeedSpendItem>>(url, fetcher, swrOptions);

    useEffect(() => {
        if (enabled) mutate();
    }, [enabled]);

    const memoizedValue = useMemo(
        () => ({
            result: data?.data,
            resultLoading: isLoading,
            resultError: error,
            resultValidating: isValidating,
            mutation: mutate
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export function useGetNeedSpendForContract(contractNo: string, enabled: boolean) {
    let params = `?contractNo=${contractNo}`;

    const url = enabled && contractNo ? endpoints.followContract.needSpendForContract(params) : null;

    const { data, isLoading, error, isValidating, mutate } = useSWR<ResponseFollowList<ResponseFollowData<INeedSpendBySupContract>>>(url, fetcher, swrOptions);

    useEffect(() => {
        if (enabled) mutate();
    }, [enabled]);

    const memoizedValue = useMemo(
        () => ({
            result: data?.data?.items,
            resultLoading: isLoading,
            resultError: error,
            resultValidating: isValidating,
            mutation: mutate
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export function useGetHistorySpend(contractNos: string[], enabled: boolean) {
    const params =
        contractNos && contractNos.length > 0
            ? `?contractNos=${contractNos.join(",")}`
            : "";

    const url =
        enabled && contractNos.length > 0
            ? endpoints.followContract.historySpend(params)
            : null;

    const { data, isLoading, error, isValidating, mutate } = useSWR<ResponseFollowList<IHistorySpend[]>>(url, fetcher, swrOptions);

    useEffect(() => {
        if (enabled) mutate();
    }, [enabled]);

    const memoizedValue = useMemo(
        () => ({
            result: data?.data,
            resultLoading: isLoading,
            resultError: error,
            resultValidating: isValidating,
            mutation: mutate
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export function usefetchReceipt(receiptNo: string) {
    let params = `?receiptNo=${receiptNo}`;

    const url = receiptNo ? endpoints.followContract.getReceipt(params) : '';

    const { data, isLoading, error, isValidating } = useSWR<IReceiptContract>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => ({
            receiptDt: data,
            receiptDtLoading: isLoading,
            receiptDtError: error,
            receiptDtValidating: isValidating,
            receiptDtEmpty: !isLoading && !isValidating && !data,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}