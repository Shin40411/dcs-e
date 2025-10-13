import { useMemo } from "react";
import axiosInstance, { endpoints, fetcher } from "src/lib/axios";
import { IDateValue } from "src/types/common";
import { IContractDao, IContractDetailDto, IContractDto, IContractProductToDelete, ResContractItem, ResContractList } from "src/types/contract";
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

    const url = enabled ? endpoints.contract.list(params) : null;

    const { data, isLoading, error, isValidating } = useSWR<ResContractList>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => {
            const filteredItems = data?.data.items?.filter((q) => q.status !== 0) ?? [];
            return {
                contracts: filteredItems,
                pagination: {
                    pageNumber: data?.data.pageNumber ?? 1,
                    pageSize: data?.data.pageSize ?? pageSize,
                    totalPages: data?.data.totalPages ?? 0,
                    totalRecord: data?.data.totalRecord ?? 0,
                },
                contractsLoading: isLoading,
                contractsError: error,
                contractsValidating: isValidating,
                contractsEmpty: !isLoading && !isValidating && filteredItems.length === 0,
            }
        },
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

type contractProp = {
    contractId: number,
    pageNumber: number,
    pageSize: number,
    options?: { enabled?: boolean }
}

export function useGetContract({ contractId, pageNumber, pageSize, options }: contractProp) {
    let params = '';

    if (pageNumber || pageSize) params = `?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    params += `&ContractId=${contractId}`;

    const enabled = options?.enabled ?? true;

    const url = enabled && contractId ? endpoints.contract.detail(params) : null;

    const { data, isLoading, error, isValidating } = useSWR<ResContractItem>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => ({
            contract: data?.data,
            contractLoading: isLoading,
            contractError: error,
            contractValidating: isValidating,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export async function createOrUpdateContract(id: number | null, bodyPayload: IContractDto, updatePayload: IContractDao) {
    if (id) {
        const { data } = await axiosInstance.patch(endpoints.contract.update.root(id), updatePayload);
        return data;
    } else {
        const { data } = await axiosInstance.post(endpoints.contract.create, bodyPayload);
        return data;
    }
}

export async function addMoreProducts(id: number, bodyPayload: IContractDetailDto[]) {
    try {
        const { data } = await axiosInstance.post(
            endpoints.contract.update.addProducts(id),
            bodyPayload
        );
        return data;
    } catch (error) {
        console.error("Lỗi api thêm sản phẩm:", error);
        throw error;
    }
}

export async function deleteProductSelected(bodyPayload: IContractProductToDelete) {
    try {
        const { data } = await axiosInstance.delete(endpoints.contract.update.deleteProduct, {
            data: bodyPayload,
        });
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function sendEmailContract({ contractId, email }: { contractId: number; email: string }) {
    try {

        const { data } = await axiosInstance.post(endpoints.contract.sendMail, { contractId, email });
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}