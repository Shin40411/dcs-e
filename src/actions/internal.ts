import { useMemo } from "react";
import axiosInstance, { endpoints, fetcher } from "src/lib/axios";
import { IDateValue } from "src/types/common";
import { IPayerInternal, IReceiverInternal, ReceiptAndSpendCreateDto, ReceiptAndSpendData, ReceiptAndSpendUpdateDto, ResponseInternalList, TransferCreateDto, TransferData } from "src/types/internal";
import useSWR, { SWRConfiguration } from "swr";

const swrOptions: SWRConfiguration = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};

type ReceiptProp = {
    pageNumber: number;
    pageSize: number;
    enabled?: boolean;
    key?: string;
    isReceive: boolean;
    Month?: number;
    FromDate?: IDateValue;
    ToDate?: IDateValue;
    Filter?: string;
}

type TransferProp = {
    pageNumber: number;
    pageSize: number;
    enabled?: boolean;
    key?: string;
}

type PayerAndReceiverProps = {
    pageNumber: number;
    pageSize: number;
    getPayer: boolean;
    enabled?: boolean;
}

export function useGetPayerOrReceiver<T>({
    pageNumber,
    pageSize,
    getPayer,
    enabled,
}: PayerAndReceiverProps) {
    const params =
        pageNumber || pageSize
            ? `?PageNumber=${pageNumber}&PageSize=${pageSize}`
            : '';

    const apiRoute = getPayer
        ? endpoints.internal.payers(params)
        : endpoints.internal.receivers(params);

    const url = enabled ? apiRoute : null;

    const { data, isLoading, error, isValidating, mutate } =
        useSWR<ResponseInternalList<T>>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(() => {
        return {
            result: data?.data?.items ?? [],
            pagination: {
                pageNumber: data?.data?.pageNumber ?? 1,
                pageSize: data?.data?.pageSize ?? pageSize,
                totalPages: data?.data?.totalPages ?? 0,
                totalRecord: data?.data?.totalRecord ?? 0,
            },
            isLoading,
            isValidating,
            error,
            mutation: mutate,
        };
    }, [data, isLoading, isValidating, error, mutate, pageSize]);

    return memoizedValue;
}

export function useGetInternalReceiptAndSpend({
    pageNumber,
    pageSize,
    isReceive,
    enabled,
    key,
    FromDate,
    Month,
    ToDate,
    Filter
}: ReceiptProp) {
    let params = '';

    if (pageNumber || pageSize) params = `?PageNumber=${pageNumber}&PageSize=${pageSize}`;
    params += `&isReceive=${isReceive}`;
    if (key) params += `&search=${key}`;
    if (FromDate || ToDate) params += `&FromDate=${FromDate}&ToDate=${ToDate}`;
    if (Month) params += `&Month=${Month}`;
    if (Filter) params += `&Filter=${Filter}`;

    const url = enabled ? endpoints.internal.root(params) : null;

    const { data, isLoading, error, isValidating, mutate } = useSWR<ResponseInternalList<ReceiptAndSpendData>>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(() => {
        const filteredItems = data?.data?.items ?? [];

        const contractReceiptItem = filteredItems.map((i) => ({
            ...i,
            id: i?.receiptId,
        }));

        return {
            receiptOrSpendDt: contractReceiptItem,
            pagination: {
                pageNumber: data?.data?.pageNumber ?? 1,
                pageSize: data?.data?.pageSize ?? pageSize,
                totalPages: data?.data?.totalPages ?? 0,
                totalRecord: data?.data?.totalRecord ?? 0,
            },
            receiptOrSpendDtLoading: isLoading,
            receiptOrSpendDtError: error,
            receiptOrSpendDtValidating: isValidating,
            receiptOrSpendDtEmpty:
                !isLoading && !isValidating && !(filteredItems?.length ?? 0),
            mutation: mutate
        };
    }, [data, error, isLoading, isValidating]);

    return memoizedValue;
}

export function useGetInternalTransfer({ pageNumber, pageSize, enabled, key }: TransferProp) {
    let params = '';

    if (pageNumber || pageSize) params = `?PageNumber=${pageNumber}&PageSize=${pageSize}`;
    if (key) params += `&search=${key}`;

    const url = enabled ? endpoints.internal.transfer(params) : null;

    const { data, isLoading, error, isValidating, mutate } = useSWR<ResponseInternalList<TransferData>>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => {
            const filteredItems = data?.data?.items ?? [];
            return {
                transferData: filteredItems,
                pagination: {
                    pageNumber: data?.data?.pageNumber ?? 1,
                    pageSize: data?.data?.pageSize ?? pageSize,
                    totalPages: data?.data?.totalPages ?? 0,
                    totalRecord: data?.data?.totalRecord ?? 0,
                },
                transferDataLoading: isLoading,
                transferDataError: error,
                transferDataValidating: isValidating,
                transferDataEmpty: !isLoading && !isValidating && filteredItems.length === 0,
                mutation: mutate
            }
        },
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export async function createOrUpdateReceipt(
    createBody: ReceiptAndSpendCreateDto,
    updateBody: ReceiptAndSpendUpdateDto,
    id?: number
) {
    try {
        if (id) {
            const { data } = await axiosInstance.patch(endpoints.internal.update(id), updateBody);
            return data;
        } else {
            const { data } = await axiosInstance.post(endpoints.internal.create, createBody);
            return data;
        }
    } catch (error) {
        throw error;
    }
}

export async function internalTransfer(
    createBody: TransferCreateDto
) {
    try {
        const { data } = await axiosInstance.post(endpoints.internal.createTransfer, createBody);
        return data;
    } catch (error) {
        throw error;
    }
}