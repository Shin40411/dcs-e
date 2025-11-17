import { useMemo } from "react";
import axiosInstance, { endpoints, fetcher } from "src/lib/axios";
import { IDateValue } from "src/types/common";
import { IContractSupDetailDto, IContractSupplyDto, IContractSupplyForDetail, IContractSupplyItem, IContractSupplyProductDto, IContractSupplyUpdateDto, IContractSupProductToDelete, IProductContractSupEdit, IProductFromSup, ResponseContractSupplier } from "src/types/contractSupplier";
import useSWR, { SWRConfiguration } from "swr";

type contracProps = {
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

export function useGetSupplierContracts({ pageNumber, pageSize, key, enabled = true, fromDate, toDate }: contracProps) {
    let params = '';

    if (pageNumber || pageSize) params = `?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    if (fromDate || toDate) params += `&fromDate=${fromDate}&toDate=${toDate}`;

    if (key) params += `&search=${key}`;

    const url = enabled ? endpoints.contractSupplier.list(params) : null;

    const { data, isLoading, error, isValidating, mutate } = useSWR<ResponseContractSupplier<IContractSupplyItem>>(url, fetcher, swrOptions);

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
                mutation: mutate
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

export function useGetSupplierContract({ contractId, pageNumber, pageSize, options }: contractProp) {
    let params = `?supplierContractId=${contractId}`;

    if (pageNumber || pageSize) params += `&PageNumber=${pageNumber}&PageSize=${pageSize}`;

    const enabled = options?.enabled ?? true;

    const url = enabled && contractId ? endpoints.contractSupplier.detail(params) : null;

    const { data, isLoading, error, isValidating, mutate } = useSWR<ResponseContractSupplier<IContractSupplyForDetail>>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => ({
            contractRes: data,
            contract: data?.data,
            contractLoading: isLoading,
            contractError: error,
            contractValidating: isValidating,
            mutation: mutate
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export async function createSupplierContract(bodyPayload: IContractSupplyDto) {
    try {
        const { data } = await axiosInstance.post(endpoints.contractSupplier.create, bodyPayload);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function updateSupplierContract(id: number, updatePayload: IContractSupplyUpdateDto) {
    try {
        const { data } = await axiosInstance.patch(endpoints.contractSupplier.update.root(id), updatePayload);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function editProductSupplierForm(id?: number, bodyPayload?: IProductFromSup) {
    try {
        if (!id) return;
        const { data } = await axiosInstance.patch(endpoints.contractSupplier.update.editProductForm(id), bodyPayload);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function addMoreSupProducts(id: number, bodyPayload: IContractSupDetailDto[]) {
    try {
        const { data } = await axiosInstance.post(
            endpoints.contractSupplier.update.addProducts(id),
            bodyPayload
        );
        return data;
    } catch (error) {
        console.error("Lỗi api thêm sản phẩm:", error);
        throw error;
    }
}

export async function editProductContractSup(bodyPayload: IProductContractSupEdit[]) {
    try {
        const { data } = await axiosInstance.patch(endpoints.contractSupplier.update.editProducts, bodyPayload);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function deleteSupProductSelected(bodyPayload: IContractSupProductToDelete) {
    try {
        const { data } = await axiosInstance.delete(endpoints.contractSupplier.update.deleteProduct, {
            data: bodyPayload,
        });
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}