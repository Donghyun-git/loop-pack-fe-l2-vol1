import type { ProductListQuery } from '@/features/product-filter';

/**
 * ProductListQuery(사용자 URL 상태)를 상품 목록 API 쿼리스트링으로 변환한다.
 *
 * shared/lib 에 두지 않는다. 이름은 범용 유틸처럼 보이지만 시그니처가
 * ProductListQuery 에 묶여 있어 shared 가 상위 레이어 타입을 알아야 한다.
 *
 * product-filter 에도 두지 않는다. 백엔드가 파라미터 이름을 q -> keyword 로 바꾸면
 * 이 파일만 바뀌고 필터 폼은 그대로다. 즉 "이 API 를 어떻게 호출하는가"의 세부사항이라
 * 요청을 만드는 쪽에 둔다.
 */
export const toSearchQueryParams = (query: ProductListQuery): string => {
  const params = new URLSearchParams();

  if (query.q) params.set('q', query.q);
  if (query.category) params.set('category', query.category);
  if (query.sort) params.set('sort', query.sort);
  if (query.page) params.set('page', String(query.page));
  if (query.pageSize) params.set('pageSize', String(query.pageSize));

  const queryString = params.toString();

  return queryString ? `?${queryString}` : '';
};
