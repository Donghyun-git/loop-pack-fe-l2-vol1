import type { Category, Product } from '@/entities/product';

/**
 * 상품 목록 응답 계약.
 *
 * mock 백엔드(app/api/products/route.ts)도 이 타입을 반환 타입으로 쓴다.
 * 계약의 소유자가 프론트인 근거는 _pages/home/model/types.ts 와 같다.
 */
export type ProductListResponse = {
  products: Product[];
  categories: Category[];
  totalCount: number;
  page: number;
  pageSize: number;
};
