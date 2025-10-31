import { useMemo } from "react";
import axiosInstance, { endpoints, fetcher } from "src/lib/axios";
import { IDateValue } from "src/types/common";
import { IContractDao, IContractDetailDto, IContractDto, IContractProductToDelete, IProductContractEdit, IProductFormEdit, IReceiptContractDto, ResContractFile, ResContractItem, ResContractList, ResContractReceipt, ResDetailsWarehouseExportProduct, ResRemainingProduct } from "src/types/contract";
import { IContractWarehouseExportDto, ResContractWarehouseExport } from "src/types/warehouseExport";
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
        console.log(updatePayload);
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

export async function editProductContract(bodyPayload: IProductContractEdit[]) {
    try {
        const { data } = await axiosInstance.patch(endpoints.contract.update.editProducts, bodyPayload);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function editProductForm(id?: number, bodyPayload?: IProductFormEdit) {
    try {
        if (!id) return;
        const { data } = await axiosInstance.patch(endpoints.contract.update.editProductForm(id), bodyPayload);
        return data;
    } catch (error) {
        console.error(error);
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

type contractUploadProp = {
    File: File;
    contractNo: string;
    ContractType: string;
    FileType: string;
}

export async function uploadAttachmentContract({ File, contractNo, ContractType, FileType }: contractUploadProp) {
    try {
        const formData = new FormData();
        formData.append("File", File);
        formData.append("contractNo", contractNo);
        formData.append("ContractType", ContractType);
        formData.append("FileType", FileType);

        const { data } = await axiosInstance.post(endpoints.contractAttachment.upload, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

type contractAttachProp = {
    contractNo: string,
    pageNumber: number,
    pageSize: number,
    filter?: number
}

export function useGetAttachmentContract({
    contractNo,
    pageNumber,
    pageSize,
    filter,
    enabled = true,
}: contractAttachProp & { enabled?: boolean }) {
    let params = '';

    if (contractNo) params = `?contractNo=${contractNo}`;
    if (pageNumber || pageSize) params += `${params ? '&' : '?'}pageNumber=${pageNumber}&pageSize=${pageSize}`;
    if (filter) params += `&filter=${filter}`;

    const url = enabled ? endpoints.contractAttachment.list(params) : null;

    const { data, isLoading, error, isValidating } = useSWR<ResContractFile>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(() => {
        const filteredItems = data?.data.items ?? [];
        return {
            contractFile: filteredItems,
            pagination: {
                pageNumber: data?.data.pageNumber ?? 1,
                pageSize: data?.data.pageSize ?? pageSize,
                totalPages: data?.data.totalPages ?? 0,
                totalRecord: data?.data.totalRecord ?? 0,
            },
            contractFileLoading: isLoading,
            contractFileError: error,
            contractFileValidating: isValidating,
            contractFileEmpty: !isLoading && !isValidating && filteredItems.length === 0,
        };
    }, [data, error, isLoading, isValidating]);

    return memoizedValue;
}

export function deleteAttachmentContract(FileID: number) {
    try {
        const formData = new FormData();
        formData.append("FileID", String(FileID));
        return axiosInstance.delete(endpoints.contractAttachment.delete, {
            data: formData,
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function downloadAttachmentContract(fileId: number) {
    return axiosInstance.get(endpoints.contractAttachment.download(fileId), {
        responseType: 'blob',
    });
}

type contractReceiptProp = {
    ContractNo?: string,
    pageNumber: number,
    pageSize: number,
    enabled?: boolean,
    key?: string,
}

export function useGetReceiptContract({ ContractNo, pageNumber, pageSize, enabled, key }: contractReceiptProp) {
    let params = '';

    if (pageNumber || pageSize) params = `?PageNumber=${pageNumber}&PageSize=${pageSize}`;
    if (key) params += `&search=${key}`;
    if (ContractNo) params += `&ContractNo=${ContractNo}`;

    const url = enabled ? endpoints.contractReceipt.list(params) : null;

    const { data, isLoading, error, isValidating } = useSWR<ResContractReceipt>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => {
            const filteredItems = data?.data.items ?? [];
            const contractReceiptItem = filteredItems.flatMap((i) =>
                i.receipts.map((receipt) => ({
                    ...receipt,
                    id: receipt.receiptId,
                }))
            );
            return {
                contractReceipt: filteredItems,
                contractReceiptItem,
                pagination: {
                    pageNumber: data?.data.pageNumber ?? 1,
                    pageSize: data?.data.pageSize ?? pageSize,
                    totalPages: data?.data.totalPages ?? 0,
                    totalRecord: data?.data.totalRecord ?? 0,
                },
                contractReceiptLoading: isLoading,
                contractReceiptError: error,
                contractReceiptValidating: isValidating,
                contractReceiptEmpty: !isLoading && !isValidating && filteredItems.length === 0,
            }
        },
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export async function createReceiptContract(dto: IReceiptContractDto) {
    try {
        const { data } = await axiosInstance.post(endpoints.contractReceipt.create, dto);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function updateReceiptContract(dto: IReceiptContractDto, id: number) {
    try {
        const { data } = await axiosInstance.patch(endpoints.contractReceipt.update(id), dto);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

type contractWarehouseExportsProp = {
    pageNumber: number,
    pageSize: number,
    enabled?: boolean,
    key?: string,
}

export function useGetWarehouseExports({ pageNumber, pageSize, enabled, key }: contractWarehouseExportsProp) {
    let params = '';

    if (pageNumber || pageSize) params = `?PageNumber=${pageNumber}&PageSize=${pageSize}`;
    if (key) params += `&search=${key}`;

    const url = enabled ? endpoints.contractWarehouse.list(params) : null;

    const { data, isLoading, error, isValidating } = useSWR<ResContractWarehouseExport>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => {
            const filteredItems = data?.data.items ?? [];
            return {
                contractWarehouseExports: filteredItems,
                pagination: {
                    pageNumber: data?.data.pageNumber ?? 1,
                    pageSize: data?.data.pageSize ?? pageSize,
                    totalPages: data?.data.totalPages ?? 0,
                    totalRecord: data?.data.totalRecord ?? 0,
                },
                contractWarehouseExportsLoading: isLoading,
                contractWarehouseExportsError: error,
                contractWarehouseExportsValidating: isValidating,
                contractWarehouseExportsEmpty: !isLoading && !isValidating && filteredItems.length === 0,
            }
        },
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export function useGetUnExportProduct(contractId: number, enabled: boolean) {
    const url = (enabled && contractId) ? endpoints.contractWarehouse.remaining(contractId) : null;

    const { data, isLoading, error, isValidating } = useSWR<ResRemainingProduct>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => {
            const filteredItems = data?.data.items ?? [];
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

export function useGetDetailWarehouseExportProduct(ExportID: number, enabled: boolean) {
    const url = (enabled && ExportID) ? endpoints.contractWarehouse.details(ExportID) : null;

    const { data, isLoading, error, isValidating } = useSWR<ResDetailsWarehouseExportProduct>(url, fetcher, swrOptions);

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

export async function createWarehouseExport(dto: IContractWarehouseExportDto) {
    try {
        const { data } = await axiosInstance.post(endpoints.contractWarehouse.create, dto);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function updateWarehouseExport(id: string, dto: IContractWarehouseExportDto) {
    try {
        const { data } = await axiosInstance.patch(endpoints.contractWarehouse.update(id), dto);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
