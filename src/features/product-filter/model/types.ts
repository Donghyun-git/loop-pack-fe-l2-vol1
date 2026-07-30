import type { CategoryId, ProductSort } from '@/entities/product';

/**
 * 사용자가 고른 상품 목록 검색 조건.
 *
 * 원본은 URL(nuqs)이고 이 타입은 그 모양을 그대로 옮긴 것이다.
 * 백엔드 쿼리스트링으로의 변환은 이 슬라이스가 아니라 요청하는 쪽(_pages/product-list/api)이 맡는다.
 * 필터의 책임은 이 값을 만드는 데서 끝난다.
 */
export type ProductListQuery = {
  q?: string;
  category?: CategoryId | 'all';
  sort?: ProductSort;
  page?: number;
  pageSize?: number;
};
