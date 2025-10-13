import { useMemo } from "react";
import { endpoints, fetcher } from "src/lib/axios";
import { IchartResponse } from "src/types/statistics";
import useSWR, { SWRConfiguration } from "swr";

const swrOptions: SWRConfiguration = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};

// type ContractStatisticProps = {

// }

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

// export function TopBestSellerStatistic() {

// }

// export function StatisticForChart() {

// }