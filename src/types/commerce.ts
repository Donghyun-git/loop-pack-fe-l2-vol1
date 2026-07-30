import type { Category, CategoryId, Product, ProductSort } from '@/entities/product';

export type MockApiScenario = 'empty' | 'error';

export type ProductListQuery = {
  q?: string;
  category?: CategoryId | 'all';
  sort?: ProductSort;
  page?: number;
  pageSize?: number;
};

export type ProductListResponse = {
  products: Product[];
  categories: Category[];
  totalCount: number;
  page: number;
  pageSize: number;
};

export type ApiErrorResponse = {
  message: string;
};
