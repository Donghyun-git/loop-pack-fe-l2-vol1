'use client';

import type { ProductSort } from '@/entities/product';
import { parseAsInteger, parseAsString, parseAsStringLiteral, useQueryStates } from 'nuqs';

import { CATEGORY_FILTER_VALUES, type CategoryFilter, DEFAULT_PAGE_SIZE, PRODUCT_SORT_VALUES } from '../config/filters';
import type { ProductListQuery } from './types';

/**
 * 검색 조건의 원본은 URL 이다(nuqs). 공유, 새로고침, 앞뒤 이동에서 복원되어야 하기 때문.
 * 기본 정렬도 'latest'로 두고, API 요청에 sort=latest 를 명시한다(sort 생략은 4주차 호환용)
 * 필터 값 목록은 같은 슬라이스 config의 SSOT를 사용한다
 * scenario 는 검증 전용 제어값이라 URL 상태, ProductListQuery 에 포함하지 않는다.
 */
const defaultParsers = {
  q: parseAsString.withDefault(''),
  category: parseAsStringLiteral(CATEGORY_FILTER_VALUES).withDefault('all'),
  sort: parseAsStringLiteral(PRODUCT_SORT_VALUES).withDefault('latest'),
  page: parseAsInteger.withDefault(1),
};

export const useProductListQuery = () => {
  const [state, setState] = useQueryStates(defaultParsers, { history: 'push' });

  const setSearch = (q: string) => setState({ q, page: 1 });
  const setCategory = (category: CategoryFilter) => setState({ category, page: 1 });
  const setSort = (sort: ProductSort) => setState({ sort, page: 1 });
  const setPage = (page: number) => setState({ page });

  /**
   * 모든 조건을 기본값으로 되돌린다.
   * null 을 넘기면 nuqs 가 해당 파라미터를 URL 에서 제거하고 파서의 기본값으로 읽는다.
   * 개별 setter 처럼 기본값을 여기 하드코딩하면 defaultParsers 와 두 벌이 된다.
   */
  const resetFilters = () => setState({ q: null, category: null, sort: null, page: null });

  const query: ProductListQuery = {
    q: state.q,
    category: state.category,
    sort: state.sort,
    page: state.page,
    pageSize: DEFAULT_PAGE_SIZE,
  };

  return { state, query, setSearch, setCategory, setSort, setPage, resetFilters };
};
