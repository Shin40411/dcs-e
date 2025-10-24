import { useMemo } from "react";
import { endpoints, fetcher } from "src/lib/axios";
import { IBestSellerRes, IchartResponse, IContractAmountRes, IContractValRes, IFinanceRes, IProductStatisticRes, ITopSalerRes } from "src/types/statistics";
import useSWR, { SWRConfiguration } from "swr";

const swrOptions: SWRConfiguration = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};

export function ContractStatistic(year: number, type: string) {
    let url = '';

    if (type === 'KH') {
        url = endpoints.statistic.chart.customer(year);
    } else {
        url = endpoints.statistic.chart.supplier(year);
    }

    const { data, isLoading, error, isValidating } = useSWR<IchartResponse>(url, fetcher, {
        refreshInterval: 5000,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
    });

    const memoizedValue = useMemo(
        () => {
            const filteredItems = data?.data;

            return {
                result: filteredItems,
                resultLoading: isLoading,
                resultError: error,
                resultValidating: isValidating,
                resultEmpty: !isLoading && !isValidating && filteredItems?.length === 0,
            };
        },
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

// export function TopSalerStatistic() {

// }

// export function TopContractValueStatistic() {

// }
type bestSellerProps = {
    pageNumber: number,
    pageSize: number,
    key: string,
    filter: string
}

type contractValProps = {
    pageNumber: number,
    pageSize: number,
    filter: string
}

export function TopBestSellerStatistic({ pageNumber, pageSize, key, filter }: bestSellerProps) {
    let params = '';

    if (pageNumber || pageSize) params = `?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    if (key) params += `&search=&Filter=${key}`;

    if (filter) params += `&TimeFilter=${filter}`;

    const url = endpoints.statistic.bestSeller(params);

    const { data, isLoading, error, isValidating } = useSWR<IBestSellerRes>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => {
            const filteredItems = data?.data?.items;

            return {
                bestSeller: filteredItems,
                pagination: {
                    pageNumber: data?.data?.pageNumber ?? 1,
                    pageSize: data?.data?.pageSize ?? pageSize,
                    totalPages: data?.data?.totalPages ?? 0,
                    totalRecord: data?.data?.totalRecord ?? 0,
                },
                bestSellerLoading: isLoading,
                bestSellerError: error,
                bestSellerValidating: isValidating,
                bestSellerEmpty: !isLoading && !isValidating && !filteredItems,
            };
        },
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export function TopContractValStatistic({ pageNumber, pageSize, filter }: contractValProps) {
    let params = '';

    if (pageNumber || pageSize) params = `?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    if (filter) params += `&Search&Filter=${filter}`;

    const url = endpoints.statistic.contractValue(params);

    const { data, isLoading, error, isValidating } = useSWR<IContractValRes>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => {
            const filteredItems = data?.data?.items;

            return {
                contractValue: filteredItems,
                pagination: {
                    pageNumber: data?.data?.pageNumber ?? 1,
                    pageSize: data?.data?.pageSize ?? pageSize,
                    totalPages: data?.data?.totalPages ?? 0,
                    totalRecord: data?.data?.totalRecord ?? 0,
                },
                contractValueLoading: isLoading,
                contractValueError: error,
                contractValueValidating: isValidating,
                contractValueEmpty: !isLoading && !isValidating && !filteredItems,
            };
        },
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export function TopSalerStatistic({ pageNumber, pageSize, filter }: contractValProps) {
    let params = '';

    if (pageNumber || pageSize) params = `?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    if (filter) params += `&Search&Filter=${filter}`;

    const url = endpoints.statistic.topSaler(params);

    const { data, isLoading, error, isValidating } = useSWR<ITopSalerRes>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => {
            const filteredItems = data?.data.items;

            return {
                topSaler: filteredItems,
                pagination: {
                    pageNumber: data?.data.pageNumber ?? 1,
                    pageSize: data?.data.pageSize ?? pageSize,
                    totalPages: data?.data.totalPages ?? 0,
                    totalRecord: data?.data.totalRecord ?? 0,
                },
                topSalerLoading: isLoading,
                topSalerError: error,
                topSalerValidating: isValidating,
                topSalerEmpty: !isLoading && !isValidating && !filteredItems,
            };
        },
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export function StatisticForProducts(filter: string) {
    let url = endpoints.statistic.productsInStock(filter);

    const { data, isLoading, error, isValidating } = useSWR<IProductStatisticRes>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => {
            const filteredItems = data?.data;

            return {
                productsResult: filteredItems,
                productsResultLoading: isLoading,
                productsResultError: error,
                productsResultValidating: isValidating,
                productsResultEmpty: !isLoading && !isValidating && !filteredItems,
            };
        },
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export function StatisticForFinance(filter: string) {
    let url = endpoints.statistic.finance(filter);

    const { data, isLoading, error, isValidating } = useSWR<IFinanceRes>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => {
            const filteredItems = data?.data;

            return {
                financeResult: filteredItems,
                financeResultLoading: isLoading,
                financeResultError: error,
                financeResultValidating: isValidating,
                financeResultEmpty: !isLoading && !isValidating && !filteredItems,
            };
        },
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export function StatisticForContract(filter: string) {
    let url = endpoints.statistic.contract(filter);

    const { data, isLoading, error, isValidating } = useSWR<IContractAmountRes>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => {
            const filteredItems = data?.data;

            return {
                contractResult: filteredItems,
                contractResultLoading: isLoading,
                contractResultError: error,
                contractResultValidating: isValidating,
                contractResultEmpty: !isLoading && !isValidating && !filteredItems,
            };
        },
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}