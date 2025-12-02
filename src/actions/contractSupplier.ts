import { useMemo } from "react";
import axiosInstance, { endpoints, fetcher } from "src/lib/axios";
import { IDateValue } from "src/types/common";
import { IContractSupDetailDto, IContractSupplyDto, IContractSupplyForDetail, IContractSupplyItem, IContractSupplyProductDto, IContractSupplyUpdateDto, IContractSupProductToDelete, IProductContractSupEdit, IProductFromSup, ResponseContractSupplier, ResRemainingProduct } from "src/types/contractSupplier";
import { IContractWarehouseImportDto, ResContractWarehouseImport, ResDetailsWarehouseImportProduct } from "src/types/warehouse-import";
import useSWR, { SWRConfiguration } from "swr";

type contracProps = {
    pageNumber: number,
    pageSize: number,
    key?: string,
    enabled?: boolean,
    fromDate?: IDateValue,
    toDate?: IDateValue,
    Filter?: string;
    Month?: number;
    Status?: string;
}

const swrOptions: SWRConfiguration = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};

export function useGetSupplierContracts({
    pageNumber,
    pageSize,
    key,
    enabled = true,
    fromDate,
    toDate,
    Filter,
    Month,
    Status
}: contracProps) {
    let params = '';

    if (pageNumber || pageSize) params = `?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    if (fromDate || toDate) params += `&fromDate=${fromDate}&toDate=${toDate}`;

    if (key) params += `&search=${key}`;

    if (Status) params += `&Status=${Status}`;

    if (Month) params += `&Month=${Month}`;

    if (Filter) params += `&Filter=${Filter}`;

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

type contractWarehouseImportsProp = {
    pageNumber: number,
    pageSize: number,
    enabled?: boolean,
    key?: string,
    ContractNo?: string;
    Month?: number;
    FromDate?: IDateValue;
    ToDate?: IDateValue;
}

export function useGetWarehouseImports({
    pageNumber,
    pageSize,
    enabled,
    key,
    ContractNo,
    FromDate,
    ToDate,
    Month
}: contractWarehouseImportsProp) {
    let params = '';

    if (pageNumber || pageSize) params = `?PageNumber=${pageNumber}&PageSize=${pageSize}`;
    if (key) params += `&search=${key}`;
    if (ContractNo) params += `&ContractNo=${ContractNo}`;
    if (FromDate || ToDate) params += `&fromDate=${FromDate}&toDate=${ToDate}`;
    if (Month) params += `&Month=${Month}`;

    const url = enabled ? endpoints.contractWarehouseImport.list(params) : null;

    const { data, isLoading, error, isValidating, mutate } = useSWR<ResContractWarehouseImport>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => {
            const filteredItems = data?.data.items ?? [];
            return {
                contractWarehouseImports: filteredItems,
                pagination: {
                    pageNumber: data?.data.pageNumber ?? 1,
                    pageSize: data?.data.pageSize ?? pageSize,
                    totalPages: data?.data.totalPages ?? 0,
                    totalRecord: data?.data.totalRecord ?? 0,
                },
                contractWarehouseImportsLoading: isLoading,
                contractWarehouseImportsError: error,
                contractWarehouseImportsValidating: isValidating,
                contractWarehouseImportsEmpty: !isLoading && !isValidating && filteredItems.length === 0,
                mutation: mutate
            }
        },
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export function useGetUnImportProduct(contractId: number, enabled: boolean) {
    const url = (enabled && contractId) ? endpoints.contractWarehouseImport.remaining(contractId) : null;

    const { data, isLoading, error, isValidating } = useSWR<ResRemainingProduct>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => {
            const filteredItems = data?.data ?? [];
            return {
                remainingProduct: filteredItems,
                remainingProductLoading: isLoading,
                remainingProductError: error,
                remainingProductValidating: isValidating,
                remainingProductEmpty: !isLoading && !isValidating && filteredItems.length === 0,
            }
        },
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export async function createWarehouseImport(dto: IContractWarehouseImportDto) {
    try {
        const { data } = await axiosInstance.post(endpoints.contractWarehouseImport.create, dto);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function updateWarehouseImport(id: string, dto: IContractWarehouseImportDto) {
    try {
        const { data } = await axiosInstance.patch(endpoints.contractWarehouseImport.update(id), dto);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export function useGetDetailWarehouseImportProduct(ImportId: number, enabled: boolean) {
    const url = (enabled && ImportId) ? endpoints.contractWarehouseImport.details(ImportId) : null;

    const { data, isLoading, error, isValidating } = useSWR<ResDetailsWarehouseImportProduct>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => {
            const filteredItems = data?.data.items ?? [];
            return {
                detailsProduct: filteredItems,
                detailsProductLoading: isLoading,
                detailsProductError: error,
                detailsProductValidating: isValidating,
                detailsProductEmpty: !isLoading && !isValidating && filteredItems.length === 0,
            }
        },
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}
