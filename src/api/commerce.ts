import { apiClient } from '@/shared/api/apiClient';
import type { ProductListQuery, ProductListResponse } from '@/types/commerce';

import { toSearchQueryParams } from '@/utils/toSearchQueryParams';

/**
 * ProductListQuery(사용자 URL 상태)를 쿼리스트링으로 변환해 요청한다.
 * scenario는 검증 전용 제어값이라 여기 포함하지 않는다.
 */
export const fetchProducts = (query: ProductListQuery) =>
  apiClient.get<ProductListResponse>(`/products${toSearchQueryParams(query)}`);
