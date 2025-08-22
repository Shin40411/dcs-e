import type { SWRConfiguration } from 'swr';
import type { IProductItem, ProductDto, ProductItem, ResProductItem, ResProductList } from 'src/types/product';

import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const swrOptions: SWRConfiguration = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------
type productsProps = {
  pageNumber: number,
  pageSize: number,
}

export function useGetProducts({ pageNumber, pageSize }: productsProps) {
  let params = '';

  if (pageNumber || pageSize)
    params = `?pageNumber=${pageNumber}&pageSize=${pageSize}`;

  const url = endpoints.product.list(params);

  const { data, isLoading, error, isValidating } = useSWR<ResProductList>(
    url,
    fetcher,
    swrOptions
  );

  const memoizedValue = useMemo(
    () => ({
      products: data?.data.items || [],
      pagination: {
        pageNumber: data?.data.pageNumber ?? 1,
        pageSize: data?.data.pageSize ?? pageSize,
        totalPages: data?.data.totalPages ?? 0,
        totalRecord: data?.data.totalRecord ?? 0,
      },
      productsLoading: isLoading,
      productsError: error,
      productsValidating: isValidating,
      productsEmpty: !isLoading && !isValidating && !data?.data.items.length,
    }),
    [data, error, isLoading, isValidating, pageNumber, pageSize]
  );

  return memoizedValue;
}


// ----------------------------------------------------------------------

export function useGetProduct(productId?: string, options?: { enabled?: boolean }) {
  const enabled = options?.enabled ?? true;
  const url = enabled && productId ? endpoints.product.details(productId) : null;

  const { data, isLoading, error, isValidating } = useSWR<ResProductItem>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      product: data?.data,
      productLoading: isLoading,
      productError: error,
      productValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

type SearchResultsData = {
  results: IProductItem[];
};

export function useSearchProducts(query: string) {
  const url = query ? [endpoints.product.search, { params: { query } }] : '';

  const { data, isLoading, error, isValidating } = useSWR<SearchResultsData>(url, fetcher, {
    ...swrOptions,
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: data?.results || [],
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !isValidating && !data?.results.length,
    }),
    [data?.results, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function createOrUpdateProduct(id: string | null, bodyPayload: ProductDto) {
  if (id) {
    return axiosInstance.patch(endpoints.product.update(id), bodyPayload);
  } else {
    return axiosInstance.post(endpoints.product.create, bodyPayload);
  }
}