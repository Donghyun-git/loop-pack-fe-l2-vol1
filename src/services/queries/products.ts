import type { ProductListQuery } from '@/types/commerce';
import { queryOptions } from '@tanstack/react-query';

import { fetchProducts } from '@/api/commerce';

/**
 * 상품 목록 쿼리 팩토리.
 *
 * queryKey에 query 객체를 그대로 넣어 URL 조건 ↔ query key ↔ API 요청을 일치시킨다.
 * (nuqs URL 상태가 원본이고, 이 key는 그 파생값이다. 별도 상태로 복사하지 않는다.)
 *
 * staleTime: 검색/정렬 결과는 조건별로 자주 달라지므로 30초로 짧게 둔다.
 * placeholderData(keepPreviousData)는 useSuspenseQuery와 함께 쓸 수 없으므로 두지 않는다.
 * 조건 변경 중 이전 목록 유지는 소비 측 useTransition(useProductListQuery)이 담당한다.
 */
export const productListQueryOptions = {
  list: (query: ProductListQuery) =>
    queryOptions({
      queryKey: ['products', query] as const,
      queryFn: () => fetchProducts(query),
      staleTime: 30 * 1000,
    }),
};
